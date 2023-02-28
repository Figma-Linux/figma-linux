import { ipcRenderer } from "electron";
import type { IpcRendererEvent } from "electron";

import { themes as themesStore, settings as settingsStore } from "./store";

export function initIpc() {
  ipcRenderer.on("themesLoaded", (_: IpcRendererEvent, themes: Themes.Theme[]) => {
    themesStore.set(themes);
  });
  ipcRenderer.on("loadSettings", (_: IpcRendererEvent, settings: Types.SettingsInterface) => {
    settingsStore.set(settings);
  });

  ipcRenderer.send("frontReady");
}
