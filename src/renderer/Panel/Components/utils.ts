import { NEW_FILE_TAB_TITLE } from "Const";
import { currentTab, tabs, newFileVisible, communityTabVisible } from "../store";

// Helper to get the panelAPI
const api = () => window.panelAPI;

export function closeNewFileTab() {
  const tab = tabs.getTabByTitle(NEW_FILE_TAB_TITLE);

  if (tab) {
    tabs.deleteTab(tab.id);
    api().closeTab(tab.id);
  }
}

export function onClickHome(svelteEvent: { detail: MouseEvent }) {
  const mouseButton = svelteEvent.detail.button;

  switch (mouseButton) {
    // left mouse button
    case 0: {
      api().setFocusToMainTab();
      currentTab.set("mainTab");
      newFileVisible.set(true);

      closeNewFileTab();

      break;
    }
    // right mouse button
    case 2: {
      api().openMainTabMenu(0, 0);
      break;
    }
  }
}

export function onClickCommunity(svelteEvent: { detail: MouseEvent }) {
  const mouseButton = svelteEvent.detail.button;

  switch (mouseButton) {
    // left mouse button
    case 0: {
      api().setFocusToCommunityTab();
      currentTab.set("communityTab");
      newFileVisible.set(true);

      closeNewFileTab();

      break;
    }
    // wheel mouse button
    case 1: {
      communityTabVisible.set(false);
      api().closeCommunityTab();
      break;
    }
    // right mouse button
    case 2: {
      api().openCommunityTabMenu(0, 0);
      break;
    }
  }
}
export function onClickNewProject() {
  api().newProject("design");
  newFileVisible.set(false);
}

export function closeTab(id: number) {
  const tab = tabs.getTabByTitle(NEW_FILE_TAB_TITLE);

  if (tab && tab.id === id) {
    newFileVisible.set(true);
  }

  tabs.deleteTab(id);
  api().closeTab(id);
}

export function tabFocus(id: number) {
  const tab = tabs.getTab(id);

  if (tab.title !== NEW_FILE_TAB_TITLE) {
    currentTab.set(id);
    api().setTabFocus(id);

    const newFileTab = tabs.getTabByTitle(NEW_FILE_TAB_TITLE);
    if (newFileTab) {
      tabs.deleteTab(newFileTab.id);
      api().closeTab(newFileTab.id);
      newFileVisible.set(true);
    }
  }
}
