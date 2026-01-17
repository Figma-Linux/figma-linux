import { NEW_FILE_TAB_TITLE } from "Const";

import {
  currentTab,
  tabs,
  isMenuOpen,
  panelZoom,
  newFileVisible,
  communityTabVisible,
} from "./store";

// Access the panelAPI exposed by the preload script
declare global {
  interface Window {
    panelAPI: {
      frontReady: () => void;
      setTabFocus: (tabId: number) => void;
      closeTab: (tabId: number) => void;
      closeAllTab: () => void;
      closeCommunityTab: () => void;
      setFocusToMainTab: () => void;
      setFocusToCommunityTab: () => void;
      openTabMenu: (tabId: number, x: number, y: number) => void;
      openMainTabMenu: (x: number, y: number) => void;
      openCommunityTabMenu: (x: number, y: number) => void;
      openMainMenu: () => void;
      windowClose: () => void;
      windowMinimize: () => void;
      windowMaximize: () => void;
      newProject: (editorType: string) => void;
      onCloseAllTabs: (callback: () => void) => () => void;
      onDidTabAdd: (callback: (data: any) => void) => () => void;
      onSetTitle: (callback: (data: { id: number; title: string }) => void) => () => void;
      onTabWasClosed: (callback: (tabId: number) => void) => () => void;
      onFocusTab: (callback: (tabId: number) => void) => () => void;
      onNewFileBtnVisible: (callback: (visible: boolean) => void) => () => void;
      onSetUsingMicrophone: (callback: (data: { id: number; isUsingMicrophone: boolean }) => void) => () => void;
      onSetIsInVoiceCall: (callback: (data: { id: number; isInVoiceCall: boolean }) => void) => () => void;
      onIsMainMenuOpen: (callback: (isOpen: boolean) => void) => () => void;
      onSetPanelScale: (callback: (scale: number) => void) => () => void;
      onLoadSettings: (callback: (settings: any) => void) => () => void;
      onOpenCommunity: (callback: () => void) => () => void;
      onCommunityTabWasClose: (callback: () => void) => () => void;
      onSetLoading: (callback: (tabId: number, loading: boolean) => void) => () => void;
      onLoadCurrentTheme: (callback: (theme: any) => void) => () => void;
    };
  }
}

export function initIpc() {
  const api = window.panelAPI;

  api.frontReady();

  api.onCloseAllTabs(() => {
    tabs.set([]);
  });

  api.onDidTabAdd((data) => {
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
      api.setTabFocus(data.id);
    }
  });

  api.onSetTitle((data) => {
    if (data.title === "New Tab") {
      return;
    }

    tabs.updateTab({ id: data.id, title: data.title });
  });

  api.onTabWasClosed((tabId) => {
    tabs.deleteTab(tabId);
  });

  api.onFocusTab((tabId) => {
    currentTab.set(tabId);
  });

  api.onNewFileBtnVisible((visible) => {
    newFileVisible.set(visible);
  });

  api.onSetUsingMicrophone((data) => {
    tabs.updateTab({ id: data.id, isUsingMicrophone: data.isUsingMicrophone });
  });

  api.onSetIsInVoiceCall((data) => {
    tabs.updateTab({ id: data.id, isInVoiceCall: data.isInVoiceCall });
  });

  api.onIsMainMenuOpen((isOpen) => {
    isMenuOpen.set(isOpen);
  });

  api.onSetPanelScale((scale: number) => {
    panelZoom.set(scale);
  });

  api.onLoadSettings((settings: Types.SettingsInterface) => {
    panelZoom.set(settings.ui.scalePanel);
  });

  api.onOpenCommunity(() => {
    communityTabVisible.set(true);
    currentTab.set("communityTab");
  });

  api.onCommunityTabWasClose(() => {
    communityTabVisible.set(false);
    currentTab.set("mainTab");
  });

  api.onSetLoading((tabId, loading) => {
    tabs.updateTab({ id: tabId, loading });
  });
}
