import { app, shell, clipboard, Menu, MenuItemConstructorOptions, BrowserWindow } from "electron";

import { storage } from "Main/Storage";
import { MENU_WIDTH, LINKS } from "Const";
import { logger } from "Main/Logger";

type MICO = MenuItemConstructorOptions;

export default class MenuManager {
  private menu: Menu;
  private _menu: Map<number, Menu.State> = new Map();

  constructor() {}

  public getMenu(state?: Menu.State): Menu {
    const template: MICO[] = [
      this.item("New Window", "newWindow", "Ctrl+N"),
      this.item("New Tab", "newFile", "Ctrl+T"),
      this.item("Open File Browser", "openFileBrowser", "Ctrl+O"),
      this.item("Open File URL from Clipboard", "openFileUrlClipboard", "Ctrl+Shift+O"),
      { type: "separator" },
      this.item("Close Window", "closeCurrentWindow", "Ctrl+Shift+W"),
      this.item("Close Tab", "closeCurrentTab", "Ctrl+W", state?.actionCheckedState["close-tab"]),
      this.item("Reopen Closed Tab", "reopenClosedTab", "Ctrl+Shift+T"),
    ];

    if (state?.recentClosedTabsMenuData?.length > 0) {
      template.push({
        type: "submenu",
        label: "Recently Closed Tabs",
        submenu: state.recentClosedTabsMenuData.map((data) => ({
          type: "normal",
          label: data.title,
          click: (_, window) => {
            app.emit("restoreClosedTab", window.id, data.title, data.url);
          },
        })),
      });
    }

    template.push({ type: "separator" });

    if (state?.pluginMenuData?.length > 0) {
      template.push({
        label: "Plugins",
        submenu: this.parseFigmaMenu(state.pluginMenuData),
      });
    } else {
      template.push(this.pluginsMenu());
    }

    if (state?.widgetMenuData?.length > 0) {
      template.push({
        label: "Widgets",
        submenu: this.parseFigmaMenu(state.widgetMenuData),
      });
    } else {
      template.push(this.widgetsMenu());
    }

    template.push({ type: "separator" });

    template.push(this.item("Settings", "openSettingsView"));
    template.push(this.helpMenu());

    template.push({ type: "separator" });

    template.push(this.item("Quit", "quitApp"));

    this.menu = Menu.buildFromTemplate(template);

    return this.menu;
  }

  public openMainMenuHandler(width: number, window: BrowserWindow, callback?: () => void) {
    this.menu.popup({
      callback,
      window,
      x: width - MENU_WIDTH,
      y: storage.settings.app.panelHeight,
    });
  }

  public openMainTabMenuHandler(window: BrowserWindow, tabId: number, url: string) {
    const context: MenuItemConstructorOptions[] = [
      {
        id: "copyUrl",
        label: "Copy Url",
        click: (): void => {
          clipboard.writeText(encodeURI(url));
        },
      },
      {
        id: "reload",
        label: "Reload",
        visible: true,
        click: () => {
          app.emit("reloadTab", tabId);
        },
      },
    ];

    const menu = Menu.buildFromTemplate(context);

    menu.popup({
      window,
    });
  }
  public openCommunityTabMenuHandler(window: BrowserWindow, tabId: number, url: string) {
    const context: MenuItemConstructorOptions[] = [
      {
        id: "copyUrl",
        label: "Copy Url",
        click: (): void => {
          clipboard.writeText(encodeURI(url));
        },
      },
      { type: "separator" },
      {
        id: "openInBrowser",
        label: "Open in Browser",
        click: (): void => {
          shell.openExternal(url);
        },
      },
      { type: "separator" },
      {
        id: "reload",
        label: "Reload",
        visible: true,
        click: () => {
          app.emit("reloadTab", tabId);
        },
      },
      { type: "separator" },
      {
        id: "close",
        label: "Close",
        visible: true,
        click: () => {
          app.emit("closeCommunityTab");
        },
      },
    ];

    const menu = Menu.buildFromTemplate(context);

    menu.popup({
      window,
    });
  }
  public openTabMenuHandler(window: BrowserWindow, tabId: number, url: string) {
    const context: MenuItemConstructorOptions[] = [
      {
        id: "copyUrl",
        label: "Copy Url",
        click: (): void => {
          clipboard.writeText(encodeURI(url));
        },
      },
      { type: "separator" },
      {
        id: "openInBrowser",
        label: "Open in Browser",
        click: (): void => {
          shell.openExternal(url);
        },
      },
      { type: "separator" },
      {
        id: "reload",
        label: "Reload",
        visible: true,
        click: () => {
          app.emit("reloadTab", tabId);
        },
      },
      { type: "separator" },
      {
        id: "close",
        label: "Close",
        visible: true,
        click: (_, window) => {
          app.emit("closeTab", window.id, tabId);
        },
      },
    ];

    const menu = Menu.buildFromTemplate(context);

    menu.popup({
      window,
    });
  }

