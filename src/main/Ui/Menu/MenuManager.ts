import {
  app,
  shell,
  clipboard,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  BrowserWindow,
} from "electron";

import { storage } from "Main/Storage";
import { MENU_WIDTH, ACTION_TAB_STATE } from "Const";
import { setMenuFromTemplate, buildActionToMenuItemMap } from "./menu";
import MenuState from "./MenuState";

export default class MenuManager {
  private menu: Menu;
  private menuState: MenuState;

  constructor() {
    this.menuState = new MenuState();
  }

  public initMainMenu(template?: MenuItemConstructorOptions[]) {
    let pluginMenuData: Menu.MenuItem[] = [];
    this.menu = setMenuFromTemplate(pluginMenuData, template);
    const menuItemMap = buildActionToMenuItemMap(this.menu);

    this.menu = this.resetMenu(pluginMenuData, template);

    app.on("os-menu-invalidated", (state) => {
      if (Array.isArray(state.pluginMenuData)) {
        pluginMenuData = state.pluginMenuData;

        this.menu = this.resetMenu(pluginMenuData, template);
      }

      if (!state.actionState) return;

      for (const action of Object.keys(menuItemMap)) {
        const menuItem: MenuItem = menuItemMap[action];
        menuItem.enabled = state.actionState ? !!state.actionState[action] : false;
      }
    });
  }

  public openMainMenuHandler(width: number, window: BrowserWindow, callback?: () => void) {
    this.menu.popup({
      callback,
      window,
      x: width - MENU_WIDTH,
      y: storage.settings.app.panelHeight,
    });
  }

  public openTabMenuHandler(
    window: BrowserWindow,
    appUrl: string,
    webUrl: string,
    closeCb: () => void,
  ) {
    const context: MenuItemConstructorOptions[] = [
      {
        id: "copyAppUrl",
        label: "Copy App Url",
        click: (): void => {
          clipboard.writeText(encodeURI(appUrl));
        },
      },
      {
        id: "copyUrl",
        label: "Copy Url",
        click: (): void => {
          clipboard.writeText(encodeURI(webUrl));
        },
      },
      { type: "separator" },
      {
        id: "openInBrowser",
        label: "Open in Browser",
        click: (): void => {
          shell.openExternal(webUrl);
        },
      },
      { type: "separator" },
      {
        id: "close",
        label: "Close",
        visible: true,
        click: closeCb,
      },
    ];

    const menu = Menu.buildFromTemplate(context);

    menu.popup({
      window,
    });
  }

  public updatePluginState = (pluginMenuData: Menu.MenuItem[]) => {
    this.menuState.updatePluginState(pluginMenuData);
  };
  public updateMainTabState() {
    this.menuState.updateInFileBrowserActionState();
  }
  public updateTabState(state?: MenuState.State) {
    if (state) {
      this.menuState.updateActionState(state);
      return;
    }

    this.menuState.updateActionState(ACTION_TAB_STATE);
  }

  private resetMenu(pluginMenuData: Menu.MenuItem[], template?: MenuItemConstructorOptions[]) {
    const mainMenu: Menu = setMenuFromTemplate(pluginMenuData, template);
    const menuItemMap = buildActionToMenuItemMap(mainMenu);

    for (const action of Object.keys(menuItemMap)) {
      const menuItem: MenuItem = menuItemMap[action];
      menuItem.enabled = this.menuState.actionState ? !!this.menuState.actionState[action] : false;
    }

    return mainMenu;
  }
}
