import * as E from "electron";

interface ITabs {
    // tabs: Array<E.BrowserView>;

    // newTab(options: E.BrowserWindowConstructorOptions, url: string) : void;
    // close(index: number): void;
    // reloadAll(): void;
}

class Tabs implements ITabs {
    private static tabs: Array<E.BrowserView> = [];

    public static newTab = (url: string) => {
        const tab = new E.BrowserView({
            webPreferences: {
                nodeIntegration: false
            }
        });

        tab.setBounds({
            x: 0,
            y: 19,
            width: 300,
            height: 200
        });
        tab.webContents.loadURL(url);

        Tabs.tabs.push(tab);

        return tab;
    }

    public static reloadAll = () => {
        const iterator = Tabs.tabs[Symbol.iterator]();

        for (let tab of iterator) {
            tab.webContents.reload();
        }
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
    
    public static focus = (id: number): E.BrowserView => {
        return Tabs.tabs.find(t => t.id === id) as E.BrowserView;
    }

    public static getAll = (): Array<E.BrowserView> => {
        return Tabs.tabs;
    }
}

export default Tabs;
export {
    ITabs
}
