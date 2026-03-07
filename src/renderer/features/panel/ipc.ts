import { NEW_FILE_TAB_TITLE } from 'Const';
import {
  tabsStore,
  currentTabStore,
  menuStore,
  panelZoomStore,
  newFileVisibleStore,
  communityTabStore,
} from './stores';

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
      onSetUsingMicrophone: (
        callback: (data: { id: number; isUsingMicrophone: boolean }) => void
      ) => () => void;
      onSetIsInVoiceCall: (
        callback: (data: { id: number; isInVoiceCall: boolean }) => void
      ) => () => void;
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

export function initPanelIpc() {
  const api = window.panelAPI;

  if (!api) {
    console.error('panelAPI not available - preload script may not have loaded');
    return;
  }

  api.frontReady();

  api.onCloseAllTabs(() => {
    tabsStore.set([]);
  });

  api.onDidTabAdd((data) => {
    tabsStore.addTab({
      id: data.id,
      url: data.url,
      title: data.title ?? 'Recent Files',
      focused: data.focused,
      order: data.title === NEW_FILE_TAB_TITLE ? 0 : undefined,
    });

    if (data.focused) {
      currentTabStore.set(data.id);
    }

    if (data.title === NEW_FILE_TAB_TITLE) {
      currentTabStore.set(data.id);
      api.setTabFocus(data.id);
    }
  });

  api.onSetTitle((data) => {
    if (data.title === 'New Tab') {
      return;
    }

    tabsStore.updateTab({ id: data.id, title: data.title });
  });

  api.onTabWasClosed((tabId) => {
    tabsStore.deleteTab(tabId);
  });

  api.onFocusTab((tabId) => {
    currentTabStore.set(tabId);
  });

  api.onNewFileBtnVisible((visible) => {
    newFileVisibleStore.set(visible);
  });

  api.onSetUsingMicrophone((data) => {
    tabsStore.updateTab({ id: data.id, isUsingMicrophone: data.isUsingMicrophone });
  });

  api.onSetIsInVoiceCall((data) => {
    tabsStore.updateTab({ id: data.id, isInVoiceCall: data.isInVoiceCall });
  });

  api.onIsMainMenuOpen((isOpen) => {
    menuStore.set(isOpen);
  });

  api.onSetPanelScale((scale: number) => {
    panelZoomStore.set(scale);
  });

  api.onLoadSettings((settings: Types.SettingsInterface) => {
    panelZoomStore.set(settings.ui.scalePanel);
  });

  api.onOpenCommunity(() => {
    communityTabStore.set(true);
    currentTabStore.set('communityTab');
  });

  api.onCommunityTabWasClose(() => {
    communityTabStore.set(false);
    currentTabStore.set('mainTab');
  });

  api.onSetLoading((tabId, loading) => {
    tabsStore.updateTab({ id: tabId, loading });
  });
}
