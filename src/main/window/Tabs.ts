import * as E from "electron";
import * as path from "path";

import { isDev } from "Utils";
import Fonts from "../Fonts";

interface ITabs { }

class Tabs implements ITabs {
    private static tabs: Array<E.BrowserView> = [];

    public static newTab = (url: string, options: E.Rectangle, preloadScript?: string) => {
        const tab = new E.BrowserView({
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                webSecurity: false,
                webgl: true,
                experimentalFeatures: true,
                experimentalCanvasFeatures: true,
                zoomFactor: 0.9,
                preload: path.resolve(isDev ? `${process.cwd()}/dist/` : `${__dirname}/../`, 'middleware', preloadScript || '')
            }
        });

        tab.setAutoResize({
            width: true,
            height: true
        });
        tab.setBounds(options);
        tab.webContents.loadURL(url);
        tab.webContents.on('dom-ready', () => {
            let fonts = Fonts.getFonts([
                '/usr/share/fonts',
                `${process.env.HOME}/.local/share/fonts`
            ]);
            tab.webContents.send('updateFonts', fonts);
        });
        isDev && tab.webContents.toggleDevTools();

        Tabs.tabs.push(tab);

        return tab;
    }

    public static closeAll = () => {
        Tabs.tabs = Tabs.tabs.filter(t => {
            if (t.id != 1) {
                t.destroy();
                return false;
            } else {
                return true;
            }
        });
    }
    
    public static close = (id: number) => {
        Tabs.tabs = Tabs.tabs.filter(t => {
            if (t.id != id) {
                return true;
            } else {
                t.destroy();
                return false;
            }
        });
    }

    public static reloadAll = () => Tabs.tabs.forEach(t => !t.isDestroyed() ? t.webContents.reload() : '');

    public static focus = (id: number): E.BrowserView => Tabs.tabs.find(t => t.id === id) as E.BrowserView;

    public static getAll = (): Array<E.BrowserView> => Tabs.tabs;

}

export default Tabs;
export {
    ITabs
}
