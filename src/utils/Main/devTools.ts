import type { WebContents } from "electron";

export const toggleDetachedDevTools = (webContents: WebContents) => {
  if (!webContents || webContents.isDevToolsOpened()) {
    webContents.closeDevTools();

    return;
  }

  webContents.openDevTools({ mode: "detach" });
};
