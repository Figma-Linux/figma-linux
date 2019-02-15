import * as E from "electron";
import * as Settings from "electron-settings";

import { shortcutsMap, handleCommandItemClick, handleItemAction } from "Utils";
import shortcutMan from "./ShortcutMan";

export default () => {
    const currentWindow = E.remote.BrowserWindow.getAllWindows()[0];

    let actionState: any = {};

    E.remote.app.on('updateActionState', (state: any) => {
        actionState = state;
    });

    for (let shortcut of shortcutsMap) {
        if (shortcut.accelerator === '') continue;

        switch (shortcut.type) {
            case 'action': {
                shortcutMan.bind(shortcut.accelerator.toLocaleLowerCase(), () => {
                    console.log('Action: ', !Settings.get('app.disabledMainMenu'), shortcut);
                    if (!Settings.get('app.disabledMainMenu')) return;
                    if (shortcut.value === 'save-as') return;

                    actionState[shortcut.value] && handleItemAction({ action: shortcut.value, accelerator: shortcut.accelerator }, currentWindow);
                });
            } break;
            case 'command': {
                shortcutMan.bind(shortcut.accelerator.toLocaleLowerCase(), () => {
                    if (!Settings.get('app.disabledMainMenu')) return;

                    handleCommandItemClick({ command: shortcut.value, accelerator: shortcut.accelerator }, currentWindow);
                });
            } break;
            case 'id': {
                shortcutMan.bind(shortcut.accelerator.toLocaleLowerCase(), () => {
                    if (!Settings.get('app.disabledMainMenu')) return;

                    E.remote.app.emit('handleCommand', shortcut.value);
                });
            } break;

            default: {

            }
        }
    }
}