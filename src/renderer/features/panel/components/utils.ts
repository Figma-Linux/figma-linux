import { NEW_FILE_TAB_TITLE } from 'Const';
import {
  tabsStore,
  currentTabStore,
  newFileVisibleStore,
  communityTabStore,
} from '../stores';

// Helper to get the panelAPI
const api = () => window.panelAPI;

export function closeNewFileTab() {
  const tab = tabsStore.getTabByTitle(NEW_FILE_TAB_TITLE);

  if (tab) {
    tabsStore.deleteTab(tab.id);
    api().closeTab(tab.id);
  }
}

export function onClickHome(event: MouseEvent) {
  const mouseButton = event.button;

  switch (mouseButton) {
    // left mouse button
    case 0: {
      api().setFocusToMainTab();
      currentTabStore.set('mainTab');
      newFileVisibleStore.set(true);

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

export function onClickCommunity(event: MouseEvent) {
  const mouseButton = event.button;

  switch (mouseButton) {
    // left mouse button
    case 0: {
      api().setFocusToCommunityTab();
      currentTabStore.set('communityTab');
      newFileVisibleStore.set(true);

      closeNewFileTab();

      break;
    }
    // wheel mouse button
    case 1: {
      communityTabStore.set(false);
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
  api().newProject('design');
  newFileVisibleStore.set(false);
}

export function closeTab(id: number) {
  const tab = tabsStore.getTabByTitle(NEW_FILE_TAB_TITLE);

  if (tab && tab.id === id) {
    newFileVisibleStore.set(true);
  }

  tabsStore.deleteTab(id);
  api().closeTab(id);
}

export function tabFocus(id: number) {
  const tab = tabsStore.getTab(id);

  if (tab && tab.title !== NEW_FILE_TAB_TITLE) {
    currentTabStore.set(id);
    api().setTabFocus(id);

    const newFileTab = tabsStore.getTabByTitle(NEW_FILE_TAB_TITLE);
    if (newFileTab) {
      tabsStore.deleteTab(newFileTab.id);
      api().closeTab(newFileTab.id);
      newFileVisibleStore.set(true);
    }
  }
}
