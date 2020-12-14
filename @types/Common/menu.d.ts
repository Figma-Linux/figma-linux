declare namespace Menu {
  /**
   * Import Electron types
   */
  type _MenuItemConstructorOptions = import("electron").MenuItemConstructorOptions;
  type _MenuItem = import("electron").MenuItem;
  type _BrowserWindow = import("electron").BrowserWindow;
  type _KeyboardEvent = import("electron").KeyboardEvent;

  /**
   * Public types
   */
  type MenuItem = Items.MenuName | Items.PluginItem | Items.Separator | Items.Submenu | Items.Menu | Items.StringKey;

  type MenuAction = {
    type: string;
  };

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

  interface PluginMenuItem extends _MenuItemConstructorOptions {
    pluginMenuAction?: MenuAction;
  }
}
