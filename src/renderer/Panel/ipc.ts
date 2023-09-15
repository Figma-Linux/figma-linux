import { ipcRenderer } from "electron";
import { NEW_FILE_TAB_TITLE } from "Const";

import {
  currentTab,
  tabs,
  isMenuOpen,
  panelZoom,
  newFileVisible,
  communityTabVisible,
} from "./store";

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
      order: data.title === NEW_FILE_TAB_TITLE ? 0 : undefined,
    });

    if (data.focused) {
      currentTab.set(data.id);
    }

    if (data.title === NEW_FILE_TAB_TITLE) {
      currentTab.set(data.id);
      ipcRenderer.send("setTabFocus", data.id);
    }
  });
  ipcRenderer.on("setTitle", (_, data) => {
    if (data.title === "New Tab") {
      return;
    }

    tabs.updateTab({ id: data.id, title: data.title });
  });
  ipcRenderer.on("tabWasClosed", (_, tabId) => {
    tabs.deleteTab(tabId);
  });
  ipcRenderer.on("focusTab", (_, tabId) => {
    currentTab.set(tabId);
  });
  ipcRenderer.on("newFileBtnVisible", (_, visible) => {
    newFileVisible.set(visible);
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
  ipcRenderer.on("openCommunity", (_) => {
    communityTabVisible.set(true);
    currentTab.set("communityTab");
  });
  ipcRenderer.on("communityTabWasClose", (_) => {
    communityTabVisible.set(false);
    currentTab.set("mainTab");
  });
}