  public getTabMenu(tabId: number) {
    return this._menu.get(tabId);
  }
  public setTabMenu(tabId: number, menu: Menu.State) {
    let state = this._menu.get(tabId) ?? {};

    state = {
      ...state,
      ...menu,
    };

    this._menu.set(tabId, state);
  }

  private item(label: string, id: string, accelerator?: string, enabled: boolean = true) {
    const props: MenuItemConstructorOptions = {
      label,
      enabled,
      id,
      click: (_, window) => app.emit(id, window.id),
    };

    if (accelerator) {
      props.accelerator = accelerator;
    }

    return props;
  }
  private openExternal(label: string, url: string) {
    return {
      label,
      click() {
        shell.openExternal(url);
      },
    };
  }

  private parseFigmaMenuItemName(itemName: Menu.MenuItemName): string {
    if (typeof itemName === "string") {
      return itemName;
    }

    switch (itemName.type) {
      case "plugin-name": {
        return itemName.plugin;
      }
      case "string-key": {
        return itemName.string;
      }
      default: {
        const msg = `Invalid name type item: ${JSON.stringify(itemName)}`;
        logger.info(msg);
        return msg;
      }
    }
  }

  private parseFigmaMenu(figmaMenu: Menu.MenuItem[]): MICO[] {
    const template: MICO[] = [];

    for (const item of figmaMenu) {
      if (item.type === "separator") {
        template.push({ type: "separator" });
        continue;
      }

      const menuItem: MICO = {
        type: typeof item.propertyValue === "boolean" ? "checkbox" : "normal",
        enabled: !item.disabled,
        checked: !!item.propertyValue, // the figma doesn't send the false value for checkbox items :(
        label: this.parseFigmaMenuItemName(item.name),
      };

      if (item.submenu) {
        menuItem.type = "submenu";
        menuItem.submenu = this.parseFigmaMenu(item.submenu);
      } else {
        menuItem.click = (_, window) => {
          app.emit("handlePluginMenuAction", window.id, item.menuAction);
        };
      }

      template.push(menuItem);
    }

    return template;
  }

  private pluginsMenu(): MenuItemConstructorOptions {
    return {
      label: "Plugins",
      submenu: [
        {
          label: "Manage plugins...",
          click() {
            app.emit("handlePluginManageAction");
          },
        },
      ],
    };
  }
  private widgetsMenu(): MenuItemConstructorOptions {
    return {
      label: "Widgets",
      submenu: [
        {
          label: "Manage widgets...",
          click() {
            app.emit("handlePluginManageAction");
          },
        },
      ],
    };
  }
  private helpMenu(): MenuItemConstructorOptions {
    return {
      role: "help",
      submenu: [
        this.openExternal("Help Page", LINKS.HELP_PAGE),
        this.openExternal("Plugins documentation", LINKS.PLUGINS_DOCS),
        this.openExternal("Community Forum", LINKS.FIGMA_COMMUNITY_FORUM),
        this.openExternal("Figma Linux Community Forum", LINKS.FIGMA_LINUX_COMMUNITY_FORUM),
        this.openExternal("Figma Linux in Telegram", LINKS.FIGMA_LINUX_TELEGRAM),
        this.openExternal("Figma Linux Themes", LINKS.THEMES_REPO),
        this.openExternal("Video Tutorials", LINKS.VIDEO_TUTORIALS),
        this.openExternal("Release Notes", LINKS.RELEASE_NOTES),
        this.openExternal("Legal Summary", LINKS.LEGAL_SUMMARY),
        { type: "separator" },
        this.item("Sign Out", "signOut"),
        { type: "separator" },
        this.item("Toggle Developer Tools", "toggleCurrentTabDevTools", "Ctrl+Alt+I"),
        this.item(
          "Toggle Window Developer Tools",
          "toggleCurrentWindowDevTools",
          "Shift+Ctrl+Alt+I",
        ),
        this.item(
          "Toggle Settings View Developer Tools",
          "toggleSettingsDeveloperTools",
          "Shift+Ctrl+Alt+S",
        ),
        this.item("GPU", "chromeGpu"),
      ],
    };
  }
}
