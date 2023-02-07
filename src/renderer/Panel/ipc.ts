import { get } from "svelte/store";
import { ipcRenderer } from "electron";

import { currentTab, tabs } from "./store";

export function initIpc() {
  ipcRenderer.send("frontReady");

  ipcRenderer.on("closeAllTabs", () => {
    tabs.set([]);
  });

  ipcRenderer.on("didTabAdd", (_, data) => {
    console.log("didTabAdd, data: ", data);
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
}
