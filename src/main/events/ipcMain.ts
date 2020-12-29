import * as E from "electron";
import * as path from "path";
import { promises } from "fs";

import { MANIFEST_FILE_NAME } from "Const";
import { listenToWebBindingPromise, listenToWebRegisterCallback } from "Utils/Main";

import Ext from "Main/ExtensionManager";

export const registerIpcMainHandlers = () => {
  listenToWebBindingPromise(
    "createMultipleNewLocalFileExtensions",
    async (webContents: E.WebContents, options: any, depth: number) => {
      const added: any[] = [];
      const existed: any[] = [];

      const dialogResult = await E.dialog.showOpenDialog(options);

      if (!dialogResult || dialogResult.canceled) {
        return { added, existed };
      }

      const pickedPaths = dialogResult.filePaths;

      async function processEntry(entryPath: string, depth: number, topLevel: any) {
        const stats = await promises.stat(entryPath);

        if (stats.isDirectory() && depth > 0) {
          let fileNames = await promises.readdir(entryPath);
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

      await Promise.all(pickedPaths.map(name => processEntry(name, depth, true)));

      return { added, existed };
    },
  );

  listenToWebBindingPromise("getAllLocalFileExtensionIds", (webContents: E.WebContents) => {
    return Ext.getAllIds();
  });

  listenToWebBindingPromise("getLocalFileExtensionManifest", (webContents: E.WebContents, id: number) => {
    return Ext.loadExtensionManifest(id);
  });

  listenToWebBindingPromise("getLocalFileExtensionSource", (webContents: E.WebContents, id: number) => {
    return Ext.getLocalFileExtensionSource(id);
  });

  listenToWebBindingPromise("removeLocalFileExtension", async (webContents: E.WebContents, id: number) => {
    Ext.removePath(id);
  });

  listenToWebBindingPromise("openExtensionDirectory", async (webContents: E.WebContents, id: number) => {
    console.error("TODO");
  });

  type NewExtension = {
    dirName: string;
    files: Array<{ name: string; content: string }>;
  };
  listenToWebBindingPromise("writeNewExtensionToDisk", async (webContents: E.WebContents, data: NewExtension) => {
    console.error("TODO");
    return /*extId*/;
  });
  listenToWebRegisterCallback(
    "registerManifestChangeObserver",
    (webContents: E.WebContents, args: any, callback: Function) => {
      Ext.addObserver(callback);

      return () => {
        Ext.removeObserver(callback);
      };
    },
  );
};
