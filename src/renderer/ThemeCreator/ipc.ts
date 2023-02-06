import { ipcRenderer } from "electron";
import type { IpcRendererEvent } from "electron";

import { creatorTheme } from "./store";

export function initIpc() {
  ipcRenderer.on("loadCreatorTheme", (_: IpcRendererEvent, theme: Themes.Theme) => {
    creatorTheme.set(theme);
  });
}
