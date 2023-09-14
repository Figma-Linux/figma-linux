import { ipcRenderer } from "electron";
import { NEW_FILE_TAB_TITLE } from "Const";
import { currentTab, tabs, newFileVisible } from "../store";

export function closeNewFileTab() {
  const tab = tabs.getTabByTitle(NEW_FILE_TAB_TITLE);

  if (tab) {
    tabs.deleteTab(tab.id);
    ipcRenderer.send("closeTab", tab.id);
  }
}

export function onClickHome() {
  ipcRenderer.send("setFocusToMainTab");
  currentTab.set(undefined);
  newFileVisible.set(true);

  closeNewFileTab();
}
export function onClickNewProject() {
  console.log("onClickNewProject");
  ipcRenderer.send("newProject");
  newFileVisible.set(false);
}

export function closeTab(id: number) {
  const tab = tabs.getTabByTitle(NEW_FILE_TAB_TITLE);

  if (tab && tab.id === id) {
    newFileVisible.set(true);
  }

  tabs.deleteTab(id);
  ipcRenderer.send("closeTab", id);
}

export function tabFocus(id: number) {
  const tab = tabs.getTab(id);

  if (tab.title !== NEW_FILE_TAB_TITLE) {
    currentTab.set(id);
    ipcRenderer.send("setTabFocus", id);

    const newFileTab = tabs.getTabByTitle(NEW_FILE_TAB_TITLE);
    if (newFileTab) {
      tabs.deleteTab(newFileTab.id);
      ipcRenderer.send("closeTab", newFileTab.id);
      newFileVisible.set(true);
    }
  }
}
