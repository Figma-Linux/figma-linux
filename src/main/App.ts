import * as E from "electron";

import * as Const from "Const";
import Args from "./Args";
import WindowManager, { IWindowManager } from "./window/WindowManager";

interface IApp {
    windowManager: IWindowManager;
}

class App implements IApp {
    windowManager: IWindowManager;

    constructor() {
        const isSingleInstance = E.app.requestSingleInstanceLock();

        if (!isSingleInstance) {
            E.app.quit();
            return;
        } else {
            E.app.on('second-instance', (cmdLine, workDir) => {
                let projectLink = '';
                const paramIndex: number = workDir.findIndex((i: string) => /^(figma:\/\/|https?:\/\/w{0,3}?\.?figma\.com)/.test(i));

                if (paramIndex !== -1) {
                    projectLink = workDir[paramIndex];
                }

                if (this.windowManager && this.windowManager.mainWindow) {
                    if (projectLink !== '') {
                        this.windowManager.openUrl(projectLink);
                    }

                    this.windowManager.mainWindow.isMinimized() && this.windowManager.mainWindow.restore();
                    !this.windowManager.mainWindow.isVisible() && this.windowManager.mainWindow.show();

                    this.windowManager.mainWindow.focus();
                }
            });
        }

        this.appEvent();
    }


    private appEvent = () => {
        E.protocol.registerStandardSchemes([Const.PROTOCOL]);

        E.app.on('ready', this.ready);
        E.app.on('browser-window-created', (e, window) => window.setMenu(null));
        E.app.on('window-all-closed', this.onWindowAllClosed);
    }

    private ready = () => {
        const { figmaUrl } = Args();

        this.windowManager = WindowManager.instance;

        setTimeout(() => {
            figmaUrl !== '' && this.windowManager.openUrl(figmaUrl);
        }, 1500);

        E.protocol.registerHttpProtocol(Const.PROTOCOL, (req, cb) => {
            this.windowManager.openUrl(req.url);

            cb({
                url: req.url,
                method: 'GET'
            });
        }, err => err && console.log('failed to register http protocol, err: ', err));
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