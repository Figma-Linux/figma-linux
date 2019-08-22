import * as E from 'electron';

import { toggleDetachedDevTools } from 'Utils/Main';

export const commands = (): Map<string, Function> => {
    const map = new Map<string, Function>();

    map.set('toggle-developer-tools', (item: E.MenuItemConstructorOptions, window: E.BrowserWindow) => {
        const browserView = window.getBrowserView();

        if (browserView && browserView.webContents) {
            toggleDetachedDevTools(browserView.webContents)
        }
    });
    map.set('toggle-window-developer-tools', (item: E.MenuItemConstructorOptions, window: E.BrowserWindow) => {
        toggleDetachedDevTools(window.webContents);
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
