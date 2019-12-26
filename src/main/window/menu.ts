import * as E from "electron";

import { setMenuFromTemplate, buildActionToMenuItemMap, resetMenu } from "Utils/Main";

const init = (template?: E.MenuItemConstructorOptions[]) => {
  let pluginMenuData: Menu.MenuItem[] = [];
  const mainMenu: E.Menu = setMenuFromTemplate(pluginMenuData, template);
  const menuItemMap = buildActionToMenuItemMap(mainMenu);

  resetMenu(pluginMenuData, template);

  E.app.on("os-menu-invalidated", state => {
    if (state.pluginMenuData && state.pluginMenuData.length > 0) {
      pluginMenuData = state.pluginMenuData;

      resetMenu(pluginMenuData, template);
    }

    if (!state.actionState) return;

    for (const action of Object.keys(menuItemMap)) {
      const menuItem: E.MenuItem = menuItemMap[action];
      menuItem.enabled = state.actionState ? !!state.actionState[action] : false;
    }
  });
};

export default init;
