import * as Chokidar from "chokidar";
import { promises } from "fs";
import { dirname, join } from "path";
import * as Settings from "electron-settings";

class ExtensionManager {
  private extensionMap: Map<number, Extensions.Extension>;
  private manifestObservers: Function[];

  constructor() {
    this.extensionMap = new Map();
    this.manifestObservers = [];
  }

  public addPath(path: string): { id: number; existed: boolean } {
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
      this.loadExtensionManifest(id).then(result => {
        this.notifyObservers({ type: "added", id, localLoadResult: result });
      });
    } else {
      this.extensionMap.set(id, { path });
    }

    // storage_1.scheduleSaveSoon();

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
      } catch (e) { }
    }

    this.extensionMap.delete(id);
    // storage_1.scheduleSaveSoon();
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
      } catch (e) { }

      return entry.lastKnownName;
    }

    return undefined;
  }

  public getAllIds(): number[] {
    return Array.from(this.extensionMap.keys());
  }

  public addObserver(callback: Function): void {
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
  public removeObserver(callback: Function): void {
    const index = this.manifestObservers.indexOf(callback);

    if (index !== -1) {
      this.manifestObservers.splice(index, 1);

      if (!this.manifestObservers.length) {
        this.extensionMap.forEach(entry => {
          if (entry.watcher) {
            entry.watcher.close();
            delete entry.watcher;
          }
        });
      }
    }
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
      const manifest = await promises.readFile(extensionPath, { encoding: "utf8" });
      const lastKnownName = this.getOrUpdateKnownNameFromManifest(id, manifest);

      return { path: extensionPath, lastKnownName, manifest };
    } catch (ex) {
      return { path: extensionPath, lastKnownName: this.getLastKnownName(id), error: ex + "" };
    }
  }

  public async getLocalFileExtensionSource(
    id: number,
  ): Promise<{ source: string, html: string } | { buildErrCode: boolean, stderr: string, path: string }> {
    const extensionPath = this.getPath(id);

    const manifest = await promises.readFile(extensionPath, { encoding: "utf8" });
    const parsed = JSON.parse(manifest);
    if (parsed && parsed.main && parsed.ui) {
      let [main, ui] = await Promise.all([
        promises.readFile(join(dirname(extensionPath), parsed.main), { encoding: "utf8" }),
        promises.readFile(join(dirname(extensionPath), parsed.ui), { encoding: "utf8" }),
      ])
      return { source: main, html: ui };
    }
    throw new Error("manifest is invalid: " + JSON.stringify(manifest));
  }

  private notifyObservers(args: Extensions.NotifyObserverParams): void {
    this.manifestObservers.forEach(callback => {
      try {
        callback(args);
      } catch (ex) {
        console.error(ex);
      }
    });
  }

  private fileWatcher(id: number): void {
    this.loadExtensionManifest(id).then(result => {
      this.notifyObservers({ type: "changed", id, localLoadResult: result });
    });
  }
}

export default new ExtensionManager();
