import { ipcRenderer } from "electron";
import type { IpcRendererEvent } from "electron";

import { themes as themesStore } from "./store";

export function initIpc() {
  ipcRenderer.on("themesLoaded", (_: IpcRendererEvent, themes: Themes.Theme[]) => {
    themesStore.set(themes);
  });
}
