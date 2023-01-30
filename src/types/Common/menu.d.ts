declare namespace Menu {
  /**
   * Public types
   */
  type NativeClick = (item: Electron.MenuItem, window: Electron.BrowserWindow, event: Event) => void;
  type CustomClick = (item: Electron.MenuItemConstructorOptions, window: Electron.BrowserWindow, event: Event) => void;

  type Params = ParamsId | ParamsAction | ParamsCommand;
  type MenuItem = Items.MenuName & (Items.PluginItem | Items.Separator | Items.Submenu | Items.Menu | Items.StringKey);

  type MenuAction = {
    type: string;
  };

  class PluginMenuItem extends Electron.MenuItem {
    public type: "separator" | "submenu" | "normal" | "checkbox" | "radio";
    public pluginMenuAction?: MenuAction;
  }

  namespace Items {
    interface MenuName {
      type: string;
      key: string;
      string: string;
      plugin?: string;
      visible?: boolean;
      disabled?: boolean;
      click?: (
        menuItem: Menu.PluginMenuItem,
        browserWindow: Electron.BrowserWindow | undefined,
        event: KeyboardEvent,
      ) => void;
    }

    interface Separator {
      type: "separator";
    }
    interface Submenu {
      type: "submenu";
      name: string;
      submenu: [MenuName & Separator & Submenu & Menu & PluginItem & StringKey];
    }
    interface Menu {
      type: "run-menu-action";
      disabled?: boolean;
      menuAction: MenuAction;
      name: MenuName;
    }
    interface PluginItem {
      type: "plugin-name";
      plugin: string;
    }
    interface StringKey {
      type: "string-key";
      string: string;
    }
  }

  interface PluginMenuItemOptions {
    pluginMenuAction?: MenuAction;
  }

  interface ParamsId {
    id: string;
    click?: NativeClick | CustomClick;
  }
  interface ParamsAction {
    action: string;
    click?: NativeClick | CustomClick;
  }
  interface ParamsCommand {
    command: string;
    click?: NativeClick | CustomClick;
  }
}
