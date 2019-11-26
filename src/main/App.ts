import * as Settings from 'electron-settings';
import * as E from "electron";

import * as Const from "Const";
import { cmd } from 'Utils/Main';
import Args from "./Args";
import WindowManager from "./window/WindowManager";
import { Session } from './Session';
import './events/app';

class App {
    windowManager: WindowManager;
    session: Session;

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
            E.app.on('second-instance', (event, argv) => {
                let projectLink = '';
                console.log('second-instance, argv: ', argv);
                const paramIndex: number = argv.findIndex((i: string) => /^(figma:\/\/|https?:\/\/w{0,3}?\.?figma\.com)/.test(i));

                if (paramIndex !== -1) {
                    projectLink = argv[paramIndex];
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

            this.session = new Session();
        }

        this.appEvent();

        if (Object.keys(Settings.getAll()).length === 0) {
            Settings.setAll(Const.DEFAULT_SETTINGS);
        }
    }


    private appEvent = () => {
        E.app.setAsDefaultProtocolClient(Const.PROTOCOL);

        E.app.on('ready', this.ready);
        E.app.on('browser-window-created', (e, window) => window.setMenu(null));
        E.app.on('window-all-closed', this.onWindowAllClosed);
    }

    private ready = () => {
        const { figmaUrl } = Args();

        this.windowManager = WindowManager.instance;
        this.session.handleAppReady();

        setTimeout(() => {
            figmaUrl !== '' && this.windowManager.openUrl(figmaUrl);
        }, 1500);

        E.protocol.registerHttpProtocol(Const.PROTOCOL, (req, cb) => {
          this.windowManager.addTab('loadMainContent.js', req.url);

            cb({
                url: req.url,
                method: req.method
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
