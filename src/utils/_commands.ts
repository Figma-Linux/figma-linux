import * as E from 'electron';

import * as Utils from 'Utils';
import WM from '../main/window/WindowManager';

export const commands = (): Map<string, Function> => {
    const map = new Map<string, Function>();

    map.set('toggle-developer-tools', () => {
        const windowManager = WM.instance;
        const webContents = windowManager.mainWindow.getBrowserView().webContents;

        if (webContents) {
            Utils.toggleDetachedDevTools(webContents)
        }
    });
    map.set('toggle-window-developer-tools', () => {
        Utils.toggleDetachedDevTools(WM.instance.mainWindow.getBrowserView().webContents);
    });

    map.set('close-window', () => {
        if (E.remote) {
            E.remote.app.exit();
        } else {
            E.app.exit();
        }
    });

    return map;
};
