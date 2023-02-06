import { ipcRenderer } from "electron";
import type { IpcRendererEvent } from "electron";

import { themeApp } from "../Store/Themes";

export function initCommonIpc() {
  ipcRenderer.on("loadCurrentTheme", (_: IpcRendererEvent, theme: Themes.Theme) => {
    console.log("loadCurrentTheme, theme: ", theme);
    themeApp.set(theme);
  });
}
