import { ipcRenderer } from "electron";
import type { IpcRendererEvent } from "electron";

import { themeApp } from "../Store/Themes";

export function initCommonIpc() {
  ipcRenderer.on("loadCurrentTheme", (_: IpcRendererEvent, theme: Themes.Theme) => {
    themeApp.set(theme);
  });
}
