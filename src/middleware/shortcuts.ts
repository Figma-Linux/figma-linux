import * as E from "electron";
import * as Settings from "electron-settings";

import { shortcutsMap, handleCommandItemClick } from "Utils";
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
            case 'command': {
                shortcutMan.bind(shortcut.accelerator.toLocaleLowerCase(), () => {
                    if (!Settings.get('app.disabledMainMenu')) return;

                    console.log('command: ', !Settings.get('app.disabledMainMenu'), shortcut);

                    handleCommandItemClick({ command: shortcut.value, accelerator: shortcut.accelerator }, currentWindow);
                });
            } break;
            case 'id': {
                shortcutMan.bind(shortcut.accelerator.toLocaleLowerCase(), () => {
                    if (!Settings.get('app.disabledMainMenu')) return;

                    console.log('id: ', !Settings.get('app.disabledMainMenu'), shortcut);

                    E.remote.app.emit('handleCommand', shortcut.value);
                });
            } break;

            default: {

            }
        }
    }
}