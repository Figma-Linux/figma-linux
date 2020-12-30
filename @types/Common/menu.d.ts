declare namespace Menu {
  /**
   * Import Electron types
   */
  type _MenuItemConstructorOptions = import("electron").MenuItemConstructorOptions;
  type _MenuItem = import("electron").MenuItem;
  type _BrowserWindow = import("electron").BrowserWindow;

  /**
   * Public types
   */
  type NativeClick = (item: _MenuItem, window: _BrowserWindow, event: Event) => void;
  type CustomClick = (item: _MenuItemConstructorOptions, window: _BrowserWindow, event: Event) => void;

  type Params = ParamsId | ParamsAction | ParamsCommand;
  type MenuItem = Items.MenuName & (Items.PluginItem | Items.Separator | Items.Submenu | Items.Menu | Items.StringKey);

  type MenuAction = {
    type: string;
  };

  type PluginMenuItem = PluginMenuItemOptions & _MenuItemConstructorOptions;

  namespace Items {
    interface MenuName {
      type: string;
      key: string;
      string: string;
      plugin?: string;
      visible?: boolean;
      click?: (menuItem: Menu.PluginMenuItem, browserWindow: _BrowserWindow | undefined, event: KeyboardEvent) => void;
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
