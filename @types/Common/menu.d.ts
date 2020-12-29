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
  type CutsomClick = (item: _MenuItemConstructorOptions, window: _BrowserWindow, event: Event) => void;

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
      plugin: string;
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
      disabled?: boolean;
      type: "run-menu-action";
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
    click?: NativeClick | CutsomClick;
  }
  interface ParamsAction {
    action: string;
    click?: NativeClick | CutsomClick;
  }
  interface ParamsCommand {
    command: string;
    click?: NativeClick | CutsomClick;
  }
}
