import { app, ipcMain, shell } from "electron";
import type { IpcMainInvokeEvent, IpcMainEvent } from "electron";
import * as fs from "fs";
import { resolve, relative, extname, join, basename, parse } from "path";
import * as cp from "child_process";
import * as Chokidar from "chokidar";
import { dialogs } from "./Dialogs";
import { storage } from "Storage";
import { logger } from "./Logger";
import { FILE_EXTENSION_WHITE_LIST, FILE_WHITE_LIST, MANIFEST_FILE_NAME } from "Const";
import { ALLOW_CODE_FILES, ALLOW_EXT_FILES, ALLOW_UI_FILES, sanitizeFileName } from "Utils/Common";
import { access, mkPath } from "Utils/Main";

type ObserverCallback = (args: any) => void;

export default class ExtensionManager {
  private registeredCancelCallbackMap: Map<string, () => void> = new Map();
  private extensionMap: Map<number, Extensions.Extension> = new Map();
  private manifestObservers: Array<Extensions.ManifestObserver> = [];
  private codeObservers: Array<Extensions.ManifestObserver> = [];

  constructor() {
    this.reload();
    this.registerEvents();
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

    if (entry) {
      try {
        for (const file of entry.observeFiles) {
          file[1].close();
        }
      } catch (e) {
        console.error(e);
      }
    }

    this.extensionMap.delete(id);
    this.save();
    this.notifyManifestObservers({ id, type: "removed" });
    this.notifyCodeObservers({ id, type: "removed" });
  }

  public getLastKnownName(id: number): string | undefined {
    const entry = this.extensionMap.get(id);

    if (entry) {
      return entry.lastKnownName;
    }

    return undefined;
  }

  public getOrUpdateKnownNameFromManifest(
    id: number,
    manifest: string,
  ): [string, string] | undefined {
    const entry = this.extensionMap.get(id);

    if (entry) {
      try {
        const parsed = JSON.parse(manifest) as Extensions.ManifestFile;
        if (parsed && parsed.name) {
          entry.lastKnownName = parsed.name;
          entry.lastKnownPluginId = parsed.id;
        }
      } catch (e) {
        console.error(e);
      }

      return [entry.lastKnownName, entry.lastKnownPluginId];
    }

    return undefined;
  }

  public addCodeObserver(callback: ObserverCallback, reg: RegExp): void {
    this.codeObservers.push(callback);

    if (this.codeObservers.length <= 2) {
      this.extensionMap.forEach((entry, id) => {
        if (entry.observeFiles.size > 0) {
          for (const file of entry.observeFiles) {
            if (file[0] === MANIFEST_FILE_NAME) {
              continue;
            }
            if (!reg.test(file[0])) {
              continue;
            }

            const filepath = resolve(entry.path, file[0]);
            const watcher = Chokidar.watch(filepath, undefined);

            watcher.on("all", () => this.codeWatcher(id));
            watcher.on("error", (error) =>
              logger.error(`chokidar error for ${filepath}: ${error.name}: ${error.message}`),
            );

            entry.observeFiles.set(file[0], watcher);
          }
        }
      });
    }
  }
  public removeCodeObserver(callback: ObserverCallback): void {
    const index = this.codeObservers.indexOf(callback);

    if (index !== -1) {
      this.codeObservers.splice(index, 1);

      if (!this.codeObservers.length) {
        this.extensionMap.forEach((entry) => {
          for (const file of entry.observeFiles) {
            if (file[1]) {
              file[1].close();
              entry.observeFiles.set(file[0], null);
            }
          }
        });
      }
    }
  }
  public addManifestObserver(callback: ObserverCallback): void {
    this.manifestObservers.push(callback);

    if (this.manifestObservers.length === 1) {
      this.extensionMap.forEach((entry, id) => {
        if (entry.observeFiles.size > 0 && entry.observeFiles.has(MANIFEST_FILE_NAME)) {
          const filepath = resolve(entry.path, MANIFEST_FILE_NAME);
          const watcher = Chokidar.watch(filepath, undefined);

          watcher.on("all", () => this.manifestWatcher(id));
          watcher.on("error", (error) =>
            logger.error(`chokidar error for ${filepath}: ${error.name}: ${error.message}`),
          );

          entry.observeFiles.set(MANIFEST_FILE_NAME, watcher);
        }
      });
    }
  }
  public removeManifestObserver(callback: ObserverCallback): void {
    const index = this.manifestObservers.indexOf(callback);

    if (index !== -1) {
      this.manifestObservers.splice(index, 1);

      if (!this.manifestObservers.length) {
        this.extensionMap.forEach((entry) => {
          const manifest = entry.observeFiles.get(MANIFEST_FILE_NAME);

          manifest.close();
          entry.observeFiles.set(MANIFEST_FILE_NAME, null);
        });
      }
    }
  }

