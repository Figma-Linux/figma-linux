import * as Settings from 'electron-settings';
import * as E from "electron";
import * as path from "path";
import * as fs from "fs";

import { DEFAULT_SETTINGS, HOMEPAGE, RESOURCESDIR } from 'Const';
import { isDev } from 'Utils/Common';
import { Request, isFileBrowser } from 'Utils/Main';
import Fonts from "../Fonts";
import ResourceLoader from '../ResourceLoader';

export default class Tabs {
    public static registeredCancelCallbackMap: Map<number, Function> = new Map();

    private static tabs: Array<E.BrowserView> = [];

    public static newTab = (url: string, rect: E.Rectangle, preloadScript?: string) => {
        const options: E.BrowserViewConstructorOptions = {
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                webSecurity: true,
                webgl: true,
                experimentalFeatures: false,
                zoomFactor: Settings.get('ui.scaleFigmaUI') as number
            }
        };

        if (preloadScript !== '') {
            options.webPreferences.preload = path.resolve(isDev ? `${process.cwd()}/dist/` : `${__dirname}/../`, 'middleware', preloadScript || '');
        }

        const tab = new E.BrowserView(options);

        tab.setAutoResize({
            width: true,
            height: true
        });
        tab.setBounds(rect);
        tab.webContents.loadURL(url);
        tab.webContents.on('dom-ready', () => {
            let dirs = Settings.get('app.fontDirs') as string[];

            if (!dirs) {
                dirs = DEFAULT_SETTINGS.app.fontDirs;
            }
            Fonts.getFonts(dirs)
                .catch(err => console.error(`Failed to load local fonts, error: ${err}`))
                .then(fonts => {
                    tab.webContents.send('updateFonts', fonts);
                });

            // tab.webContents.executeJavaScript(`(${dom})()`);
        });

        // TODO: Remove this shit later
        tab.webContents.on('will-navigate', async (event, url) => {
            console.log('will-navigate, ', url);

            if (!isFileBrowser(url)) {
                // let htmlProjectPage = '';
                let page: Resources.Page;
                const filePromises: Promise<Request.Responce | void>[] = [];
                const resource = new ResourceLoader();

                try {
                    page = await resource.loadFigmaRes(url)
                } catch (error) {
                    console.error(`Caanot fetch url: ${url}, ERROR: `, error);
                }

                try {
                    fs.mkdirSync(RESOURCESDIR);
                } catch (error) {}

                for (const link of page.links) {
                    let url = link;

                    if (/^\//.test(link)) {
                        url = `${HOMEPAGE}${link}`;
                    }

                    let fileRes = Request(url)
                        .catch(error => console.error(`Cannot fetch resource: ${url}, ERROR: `, error));

                    filePromises.push(fileRes);
                }

                const resources = await Promise.all(filePromises);

                filePromises.length = 0;
                for (const res of resources) {
                    if (!res) continue;

                    let data = res.data;

                    const fileName = path.parse(res.url).base;

                    if (/.*figma_app.*\.js/.test(res.url)) {
                        data = data.replace('Failed DOM access check', 'ok');
                        data = data.replace(/(['"`])\/api/gi, `$1www.figma.com/api`);
                        // data = data.replace(/(window\.)?location.host(name)?/gi, `'www.figma.com'`);
                    }

                    page.data = page.data.replace(res.url.replace(/https?:\/\/(www)?.figma.com\/figbuild/, '/figbuild'), `http://localhost:12531/figbuild/${fileName}`);

                    filePromises.push(
                        fs.promises.writeFile(`${RESOURCESDIR}/${fileName}`, data)
                            .catch(error => console.log(`Resource file ${fileName} successful saved on the disk`))
                    );
                }

                page.data = page.data.replace(/(['"])\/api/gi, `$1${HOMEPAGE}/api`);
                // page.data = page.data.replace(/<\/head>/gi, `<script>(() => { window.location.origin='https://www.figma.com'; })()</script></head>`);

                await Promise.all(filePromises);

                const filePath = `${RESOURCESDIR}/${path.parse(page.url).base}.html`;
                try {
                    fs.writeFileSync(filePath, page.data, { flag: 'w' });
                } catch (error) {
                    throw new Error(error);
                }

                // tab.webContents.loadURL(`file://${filePath}`);
            }
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

    public static focus = (id: number): E.BrowserView => {

        return Tabs.tabs.find(t => t.id === id) as E.BrowserView;
    }

    public static getAll = (): Array<E.BrowserView> => Tabs.tabs;

    public static getByWebContentId = (id: number): E.BrowserView | undefined => {
        for (const tab of Tabs.tabs) {
            if (tab.webContents.id === id) {
                return tab;
            }
        }

        return undefined;
    };

}
