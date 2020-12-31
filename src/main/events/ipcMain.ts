import * as E from "electron";
import * as path from "path";
import * as fs from "fs";

import { MANIFEST_FILE_NAME, FILE_EXTENSION_WHITE_LIST } from "Const";
import { listenToWebBindingPromise, listenToWebRegisterCallback, showSaveDialog, access, mkPath } from "Utils/Main";
import { sanitizeFileName } from "Utils/Common";

import WindowManager from "Main/window/WindowManager";
import { logger } from "Main/Logger";
import { storage } from "Main/Storage";
import Ext from "Main/ExtensionManager";

export const registerIpcMainHandlers = () => {
  E.ipcMain.handle("createMultipleNewLocalFileExtensions", async (sender, data) => {
    const added: any[] = [];
    const existed: any[] = [];

    const windowManager = WindowManager.instance;
    const dialogResult = await E.dialog.showOpenDialog(windowManager.mainWindow, data.options);

    if (!dialogResult || dialogResult.canceled) {
      return { added, existed };
    }

    const pickedPaths = dialogResult.filePaths;

    async function processEntry(entryPath: string, depth: number, topLevel: any) {
      const stats = await fs.promises.stat(entryPath);

      if (stats.isDirectory() && depth > 0) {
        let fileNames = await fs.promises.readdir(entryPath);
        fileNames = fileNames.filter(name => name[0] !== ".");

        await Promise.all(fileNames.map(name => processEntry(path.resolve(entryPath, name), depth - 1, false)));
      } else if (path.basename(entryPath) === MANIFEST_FILE_NAME) {
        const res = Ext.addPath(entryPath);

        if (res.existed) {
          existed.push(res.id);
        } else {
          added.push(res.id);
        }
      } else if (topLevel) {
        throw new Error("Manifest must be named 'manifest.json'");
      }
    }

    await Promise.all(pickedPaths.map(name => processEntry(name, data.depth, true)));

    return { added, existed };
  });

  E.ipcMain.handle("getAllLocalFileExtensionIds", async () => {
    return Ext.getAllIds();
  });

  E.ipcMain.handle("getLocalFileExtensionManifest", async (sender, id) => {
    return Ext.loadExtensionManifest(id);
  });

  E.ipcMain.on("removeLocalFileExtension", async (sender, id) => {
    Ext.removePath(id);
  });

  E.ipcMain.on("openExtensionDirectory", async (sender, id) => {
    const extensionDirectory = path.parse(Ext.getPath(id)).dir;

    E.shell.openPath(extensionDirectory);
  });

  E.ipcMain.handle("getLocalFileExtensionSource", async (sender, id) => {
    return Ext.getLocalFileExtensionSource(id);
  });

  listenToWebBindingPromise("openExtensionDirectory", async (webContents: E.WebContents, id: number) => {
    console.error("TODO");
  });

  E.ipcMain.handle("writeNewExtensionToDisk", async (sender, data) => {
    let manifest: Extensions.ManifestFile | null = null;
    let manifestFile = null;

    for (const file of data.files) {
      if (
        !FILE_EXTENSION_WHITE_LIST.includes(path.extname(file.name)) ||
        !/^\w+(?:\.\w+)*\.\w+/.test(file.name) ||
        file.name !== sanitizeFileName(file.name)
      ) {
        throw new Error(`Filename "${file.name}" not allowed`);
      }
      if (file.name === MANIFEST_FILE_NAME) {
        if (typeof file.content !== "string") {
          throw new Error("Manifest must be a string");
        }

        manifest = JSON.parse(file.content);
        manifestFile = file;

        if (typeof manifest !== "object" || manifest === null) {
          throw new Error("Manifest must be a JSON object");
        }
        if (manifest.build) {
          throw new Error(`Manifest 'build' value "${manifest.build}" not allowed`);
        }
      }
    }

    if (manifest == null || manifestFile == null) {
      throw new Error("No manifest found");
    }

    const dirName = sanitizeFileName(data.dirName);
    const windowManager = WindowManager.instance;
    const lastDir = storage.get().app.lastSavedPluginDir;
    const dir = lastDir ? `${lastDir}/${dirName}` : dirName;

    const saveDir = await showSaveDialog(windowManager.mainWindow, {
      title: manifest.name ? "Choose plugin directory location" : "Choose plugin name and directory location",
      defaultPath: dir,
    });

    if (!saveDir) {
      return undefined;
    }

    const basename = path.basename(saveDir);

    storage.setLastPluginDirectory(path.parse(saveDir).dir);

    if (!basename) {
      throw new Error("Invalid directory name");
    }
    if (!manifest.name) {
      manifest.name = basename;
      manifestFile.content = JSON.stringify(manifest, undefined, 2);
    }
    const accessDir = await access(saveDir);

    if (accessDir) {
      throw new Error("Overwriting existing files or directories not supported");
    }

    await mkPath(saveDir);

    const saveFilesPromises = [];
    for (const file of data.files) {
      const filePath = path.join(saveDir, file.name);
      const promise = fs.promises.writeFile(filePath, file.content, { encoding: "utf8" }).catch(error => {
        logger.error(`Cannot save file: ${filePath} for extension: "${manifest.name}", error:\n`, error);
      });
      saveFilesPromises.push(promise);
    }

    await Promise.all(saveFilesPromises);

    const res = Ext.addPath(path.join(saveDir, MANIFEST_FILE_NAME));

    if (res.existed) {
      throw new Error("Extension unexpectedly already added");
    }

    return res.id;
  });

  listenToWebRegisterCallback(
    "registerManifestChangeObserver",
    (webContents: E.WebContents, args: any, callback: () => void) => {
      Ext.addObserver(callback);

      return () => {
        Ext.removeObserver(callback);
      };
    },
  );
};