  save() {
    storage.settings.app.savedExtensions = this.saveToJson();
    storage.save();
  }

  reload() {
    const extensions = storage.settings.app.savedExtensions;

    this.loadFromJson(extensions);
  }

  public saveToJson(): Extensions.ExtensionJson[] {
    return [...this.extensionMap.entries()].map(([id, { observeFiles, ...rest }]) => {
      return { id, ...rest, files: [...observeFiles.keys()] };
    });
  }

  public loadFromJson(extensions: Extensions.ExtensionJson[]): void {
    if (Array.isArray(extensions) && extensions.length > 0) {
      for (const extension of extensions) {
        const { id, files, ...rest } = extension;

        this.extensionMap.set(id, {
          ...rest,
          observeFiles: new Map((files ?? []).map((f) => [f, null])),
        });
      }
    }
  }

  public async loadExtensionManifest(
    id: number,
  ): Promise<Extensions.ExtensionWithManifest | Extensions.ExtensionWithError> {
    const extensionPath = this.getPath(id);

    try {
      const manifest = await fs.promises.readFile(resolve(extensionPath, MANIFEST_FILE_NAME), {
        encoding: "utf8",
      });
      const [lastKnownName, lastKnownPluginId] = this.getOrUpdateKnownNameFromManifest(
        id,
        manifest,
      );

      return {
        path: extensionPath,
        lastKnownName,
        lastKnownPluginId,
        cachedContainsWidget: false,
        observeFiles: new Map(),
        manifest,
      };
    } catch (ex) {
      return {
        path: extensionPath,
        lastKnownPluginId: "0",
        cachedContainsWidget: false,
        lastKnownName: this.getLastKnownName(id),
        observeFiles: new Map(),
        error: ex + "",
      };
    }
  }

