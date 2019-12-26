import { promises } from "fs";

import Ext from "Main/ExtensionManager";

export async function loadExtensionManifest(
  id: number,
): Promise<Extensions.ExtensionWithManifest | Extensions.ExtensionWithError> {
  const extensionPath = Ext.getPath(id);

  try {
    const manifest = await promises.readFile(extensionPath, { encoding: "utf8" });
    const lastKnownName = Ext.getOrUpdateKnownNameFromManifest(id, manifest);

    return { path: extensionPath, lastKnownName, manifest };
  } catch (ex) {
    return { path: extensionPath, lastKnownName: Ext.getLastKnownName(id), error: ex + "" };
  }
}
