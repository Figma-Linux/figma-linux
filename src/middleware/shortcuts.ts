import * as E from "electron";

import { shortcutsMap, handleCommandItemClick, handleItemAction } from "Utils";
import shortcutMan from "./ShortcutMan";

export default () => {
    const currentWindow = E.remote.BrowserWindow.getAllWindows()[0];

    // TODO: get from settings
    let isMenuHidden: boolean = false;
    let actionState: any = {};

    E.remote.app.on('updateActionState', (state: any) => {
        actionState = state;
    });
    E.remote.app.on('hiddeMenu', isHidden => {
        isMenuHidden = isHidden;
    });

    for (let shortcut of shortcutsMap) {
        if (shortcut.accelerator === '') continue;

        switch(shortcut.type) {
            case 'action': {
                shortcutMan.bind(shortcut.accelerator.toLocaleLowerCase(), () => {
                    if (!isMenuHidden) return;
                    if  (shortcut.value === 'save-as') return;

                    actionState[shortcut.value] && handleItemAction({ action: shortcut.value, accelerator: shortcut.accelerator }, currentWindow);
                });
            } break;
            case 'command': {
                shortcutMan.bind(shortcut.accelerator.toLocaleLowerCase(), () => {
                    if (!isMenuHidden) return;

                    handleCommandItemClick({ command: shortcut.value, accelerator: shortcut.accelerator }, currentWindow);
                });
            } break;
            case 'id': {
                shortcutMan.bind(shortcut.accelerator.toLocaleLowerCase(), () => {
                    if (!isMenuHidden && shortcut.value !== 'toggle-menu') return;

                    E.remote.app.emit('handleCommand', shortcut.value);
                });
            } break;

            default: {

            }
        }
    }
}