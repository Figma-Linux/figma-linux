import * as E from "electron";

import { getMenuTemplate } from "Utils/Main";
import { stringOfActionMenuItemName, assertNever } from "Utils/Common";
import MenuState from "Main/MenuState";

export const handlePluginMenuAction = (item: Menu.PluginMenuItem, window: E.BrowserWindow): void => {
  const currentView = window.getBrowserView();

  if (item && item.pluginMenuAction && currentView) {
    currentView.webContents.send("handlePluginMenuAction", item.pluginMenuAction);
  }
};

export const electronOfPluginMenuItem = (input: Menu.MenuItem): Menu.PluginMenuItem | undefined => {
  switch (input.type) {
    case "run-menu-action": {
      const item = input as Menu.Items.Menu;
      const label = stringOfActionMenuItemName(item.name);
      return {
        type: "normal",
        label,
        click: handlePluginMenuAction,
        enabled: !item.disabled,
        pluginMenuAction: item.menuAction,
      };
    }
    case "separator": {
      return {
        type: "separator",
      };
    }
    case "submenu": {
      const item = input as Menu.Items.Submenu;
      return {
        type: "submenu",
        label: item.name,
        submenu: item.submenu.map(electronOfPluginMenuItem),
      };
    }
    default: {
      assertNever(input);
    }
  }

  return undefined;
};

export const setMenuFromTemplate = (
  pluginMenuData: Menu.MenuItem[],
  template?: E.MenuItemConstructorOptions[],
): E.Menu => {
  let mainMenu: E.Menu;

  const pluginMenuItems = pluginMenuData.length === 0 ? undefined : pluginMenuData.map(electronOfPluginMenuItem);

  if (template) {
    mainMenu = E.Menu.buildFromTemplate(template as E.MenuItemConstructorOptions[]);
  } else {
    mainMenu = E.Menu.buildFromTemplate(getMenuTemplate(pluginMenuItems) as E.MenuItemConstructorOptions[]);
  }

  E.Menu.setApplicationMenu(mainMenu);

  return mainMenu;
};

export const buildActionToMenuItemMap = (menu: E.Menu) => {
  const map: any = {};
  const parseMenu = (menu: any) => {
    for (const item of menu.items) {
      if (item.action) {
        map[item.action] = item;
      }
      if (item.submenu) {
        parseMenu(item.submenu);
      }
    }
  };

  parseMenu(menu);
  return map;
};

export const resetMenu = (pluginMenuData: Menu.MenuItem[], template?: E.MenuItemConstructorOptions[]) => {
  const mainMenu: E.Menu = setMenuFromTemplate(pluginMenuData, template);
  const menuItemMap = buildActionToMenuItemMap(mainMenu);

  for (const action of Object.keys(menuItemMap)) {
    const menuItem: E.MenuItem = menuItemMap[action];
    menuItem.enabled = MenuState.actionState ? !!MenuState.actionState[action] : false;
  }
};

export const item = (label: string, accelerator: string, params: E.MenuItemConstructorOptions) => {
  const props: E.MenuItemConstructorOptions = {
    label,
    enabled: true,
    ...params,
  };

  if (accelerator) {
    props.accelerator = accelerator;
  }

  return props;
};

export const commandToMainProcess = (item: Menu.PluginMenuItem) => {
  E.app.emit("handle-command", item.id);
};

export const handleCommandItemClick = (item: Menu.PluginMenuItem, window: E.BrowserWindow) => {
  const currentView = window.getBrowserView();

  currentView.webContents.send("handlePageCommand", item.id);
};

export const handleItemAction = (item: Menu.PluginMenuItem, window: E.BrowserWindow) => {
  // FIXME: ugly hack
  if (item.accelerator && !/ctrl|alt|shift|meta/i.test(item.accelerator as string)) return;

  const currentView = window.getBrowserView();

  currentView.webContents.send("handleAction", item.id, "os-menu");
};
