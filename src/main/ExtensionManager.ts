import * as fs from "fs";
import * as path from "path";
import * as cp from "child_process";
import * as Chokidar from "chokidar";
import { storage } from "Storage";
import { logger } from "./Logger";

class ExtensionManager {
  private extensionMap: Map<number, Extensions.Extension>;
  private manifestObservers: Array<Extensions.ManifestObserver>;

  constructor() {
    this.extensionMap = new Map();
    this.manifestObservers = [];
    this.reload();
  }

  public addPath(path: string): Extensions.AddPathReturnValue {
    for (const [id, entry] of this.extensionMap.entries()) {
      if (entry.path === path) {
        return { id, existed: true };
      }
    }

    let id = 1;
    while (this.extensionMap.has(id)) {
      id++;
    }

    if (this.manifestObservers.length) {
      const watcher = Chokidar.watch(path, undefined);
      watcher.on("all", () => this.fileWatcher(id));
      this.extensionMap.set(id, { path, watcher });
      this.loadExtensionManifest(id).then((result) => {
        this.notifyObservers({ type: "added", id, localLoadResult: result });
      });
    } else {
      this.extensionMap.set(id, { path });
    }

    this.save();

    return { id, existed: false };
  }
  public getPath(id: number): string {
    const entry = this.extensionMap.get(id);

    if (!entry) {
      throw new Error("Unknown plugin");
    }

    return entry.path;
  }
  public removePath(id: number): void {
    const entry = this.extensionMap.get(id);

    if (entry && entry.watcher) {
      try {
        entry.watcher.close();
      } catch (e) {
        console.error(e);
      }
    }

    this.extensionMap.delete(id);
    this.save();
    this.notifyObservers({ id, type: "removed" });
  }

  public getLastKnownName(id: number): string | undefined {
    const entry = this.extensionMap.get(id);

    if (entry) {
      return entry.lastKnownName;
    }

    return undefined;
  }

  public getOrUpdateKnownNameFromManifest(id: number, manifest: string): string | undefined {
    const entry = this.extensionMap.get(id);

    if (entry) {
      try {
        const parsed = JSON.parse(manifest);
        if (parsed && parsed.name) {
          entry.lastKnownName = parsed.name;
        }
      } catch (e) {
        console.error(e);
      }

      return entry.lastKnownName;
    }

    return undefined;
  }

  public getAllIds(): number[] {
    return Array.from(this.extensionMap.keys());
  }

  public addObserver(callback: () => void): void {
    this.manifestObservers.push(callback);

    if (this.manifestObservers.length === 1) {
      this.extensionMap.forEach((entry, id) => {
        if (!entry.watcher) {
          entry.watcher = Chokidar.watch(entry.path, undefined);
          entry.watcher.on("all", () => this.fileWatcher(id));
        }
      });
    }
  }
  public removeObserver(callback: () => void): void {
    const index = this.manifestObservers.indexOf(callback);

    if (index !== -1) {
      this.manifestObservers.splice(index, 1);

      if (!this.manifestObservers.length) {
        this.extensionMap.forEach((entry) => {
          if (entry.watcher) {
            entry.watcher.close();
            delete entry.watcher;
          }
        });
      }
    }
  }

  save() {
    storage.saveExtension(this.saveToJson());
  }

  reload() {
    const extensions = storage.get().app.savedExtensions;

    this.loadFromJson(extensions);
  }

  public saveToJson(): Extensions.ExtensionJson[] {
    return Array.from(this.extensionMap.entries()).map(([id, { path, lastKnownName }]) => {
      return { id, manifestPath: path, lastKnownName };
    });
  }

  public loadFromJson(json: Extensions.ExtensionJson[]): void {
    if (Array.isArray(json)) {
      for (const jsonExtension of json) {
        if (
          typeof jsonExtension.id === "number" &&
          Math.trunc(jsonExtension.id) == jsonExtension.id &&
          typeof jsonExtension.manifestPath === "string"
        ) {
          this.extensionMap.set(jsonExtension.id, {
            path: jsonExtension.manifestPath,
            lastKnownName: jsonExtension.lastKnownName,
          });
        }
      }
    }
  }

