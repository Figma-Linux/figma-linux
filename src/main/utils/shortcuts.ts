import * as E from "electron";
import Tabs from "../webContent/Tabs";

export default () => {
    let zoom = 0.8;

    E.globalShortcut.register('CommandOrControl+-', () => {
        const tabs: Array<E.BrowserView> = Tabs.getAll();
        
        tabs.map(t => {
            if (/(chrome-devtools|chrome-extension)/.test(t.webContents.getTitle())) return;
            zoom -= 0.1;

            t.webContents.setZoomFactor(zoom);
        });
    });
    E.globalShortcut.register('CommandOrControl+=', () => {
        const tabs: Array<E.BrowserView> = Tabs.getAll();

        tabs.map(t => {
            if (/(chrome-devtools|chrome-extension)/.test(t.webContents.getTitle())) return;
            zoom += 0.1;

            t.webContents.setZoomFactor(zoom);
        });
    });
    E.globalShortcut.register('Shift+CommandOrControl+-', () => {
        const tabs: Array<E.BrowserView> = Tabs.getAll();
        
        tabs.map(t => {
            if (/(chrome-devtools|chrome-extension)/.test(t.webContents.getTitle())) return;
            zoom -= 0.05;

            t.webContents.setZoomFactor(zoom);
        });
    });
    E.globalShortcut.register('Shift+CommandOrControl+=', () => {
        const tabs: Array<E.BrowserView> = Tabs.getAll();
        
        tabs.map(t => {
            if (/(chrome-devtools|chrome-extension)/.test(t.webContents.getTitle())) return;
            zoom += 0.05;

            t.webContents.setZoomFactor(zoom);
        });
    });
}