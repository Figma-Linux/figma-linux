import * as E from "electron";

import { INITACTIONINITSTATE, ACTIONTABSTATE, ACTIONFILEBROWSERSTATE } from "Const";

/**
 * Class for manage of actionState.
 * For main menu items.
 */
class MenuState {
	public static actionState: MenuState.State = INITACTIONINITSTATE;
	public static pluginMenuData: any[] = [];

	private static update = (state: MenuState.MenuStateParams) => {
		let app = E.remote ? E.remote.app : E.app;

		if (state.actionState) {
			MenuState.actionState = {
				...MenuState.actionState,
				...state.actionState
			};
		}

		if (state.pluginMenuData && state.pluginMenuData.length > 0) {
			MenuState.pluginMenuData = state.pluginMenuData;
		}

		const params: MenuState.MenuStateParams = {
			actionState: MenuState.actionState,
			pluginMenuData: MenuState.pluginMenuData
		};

		app.emit('os-menu-invalidated', params);
	}

	public static updateActionState = (state: MenuState.State) => {
		MenuState.update({ actionState: state });
	}

	public static updatePluginState = (pluginMenuData: Menu.MenuItem[]) => {
		MenuState.update({ pluginMenuData });
	}

	public static updateInProjectActionState = () => {
		MenuState.update({ actionState: ACTIONTABSTATE });
	}

	public static updateInFileBrowserActionState = () => {
		MenuState.update({ actionState: ACTIONFILEBROWSERSTATE });
	}
}

export default MenuState;