  public async loadExtensionManifest(
    id: number,
  ): Promise<Extensions.ExtensionWithManifest | Extensions.ExtensionWithError> {
    const extensionPath = this.getPath(id);

    try {
      const manifest = await fs.promises.readFile(extensionPath, { encoding: "utf8" });
      const lastKnownName = this.getOrUpdateKnownNameFromManifest(id, manifest);

      return { path: extensionPath, lastKnownName, manifest };
    } catch (ex) {
      return { path: extensionPath, lastKnownName: this.getLastKnownName(id), error: ex + "" };
    }
  }

  public async getLocalFileExtensionSource(id: number): Promise<Extensions.ExtensionSource> {
    const extensionPath = this.getPath(id);
    const manifest = JSON.parse(await fs.promises.readFile(extensionPath, { encoding: "utf8" }));
    const manifestDir = path.dirname(extensionPath);
    const result: Extensions.ExtensionSource = {
      stdout: "",
      stderr: "",
      path: "",
    };

    if (manifest.build && typeof manifest.build === "string") {
      result.path = process.env.PATH || "";
      await new Promise<void>((resolve) => {
        cp.exec(manifest.build, { cwd: manifestDir }, (error, stdout, stderr) => {
          result.stdout = stdout;
          result.stderr = stderr;

          if (error) {
            result.buildErrCode = error.code;
          }

          resolve();
        });
      });

      if (result.buildErrCode) {
        return result;
      }
    }

    const loadFileFromManifestProperty = async (prop: string, key?: string) => {
      const fileName = key ? manifest[prop][key] : manifest[prop];
      const property = key ? prop + "." + key : prop;
      if (!fileName) {
        return undefined;
      }
      if (typeof fileName !== "string") {
        throw new Error(`Manifest "${property}" property must be a string`);
      }
      const propPath = path.resolve(manifestDir, fileName);
      if (path.relative(manifestDir, propPath).startsWith("..")) {
        throw new Error(
          `Manifest "${property}" file must be located in same directory, or a subdirectory, as manifest`,
        );
      }
      return fs.promises.readFile(propPath, { encoding: "utf8" });
    };
    const loadFilesFromManifestProperty = async (prop: string) => {
      if (!manifest[prop]) {
        return undefined;
      }
      if (typeof manifest[prop] !== "object") {
        throw new Error(`Manifest "${prop}" property must be an object`);
      }
      const files: Dict<string> = {};
      const filesArr = [];
      const keys = Object.keys(manifest[prop]);
      for (const key of keys) {
        filesArr.push(loadFileFromManifestProperty(prop, key));
      }
      await Promise.all(filesArr).then((htmlArr) => {
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i],
            html = htmlArr[i];
          if (html) {
            files[key] = html;
          }
        }
      });
      return files;
    };

    result.source = await loadFileFromManifestProperty("main");
    if (!result.source) {
      result.source = await loadFileFromManifestProperty("script");
    }
    if (!result.source) {
      throw new Error("Missing or empty script");
    }
    let html;
    if (typeof manifest["ui"] === "string") {
      html = await loadFileFromManifestProperty("ui");
    } else {
      html = await loadFilesFromManifestProperty("ui");
    }
    if (!html) {
      html = await loadFileFromManifestProperty("html");
    }
    if (html) {
      result.html = html;
    }
    return result;
  }

  private notifyObservers(args: Extensions.NotifyObserverParams): void {
    this.manifestObservers.forEach((callback) => {
      try {
        callback(args);
      } catch (ex) {
        logger.error(ex);
      }
    });
  }

  private fileWatcher(id: number): void {
    this.loadExtensionManifest(id).then((result) => {
      this.notifyObservers({ type: "changed", id, localLoadResult: result });
    });
  }
}

export default new ExtensionManager();
