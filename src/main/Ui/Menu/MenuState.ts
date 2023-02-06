import { app } from "electron";

import { INITACTIONINITSTATE, ACTION_TAB_STATE, ACTIONFILEBROWSERSTATE } from "Const";

/**
 * Class for manage of actionState.
 * For main menu items.
 */
export default class MenuState {
  public actionState: MenuState.State = INITACTIONINITSTATE;
  public pluginMenuData: Menu.MenuItem[] = [];

  private update = (state: MenuState.MenuStateParams) => {
    if (state.actionState) {
      this.actionState = {
        ...this.actionState,
        ...state.actionState,
      };
    }

    if (Array.isArray(state.pluginMenuData)) {
      this.pluginMenuData = state.pluginMenuData;
    }

    const params: MenuState.MenuStateParams = {
      actionState: this.actionState,
      pluginMenuData: this.pluginMenuData,
    };

    app.emit("os-menu-invalidated", params);
  };

  public updateActionState = (state: MenuState.State) => {
    this.update({ actionState: state });
  };

  public updatePluginState = (pluginMenuData: Menu.MenuItem[]) => {
    this.update({ pluginMenuData });
  };

  public updateInProjectActionState = () => {
    const newPluginMenuData = this.pluginMenuData.map((item) => {
      if (item.visible === false) {
        return {
          ...item,
          disabled: item.disabled || false,
          visible: true,
        };
      }

      return item;
    });

    this.update({ actionState: ACTION_TAB_STATE, pluginMenuData: newPluginMenuData });
  };

  public updateInFileBrowserActionState = () => {
    const newPluginMenuData = this.pluginMenuData.map((item) => {
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

    this.update({ actionState: ACTIONFILEBROWSERSTATE, pluginMenuData: newPluginMenuData });
  };
}
