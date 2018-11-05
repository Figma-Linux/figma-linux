import * as E from "electron";

import { INITACTIONINITSTATE, ACTIONTABSTATE, ACTIONFILEBROWSERSTATE } from "Const";

/**
 * Class for manage of actionState.
 * For main menu items.
 */
class ActionState {
	public static actionState = INITACTIONINITSTATE;

	private static update = (state?: any) => {
		let app = E.remote ? E.remote.app : E.app;

		if (state) {
			ActionState.actionState = {
				...ActionState.actionState,
				...state
			};
		}


		app.emit('updateActionState', ActionState.actionState);
	}

	public static updateActionState = (state?: any) => {
		ActionState.update(state);
	}

	public static updateInProjectActionState = () => {
		ActionState.update(ACTIONTABSTATE);
	}

	public static updateInFileBrowserActionState = () => {
		ActionState.update(ACTIONFILEBROWSERSTATE);
	}
}

export default ActionState;