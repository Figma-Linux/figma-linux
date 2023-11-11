import { ipcRenderer } from "electron";
import { NEW_FILE_TAB_TITLE } from "Const";
import { currentTab, tabs, newFileVisible, communityTabVisible } from "../store";

export function closeNewFileTab() {
  const tab = tabs.getTabByTitle(NEW_FILE_TAB_TITLE);

  if (tab) {
    tabs.deleteTab(tab.id);
    ipcRenderer.send("closeTab", tab.id);
  }
}

export function onClickHome(svelteEvent: { detail: MouseEvent }) {
  const mouseButton = svelteEvent.detail.button;

  switch (mouseButton) {
    // left mouse button
    case 0: {
      ipcRenderer.send("setFocusToMainTab");
      currentTab.set("mainTab");
      newFileVisible.set(true);

      closeNewFileTab();

      break;
    }
    // right mouse button
    case 2: {
      ipcRenderer.send("openMainTabMenu");
      break;
    }
  }
}

export function onClickCommunity(svelteEvent: { detail: MouseEvent }) {
  const mouseButton = svelteEvent.detail.button;

  switch (mouseButton) {
    // left mouse button
    case 0: {
      ipcRenderer.send("setFocusToCommunityTab");
      currentTab.set("communityTab");
      newFileVisible.set(true);

      closeNewFileTab();

      break;
    }
    // wheel mouse button
    case 1: {
      communityTabVisible.set(false);
      ipcRenderer.send("closeCommunityTab");
      break;
    }
    // right mouse button
    case 2: {
      ipcRenderer.send("openCommunityTabMenu");
      break;
    }
  }
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
