import * as E from "electron";

import Args from "./Args";

import WindowManager from "./window/WindowManager";

interface IApp {
    windowManager: WindowManager;
}

class App implements IApp {
    windowManager: WindowManager;

    constructor() {
        const isSingleInstance = E.app.requestSingleInstanceLock();

        if (!isSingleInstance) {
            E.app.quit();
            return;
        } else {
            if (this.windowManager && this.windowManager.mainWindow) {
                this.windowManager.mainWindow.isMinimized() && this.windowManager.mainWindow.restore();
                !this.windowManager.mainWindow.isVisible() && this.windowManager.mainWindow.show();
    
                this.windowManager.mainWindow.focus();
            }
        }

        this.appEvent();
    }


    private appEvent = () => {        
        E.app.on('ready', this.ready);
        E.app.on('browser-window-created', (e, window) => window.setMenu(null));
        E.app.on('window-all-closed', this.onWindowAllClosed);
    }

    private ready = () => {
        const { withoutFrame } = Args();
        const options: E.BrowserWindowConstructorOptions = {
            width: 1200,
            height: 900,
            frame: withoutFrame,
            webPreferences: {
                zoomFactor: 0.9,
                nodeIntegration: true,
                nodeIntegrationInWorker: false,
                webviewTag: false,
                webSecurity: false,
                webgl: true,
                experimentalFeatures: true,
                experimentalCanvasFeatures: true
            }
        };

        const home = 'https://www.figma.com';

        this.windowManager = new WindowManager(options, home);
    }


    private onWindowAllClosed = () => {
        if(process.platform !== 'darwin') {
            E.app.quit();
        }
    }
}

const init = () => {
    new App;
}

export default init;
export {
    IApp
}