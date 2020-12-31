import * as E from "electron";

import { INITACTIONINITSTATE, ACTIONTABSTATE, ACTIONFILEBROWSERSTATE } from "Const";

/**
 * Class for manage of actionState.
 * For main menu items.
 */
class MenuState {
  public static actionState: MenuState.State = INITACTIONINITSTATE;
  public static pluginMenuData: Menu.MenuItem[] = [];

  private static update = (state: MenuState.MenuStateParams) => {
    const app = E.remote ? E.remote.app : E.app;

    if (state.actionState) {
      MenuState.actionState = {
        ...MenuState.actionState,
        ...state.actionState,
      };
    }

    if (Array.isArray(state.pluginMenuData)) {
      MenuState.pluginMenuData = state.pluginMenuData;
    }

    const params: MenuState.MenuStateParams = {
      actionState: MenuState.actionState,
      pluginMenuData: MenuState.pluginMenuData,
    };

    app.emit("os-menu-invalidated", params);
  };

  public static updateActionState = (state: MenuState.State) => {
    MenuState.update({ actionState: state });
  };

  public static updatePluginState = (pluginMenuData: Menu.MenuItem[]) => {
    MenuState.update({ pluginMenuData });
  };

  public static updateInProjectActionState = () => {
    const newPluginMenuData = MenuState.pluginMenuData.map(item => {
      if (item.visible === false) {
        return {
          ...item,
          disabled: item.disabled || false,
          visible: true,
        };
      }

      return item;
    });

    MenuState.update({ actionState: ACTIONTABSTATE, pluginMenuData: newPluginMenuData });
  };

  public static updateInFileBrowserActionState = () => {
    const newPluginMenuData = MenuState.pluginMenuData.map(item => {
      if (item.type === "run-menu-action" && item.name.key === "plugins-menu-manage") {
        return {
          ...item,
          visible: true,
          disabled: false,
        };
      }

      return {
        ...item,
        visible: false,
      };
    });

    MenuState.update({ actionState: ACTIONFILEBROWSERSTATE, pluginMenuData: newPluginMenuData });
  };
}

export default MenuState;