  public async getSource(extensionPath: string): Promise<Extensions.ExtensionSource> {
    const manifest = JSON.parse(
      await fs.promises.readFile(resolve(extensionPath, MANIFEST_FILE_NAME), { encoding: "utf8" }),
    );
    const result: Extensions.ExtensionSource = {
      stdout: "",
      stderr: "",
      path: "",
    };

    if (typeof manifest.build === "string") {
      result.path = process.env.PATH || "";
      await new Promise<void>((resolve) => {
        cp.exec(manifest.build, { cwd: extensionPath }, (error, stdout, stderr) => {
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
      const propPath = resolve(extensionPath, fileName);
      if (relative(extensionPath, propPath).startsWith("..")) {
        throw new Error(
          `Manifest "${property}" file must be located in same directory, or a subdirectory, as manifest`,
        );
      }
      return fs.promises.readFile(propPath, { encoding: "utf8" });
    };
    const loadFilesFromManifestProperty = async (prop: string): Promise<Dict<string>> => {
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
        const thenHandler = (fileContent: string) => {
          files[key] = fileContent;
        };
        filesArr.push(loadFileFromManifestProperty(prop, key).then(thenHandler));
      }

      await Promise.all(filesArr);

      return files;
    };

    result.source = await loadFileFromManifestProperty("main");
    if (!result.source) {
      result.source = await loadFileFromManifestProperty("script");
    }
    if (!result.source) {
      throw new Error("Missing or empty script");
    }
    if (typeof manifest.ui === "string") {
      result.html = await loadFileFromManifestProperty("ui");
    } else {
      result.html = await loadFilesFromManifestProperty("ui");
    }
    if (!result.html) {
      result.html = await loadFileFromManifestProperty("html");
    }

    return result;
  }

  private notifyManifestObservers(args: Extensions.NotifyObserverParams): void {
    this.manifestObservers.forEach((callback) => {
      try {
        callback(args);
      } catch (ex) {
        logger.error(ex);
      }
    });
  }
  private notifyCodeObservers(args: Extensions.NotifyObserverParams): void {
    this.codeObservers.forEach((callback) => {
      try {
        callback(args);
      } catch (ex) {
        logger.error(ex);
      }
    });
  }

  private async manifestWatcher(id: number) {
    const result = await this.loadExtensionManifest(id);

    this.notifyManifestObservers({ type: "changed", id, localLoadResult: result });
  }
  private async codeWatcher(id: number) {
    this.notifyCodeObservers({ type: "changed", id, manifestFileId: id });
  }

  private async observerAction(type: Extensions.ObserverType, id: number, filepath: string) {
    if (filepath.match(MANIFEST_FILE_NAME)) {
      const result = await this.loadExtensionManifest(id);

      this.notifyManifestObservers({ type, id, localLoadResult: result });
    } else {
      this.notifyCodeObservers({ type, id, manifestFileId: id });
    }
  }
  private async fileAdded(id: number, filepath: string) {
    this.observerAction("added", id, filepath);
  }
  private async fileChanged(id: number, filepath: string) {
    this.observerAction("changed", id, filepath);
  }
  private notifyFileAdded(extensionId: number) {
    const extension = this.extensionMap.get(extensionId);

    for (const file of extension.observeFiles) {
      const filepath = resolve(extension.path, file[0]);

      this.fileAdded(extensionId, filepath);
    }
  }
  private getManifestFromFiles(
    files: WebApi.WriteNewExtensionDirectoryToDiskFile[],
  ): Extensions.ManifestFile | undefined {
    for (const file of files) {
      if (file.name === MANIFEST_FILE_NAME) {
        return JSON.parse(file.content);
      }
    }
  }
  private async addExtension(path: string, files: WebApi.WriteNewExtensionDirectoryToDiskFile[]) {
    const id = this.generateFileId();
    const observeFiles = this.validateExtensionFiles(files);
    const manifest = this.getManifestFromFiles(files);

    await this.saveExtensionFiles(path, files);

    this.extensionMap.set(id, {
      path,
      observeFiles: new Map(observeFiles.map((v) => [v, null])),
      lastKnownName: manifest.name,
      lastKnownPluginId: manifest.id,
      cachedContainsWidget: false,
    });

    this.addWatcher(id);
    this.notifyFileAdded(id);
    this.save();

    return id;
  }

  private addWatcher(extensionId: number) {
    const extension = this.extensionMap.get(extensionId);

    for (const file of extension.observeFiles) {
      const filepath = resolve(extension.path, file[0]);

      const watcher = Chokidar.watch(filepath, undefined);
      if (file[0] === MANIFEST_FILE_NAME) {
        watcher.on("all", () => this.manifestWatcher(extensionId));
      } else {
        watcher.on("all", () => this.codeWatcher(extensionId));
      }

      extension.observeFiles.set(file[0], watcher);
    }
  }
  private pathExists(path: string) {
    for (const [id, entry] of this.extensionMap.entries()) {
      if (entry.path === path) {
        return { id, existed: true };
      }
    }
  }

  private generateFileId(): number {
    let id = 1;
    while (this.extensionMap.has(id)) {
      id++;
    }
    return id;
  }
  private validateFileName(file: WebApi.WriteNewExtensionDirectoryToDiskFile) {
    if (
      !FILE_WHITE_LIST.includes(file.name) &&
      (!FILE_EXTENSION_WHITE_LIST.includes(extname(file.name)) ||
        !/^[\w/]+(?:\.\w+)*\.\w+/.test(file.name) ||
        file.name !== sanitizeFileName(file.name))
    ) {
      throw new Error(`Filename "${file.name}" not allowed`);
    }
  }
  private validateManidestFile(file: WebApi.WriteNewExtensionDirectoryToDiskFile) {
    if (typeof file.content !== "string") {
      throw new Error("Manifest must be a string");
    }

    const manifest = JSON.parse(file.content);

    if (typeof manifest !== "object" || manifest === null) {
      throw new Error("Manifest must be a JSON object");
    }
    if (manifest.build) {
      throw new Error(`Manifest 'build' value "${manifest.build}" not allowed`);
    }
  }
  private validateExtensionFiles(files: WebApi.WriteNewExtensionDirectoryToDiskFile[]): string[] {
    const observeFiles = new Set<string>();
    let manifestFile = null;

    for (const file of files) {
      this.validateFileName(file);

      if (file.name === MANIFEST_FILE_NAME) {
        this.validateManidestFile(file);

        manifestFile = file;
      }

      if (ALLOW_EXT_FILES.test(file.name)) {
        observeFiles.add(file.name);
      }
    }

    if (!manifestFile) {
      throw new Error("No manifest found");
    }

    return [...observeFiles];
  }
  private async saveExtensionFiles(
    path: string,
    files: WebApi.WriteNewExtensionDirectoryToDiskFile[],
  ): Promise<string> {
    const accessDir = await access(path);

    if (accessDir) {
      logger.warn("Overwriting existing files or directories not supported");
      return;
    }

    await mkPath(path);

    let lastKnownPluginId: string = "";
    const saveFilesPromises = [];
    const pluginDirName = basename(path);

    for (const file of files) {
      const filePath = join(path, file.name);
      const promise = fs.promises
        .writeFile(filePath, file.content, { encoding: "utf8" })
        .catch((error) => {
          logger.error(
            `Cannot save file: ${filePath} for extension: "${pluginDirName}", error:\n`,
            error,
          );
        });
      saveFilesPromises.push(promise);

      if (file.name === MANIFEST_FILE_NAME) {
        lastKnownPluginId = JSON.parse(file.content).id;
      }
    }

    await Promise.all(saveFilesPromises);

    return lastKnownPluginId;
  }
  private openExtensionDirectory(event: IpcMainEvent, data: WebApi.ExtensionId): void {
    const extensionDirectory = this.getPath(data.id);

    shell.showItemInFolder(extensionDirectory);
  }
  private removeLocalFileExtension(event: IpcMainEvent, data: WebApi.ExtensionId): void {
    this.removePath(data.id);
  }
  private async createMultipleNewLocalFileExtensions(
    event: IpcMainInvokeEvent,
    data: WebApi.CreateMultipleExtension,
  ) {
    const added: any[] = [];
    const existed: any[] = [];
    const result = await dialogs.showOpenDialog(data.options);

    if (!result) {
      return { added, existed };
    }

    const processEntry = async (entryPath: string, depth: number, topLevel: any) => {
      const stats = await fs.promises.stat(entryPath);

      if (stats.isDirectory() && depth > 0) {
        const fileNames = (await fs.promises.readdir(entryPath)).filter((name) => name[0] !== ".");

        await Promise.all(
          fileNames.map((name) => processEntry(resolve(entryPath, name), depth - 1, false)),
        );
      } else if (basename(entryPath) === MANIFEST_FILE_NAME) {
        const path = parse(entryPath).dir;
        const exists = this.pathExists(path);
        const manifest = await fs.promises.readFile(entryPath, { encoding: "utf8" });

        if (exists) {
          existed.push(exists.id);
        } else {
          const manifestJson = JSON.parse(manifest) as Extensions.ManifestFile;
          const files = [
            { name: MANIFEST_FILE_NAME, content: manifest },
            { name: manifestJson.main, content: "" },
          ];
          if (typeof manifestJson.ui === "object") {
            for (const file of Object.values(manifestJson.ui)) {
              files.push({ name: file, content: "" });
            }
          } else {
            files.push({ name: manifestJson.ui, content: "" });
          }

          added.push(await this.addExtension(path, files));
        }
      } else if (topLevel) {
        throw new Error(`Manifest must be named '${MANIFEST_FILE_NAME}'`);
      }
    };

    await Promise.all(result.map((name) => processEntry(name, data.depth, true)));

    return { added, existed };
  }

  private async writeNewExtensionDirectoryToDisk(
    event: IpcMainInvokeEvent,
    data: WebApi.WriteNewExtensionDirectoryToDisk,
  ) {
    const path = await dialogs.showSaveDialog({
      title: data.dir.name
        ? "Choose plugin directory location"
        : "Choose plugin name and directory location",
      // TODO: if lastSavedPluginDir is undefined, use home dir
      defaultPath: storage.settings.app.lastSavedPluginDir
        ? resolve(storage.settings.app.lastSavedPluginDir, data.dir.name)
        : data.dir.name,
    });

    if (!path) {
      return null;
    }

    const exists = this.pathExists(path);
    if (exists) {
      return exists;
    }

    storage.settings.app.lastSavedPluginDir = parse(path).dir;

    const id = await this.addExtension(path, data.dir.files);

    return id;
  }
  private async getLocalManifestFileExtensionIdsToCachedMetadataMap(event: IpcMainInvokeEvent) {
    const cache: WebApi.ExtensionsCachedMetadataMap = {};

    this.extensionMap.forEach((value, key) => {
      cache[key] = {
        lastKnownPluginId: value.lastKnownPluginId,
        cachedContainsWidget: value.cachedContainsWidget,
      };
    });

    return cache;
  }
  private async getLocalFileExtensionManifest(event: IpcMainInvokeEvent, data: WebApi.ExtensionId) {
    return this.loadExtensionManifest(data.id);
  }
  private async getLocalFileExtensionSource(event: IpcMainInvokeEvent, data: WebApi.ExtensionId) {
    return this.getSource(this.getPath(data.id));
  }
  private async getAllLocalFileExtensionIds(event: IpcMainInvokeEvent) {
    return Array.from(this.extensionMap.keys());
  }

  private registerManifestChangeObserver(event: IpcMainEvent, callbackID: number, args?: any) {
    const observer = (args: any) => {
      app.emit("handleCallbackForTab", event.sender.id, callbackID, args);
    };
    const cancel = () => {
      this.removeManifestObserver(observer);
    };

    this.addManifestObserver(observer);
    this.registeredCancelCallbackMap.set(`${callbackID}:${event.sender.id}`, cancel);
  }
  private registerCodeChangeObserver(event: IpcMainEvent, callbackID: number, args?: any) {
    const observer = (args: any) => {
      app.emit("handleCallbackForTab", event.sender.id, callbackID, args);
    };
    const cancel = () => {
      this.removeCodeObserver(observer);
    };

    this.addCodeObserver(observer, ALLOW_CODE_FILES);
    this.registeredCancelCallbackMap.set(`${callbackID}:${event.sender.id}`, cancel);
  }
  private registerUiChangeObserver(event: IpcMainEvent, callbackID: number, args?: any) {
    const observer = (args: any) => {
      app.emit("handleCallbackForTab", event.sender.id, callbackID, args);
    };
    const cancel = () => {
      this.removeCodeObserver(observer);
    };

    this.addCodeObserver(observer, ALLOW_UI_FILES);
    this.registeredCancelCallbackMap.set(`${callbackID}:${event.sender.id}`, cancel);
  }
  private webCancelCallback(event: IpcMainEvent, callbackID: number) {
    const key = `${callbackID}:${event.sender.id}`;

    this.registeredCancelCallbackMap.get(key)();
    this.registeredCancelCallbackMap.delete(key);
  }

  private registerEvents() {
    ipcMain.on(
      `web-callback:registerManifestChangeObserver`,
      this.registerManifestChangeObserver.bind(this),
    );
    ipcMain.on(
      `web-callback:registerCodeChangeObserver`,
      this.registerCodeChangeObserver.bind(this),
    );
    ipcMain.on(`web-callback:registerUiChangeObserver`, this.registerUiChangeObserver.bind(this));
    ipcMain.on("web-cancel-callback", this.webCancelCallback.bind(this));

    ipcMain.on("openExtensionDirectory", this.openExtensionDirectory.bind(this));
    ipcMain.on("removeLocalFileExtension", this.removeLocalFileExtension.bind(this));

    ipcMain.handle(
      "writeNewExtensionDirectoryToDisk",
      this.writeNewExtensionDirectoryToDisk.bind(this),
    );
    ipcMain.handle(
      "createMultipleNewLocalFileExtensions",
      this.createMultipleNewLocalFileExtensions.bind(this),
    );
    ipcMain.handle(
      "getLocalManifestFileExtensionIdsToCachedMetadataMap",
      this.getLocalManifestFileExtensionIdsToCachedMetadataMap.bind(this),
    );
    ipcMain.handle("getLocalFileExtensionManifest", this.getLocalFileExtensionManifest.bind(this));
    ipcMain.handle("getLocalFileExtensionSource", this.getLocalFileExtensionSource.bind(this));
    ipcMain.handle("getAllLocalFileExtensionIds", this.getAllLocalFileExtensionIds.bind(this));
  }
}
