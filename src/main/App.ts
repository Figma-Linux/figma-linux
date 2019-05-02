import * as Settings from 'electron-settings';
import * as E from "electron";

import * as Const from "Const";
import { cmd } from 'Utils';
import Args from "./Args";
import WindowManager from "./window/WindowManager";

class App {
    windowManager: WindowManager;

    constructor() {
        const isSingleInstance = E.app.requestSingleInstanceLock();

        if (Settings.get('app.fontDirs')) {
            cmd(`find ${(Settings.get('app.fontDirs') as string[]).join(' ')} -type f | wc -l`)
                .then(output => {
                    console.info(`You've got a ${output.replace(/[\s\t\r]/, '')} fonts in your os.`);

                    if (parseInt(output) > 3000) {
                        console.warn(`You've too many fonts. It'll may call problem with run the app.`);
                    }
                })
                .catch(err => console.error(`exec command "find" error: `, err));
        }

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

        if (Object.keys(Settings.getAll()).length === 0) {
            Settings.setAll(Const.DEFAULT_SETTINGS);
        }
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
        if (process.platform !== 'darwin') {
            E.app.quit();
        }
    }
}

export default () => {
    new App;
}
