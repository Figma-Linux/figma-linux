import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import * as electron from "electron";
import * as url from "url";

import { isDev } from "./util";
import shortcuts from "./shortcuts";

declare type WindowType = 'main' | 'tab';

interface IWindowManager {
    home: string;
    mainWindow: electron.BrowserWindow;
    tabs: Set<electron.BrowserWindow>;

    newTab(options: electron.BrowserWindowConstructorOptions, url: string, type: WindowType) : void;
    reloadAllWindows(): void;
}

class WindowManager implements IWindowManager {
    home: string;
    mainWindow: electron.BrowserWindow;
    tabs: Set<electron.BrowserWindow>;

    constructor(options: electron.BrowserWindowConstructorOptions, home: string) {
        this.tabs = new Set();
        this.home = home;

        electron.app.on('browser-window-created', this.onBrowserWindowCreated);
        electron.app.on('ready', () => {
            console.log('options: ', options);
            this.mainWindow = new electron.BrowserWindow(options);
            this.mainWindow.loadURL(`${this.home}/login`);
            this.mainWindow.webContents.on('will-navigate', this.onMainWindowWillNavigate);

            shortcuts(this.mainWindow);

            if (isDev) this.mainWindow.webContents.toggleDevTools();
		    if (isDev) this.devtools();
        });
        electron.app.on('window-all-closed', this.onWindowAllClosed);
    }

    newTab = (options: electron.BrowserWindowConstructorOptions, url: string) => {
        const tab = new electron.BrowserWindow(options);
        tab.loadURL(url);

        this.tabs.add(tab);
    }

    reloadAllWindows() {
        const iterator = this.tabs[Symbol.iterator]();

        for (let win of iterator) {
            win.reload();
        }
    }


    private onMainWindowWillNavigate = (event: electron.Event, newUrl: string) => {
        const currentUrl = event.sender.getURL();

        if (newUrl === currentUrl) {
            this.mainWindow.reload();

            event.preventDefault();
            return;
        }

        const from = url.parse(currentUrl);
        const to = url.parse(newUrl);

        if (from.pathname === '/login') {
            this.mainWindow.reload();
            return;
        }

        console.log('will-navigate event, from: ', from);
        console.log('will-navigate event, to: ', to);

        if (to.pathname === '/logout') {
            electron.net.request(`${this.home}/logout`).on('response', response => {
                response.on('error', (err: Error) => {
                    console.log('Request error: ', err);
                });
                response.on('end', () => {
                    console.log('response.statusCode: ', response.statusCode);
                    if (response.statusCode >= 200 && response.statusCode <= 299) {

                        electron.session.defaultSession!.cookies.flushStore(() => {
                            const reload = () => electron.app.relaunch({
                                args: process.argv.slice(1).concat(['--reset'])
                            });

                            electron.app.on('will-quit', reload);
                            electron.app.quit();
                        });
                    }

                    if (response.statusCode >= 400) {
                        electron.session.defaultSession!.clearStorageData();
                        this.mainWindow.webContents.loadURL(`${this.home}/login`);
                    }
                });
            }).end();

            event.preventDefault();
            return;
        }
    }
    private onWindowAllClosed = () => {
        if(process.platform !== 'darwin') {
            electron.app.quit();
        }
    }
    private onBrowserWindowCreated = (event: electron.Event, window: electron.BrowserWindow) => {
        console.log('onBrowserWindowCreated, window', window);
        window.setMenu(null);
    }
    private devtools = () => {
		installExtension(REACT_DEVELOPER_TOOLS)
			.then((name) => console.log(`Added Extension:  ${name}`))
			.catch((err) => console.log('An error occurred: ', err));
	}
}

export default WindowManager;
export {
    IWindowManager
}
