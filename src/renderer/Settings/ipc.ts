import { ipcRenderer } from "electron";
import type { IpcRendererEvent } from "electron";

import {
  themes as themesStore,
  settings as settingsStore,
  themesLoaded,
  creatorsThemes,
} from "./store";

export function initIpc() {
  ipcRenderer.on("themesLoaded", (_: IpcRendererEvent, themes: Themes.Theme[]) => {
    themesStore.set(themes);
    themesLoaded.set(true);
  });
  ipcRenderer.on("loadCreatorThemes", (_: IpcRendererEvent, themes: Themes.Theme[]) => {
    creatorsThemes.set(themes);
  });
  settingsStore.set(ipcRenderer.sendSync("getSettings"));

  ipcRenderer.send("frontReady");
}
