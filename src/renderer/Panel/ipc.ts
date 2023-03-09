import { ipcRenderer } from "electron";

import { currentTab, tabs, isMenuOpen, panelZoom } from "./store";

export function initIpc() {
  ipcRenderer.send("frontReady");

  ipcRenderer.on("closeAllTabs", () => {
    tabs.set([]);
  });
  ipcRenderer.on("didTabAdd", (_, data) => {
    tabs.addTab({
      id: data.id,
      url: data.url,
      title: data.title ?? "Recent Files",
      focused: data.focused,
    });

    if (data.focused) {
      currentTab.set(data.id);
    }
  });
  ipcRenderer.on("setTitle", (_, data) => {
    tabs.updateTab({ id: data.id, title: data.title });
  });
  ipcRenderer.on("focusTab", (_, tabId) => {
    currentTab.set(tabId);
  });
  ipcRenderer.on("setUsingMicrophone", (_, data) => {
    tabs.updateTab({ id: data.id, isUsingMicrophone: data.isUsingMicrophone });
  });
  ipcRenderer.on("setIsInVoiceCall", (_, data) => {
    tabs.updateTab({ id: data.id, isInVoiceCall: data.isInVoiceCall });
  });

  ipcRenderer.on("isMainMenuOpen", (_, isOpen) => {
    isMenuOpen.set(isOpen);
  });
  ipcRenderer.on("setPanelScale", (_, scale: number) => {
    panelZoom.set(scale);
  });
  ipcRenderer.on("loadSettings", (_, settings: Types.SettingsInterface) => {
    panelZoom.set(settings.ui.scalePanel);
  });
}
