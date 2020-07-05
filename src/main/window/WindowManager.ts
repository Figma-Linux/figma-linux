import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import * as Settings from "electron-settings";
import * as E from "electron";
import { exec } from "child_process";
import * as url from "url";

import Tabs from "./Tabs";
import initMainMenu from "./menu";
import Commander from "../Commander";
import MenuState from "../MenuState";
import * as Const from "Const";
import { isDev, isComponentUrl, isRedeemAuthUrl, normalizeUrl, getComponentTitle } from "Utils/Common";
import { winUrlDev, winUrlProd, isFileBrowser } from "Utils/Main";
import { registerIpcMainHandlers } from "Main/events";

class WindowManager {
  home: string;
  mainWindow: E.BrowserWindow;
  settingsView: E.BrowserView | null = null;
  figmaUiScale: number;
  panelScale: number;
  closedTabsHistory: Array<string> = [];
  private tabs: Tab[];
  private static _instance: WindowManager;
  private panelHeight = Settings.get("app.panelHeight") as number;

  private constructor(options: E.BrowserWindowConstructorOptions, home: string) {
    this.home = home;
    this.figmaUiScale = Settings.get("ui.scaleFigmaUI") as number;
    this.panelScale = Settings.get("ui.scalePanel") as number;

    this.mainWindow = new E.BrowserWindow(options);
    this.mainWindow.loadURL(isDev ? winUrlDev : winUrlProd);

    if (!Settings.get("app.disabledMainMenu")) {
      initMainMenu();
    } else {
      E.Menu.setApplicationMenu(null);
      this.mainWindow.setMenuBarVisibility(false);
    }

    this.addTab("loadMainContent.js");

    this.mainWindow.on("resize", this.updateBounds);
    this.mainWindow.on("maximize", (e: Event) => setTimeout(() => this.updateBounds(e), 100));
    this.mainWindow.on("unmaximize", (e: Event) => setTimeout(() => this.updateBounds(e), 100));
    this.mainWindow.on("move", (e: Event) => setTimeout(() => this.updateBounds(e), 100));

    isDev && this.installReactDevTools();
    isDev && this.mainWindow.webContents.openDevTools({ mode: "detach" });

    this.addIpc();
    registerIpcMainHandlers();

    E.app.on("will-quit", this.onWillQuit);

    if (Settings.get("app.saveLastOpenedTabs")) {
      setTimeout(() => this.resoreTabs(), 1000);
    }
  }

  static get instance(): WindowManager {
    if (WindowManager._instance) {
      return WindowManager._instance;
    }

    const options: E.BrowserWindowConstructorOptions = {
      width: 1200,
      height: 900,
      autoHideMenuBar: Settings.get("app.showMainMenu") as boolean,
      webPreferences: {
        sandbox: false,
        zoomFactor: 1,
        nodeIntegration: true,
        nodeIntegrationInWorker: false,
        webviewTag: false,
        webSecurity: false,
        webgl: true,
        experimentalFeatures: true,
      },
    };

    const home = Const.HOMEPAGE;

    WindowManager._instance = new WindowManager(options, home);

    return WindowManager._instance;
  }

  openUrl = (url: string) => {
    if (isRedeemAuthUrl(url)) {
      const normalizedUrl = normalizeUrl(url);
      const tab = Tabs.getAll()[0];

      tab.webContents.loadURL(normalizedUrl);
    } else if (/figma:\/\//.test(url)) {
      this.addTab("loadContent.js", url.replace(/figma:\//, Const.HOMEPAGE));
    } else if (/https?:\/\//.test(url)) {
      this.addTab("loadContent.js", url);
    }
  };

  private resoreTabs = () => {
    const tabs = Settings.get("app.lastOpenedTabs") as SavedTab[];

    if (Array.isArray(tabs)) {
      tabs.forEach((tab, i) => {
        (t => {
          setTimeout(() => {
            if (isFileBrowser(t.url)) {
              this.addTab("loadMainContent.js", t.url, t.title);
            } else {
              this.addTab("loadContent.js", t.url, t.title);
            }
          }, 1500 * i);
        })(tab);
      });
    }
  };

  private onWillQuit = () => {
    const lastOpenedTabs: SavedTab[] = [];

    this.tabs.forEach(tab => {
      if (tab.id > 1) {
        lastOpenedTabs.push({
          title: tab.title,
          url: tab.url,
        });
      }
    });

    Settings.set("app.lastOpenedTabs", lastOpenedTabs as any);
  };

  private addIpc = () => {
    E.ipcMain.on(Const.NEWTAB, async () => this.addTab());

    E.ipcMain.on(Const.CLOSETAB, (event: Event, id: number) => {
      this.closeTab(id);
    });

    E.ipcMain.on(Const.FOCUSTAB, (event: Event, id: number) => {
      const view = Tabs.focus(id);
      this.mainWindow.setBrowserView(view);

      if (isFileBrowser(view.webContents.getURL())) {
        MenuState.updateInFileBrowserActionState();
      } else {
        MenuState.updateInProjectActionState();
      }
    });

    E.ipcMain.on(Const.CLEARVIEW, (event: Event) => {
      this.mainWindow.setBrowserView(null);
    });

    E.ipcMain.on(Const.MAINTAB, (event: Event) => {
      const view = Tabs.focus(1);
      this.mainWindow.setBrowserView(view);

      if (isFileBrowser(view.webContents.getURL())) {
        MenuState.updateInFileBrowserActionState();
      } else {
        MenuState.updateInProjectActionState();
      }
    });

    E.ipcMain.on(Const.CLOSEALLTAB, () => {
      console.log("Close all tab");
    });
    E.ipcMain.on("setTitle", (event, title) => {
      const tab = Tabs.getByWebContentId(event.sender.id);

      if (!tab) {
        return;
      }

      this.mainWindow.webContents.send(Const.SETTITLE, { id: tab.id, title });
    });
    E.ipcMain.on("setPluginMenuData", (event, pluginMenu) => {
      MenuState.updatePluginState(pluginMenu);
    });
    E.ipcMain.on("registerManifestChangeObserver", (event: any, callbackId: any) => {
      console.log("registerManifestChangeObserver, callbackId: ", callbackId);
      const tab = Tabs.getByWebContentId(event.sender.id);

      if (!tab) {
        return;
      }

      // exports.extensionRegistry.addObserver(callback);
      // return () => {
      //     exports.extensionRegistry.removeObserver(callback);
      // };
    });
    E.ipcMain.on(Const.SETTABURL, (event: Event, url: string) => {
      const view = this.mainWindow.getBrowserView();

      if (!view) return;

      this.mainWindow.webContents.send(Const.SETTABURL, { id: view.id, url });
    });

    E.ipcMain.on(Const.UPDATEFILEKEY, (event: Event, key: string) => {
      const view = this.mainWindow.getBrowserView();

      if (!view) return;

      this.mainWindow.webContents.send(Const.UPDATEFILEKEY, { id: view.id, fileKey: key });
    });

    E.ipcMain.on(Const.UPDATEACTIONSTATE, (event: Event, state: MenuState.State) => {
      MenuState.updateActionState(state);
    });

    E.ipcMain.on(Const.TOHOME, (event: Event, title: string) => {
      this.openFileBrowser();
    });

    E.ipcMain.on(Const.RECIVETABS, (event: Event, tabs: Tab[]) => {
      this.tabs = tabs;
    });

    E.app.on("update-figma-ui-scale", scale => {
      this.updateFigmaUiScale(scale);
    });
    E.app.on("update-panel-scale", scale => {
      this.updatePanelScale(scale);
    });
    E.app.on("set-hide-main-menu", hide => {
      this.mainWindow.setAutoHideMenuBar(hide);

      if (!hide) {
        this.mainWindow.setMenuBarVisibility(true);
      }
    });
    E.app.on("set-disable-main-menu", hide => {
      setTimeout(() => {
        exec(process.argv.join(" "));
        E.app.quit();
      }, 1000);
    });
    E.app.on("sign-out", () => {
      this.logoutAndRestart();
    });
    E.app.on("handle-command", (id: string) => {
      switch (id) {
        case "scale-normal":
          {
            this.updateAllScale();
          }
          break;
        case "scale-inc0.1":
          {
            this.updateAllScale(0.1);
          }
          break;
        case "scale-dic0.1":
          {
            this.updateAllScale(-0.1);
          }
          break;
        case "scale-inc0.05":
          {
            this.updateAllScale(0.05);
          }
          break;
        case "scale-dic0.05":
          {
            this.updateAllScale(-0.05);
          }
          break;
        case "openFileBrowser":
          {
            this.openFileBrowser();
          }
          break;
        case "reopenClosedTab":
          {
            if (this.closedTabsHistory.length <= 0) return;

            const url = this.closedTabsHistory.pop();
            const script = /files\/recent$/.test(url) ? "loadMainContent.js" : "loadContent.js";

            this.addTab(script, url);
          }
          break;
        case "closeTab":
          {
            const currentView = this.mainWindow.getBrowserView();

            if (currentView.id === 1) return;

            this.mainWindow.webContents.send(Const.CLOSETAB, { id: currentView.id });
            this.closeTab(currentView.id);
          }
          break;
        case "newFile":
          {
            const currentView = this.addTab();
            const onDidFinishLoad = () => {
              currentView.webContents.send("newFile");
              currentView.webContents.removeListener("did-finish-load", onDidFinishLoad);
            };

            currentView.webContents.on("did-finish-load", onDidFinishLoad);
          }
          break;
        case "openSettings":
          {
            this.initSettingsView();
          }
          break;
        case "closeSettings": {
          if (!this.settingsView) {
            break;
          }

          if (this.settingsView.webContents.isDevToolsOpened()) {
            this.settingsView.webContents.closeDevTools();
          }

          this.mainWindow.removeBrowserView(this.settingsView);

          break;
        }
        case "chrome://gpu":
          {
            this.addTab("", `chrome://gpu`, "chrome://gpu/");
          }
          break;

        default: {
          Commander.exec(id);
        }
      }
    });
  };

  public addTab = (scriptPreload = "loadMainContent.js", url = `${this.home}/login`, title?: string): E.BrowserView => {
    if (isComponentUrl(url)) {
      this.mainWindow.setBrowserView(null);
      this.mainWindow.webContents.send(Const.TABADDED, {
        title: title ? title : getComponentTitle(url),
        showBackBtn: false,
        url,
      });

      return null;
    }

    const tab = Tabs.newTab(url, this.getBounds(), scriptPreload);

    this.mainWindow.setBrowserView(tab);
    tab.webContents.on("will-navigate", this.onMainWindowWillNavigate);
    tab.webContents.on("new-window", this.onNewWindow);

    if (isFileBrowser) {
      MenuState.updateInFileBrowserActionState();
    } else {
      MenuState.updateActionState(Const.ACTIONTABSTATE);
    }

    this.mainWindow.webContents.send(Const.TABADDED, { id: tab.id, url, showBackBtn: true, title });

    this.mainWindow.setBrowserView(tab);

    return tab;
  };

  private initSettingsView = () => {
    this.settingsView = new E.BrowserView({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        experimentalFeatures: false,
      },
    });

    this.mainWindow.addBrowserView(this.settingsView);

    const windowBounds = this.mainWindow.getBounds();

    this.settingsView.setBounds({
      height: windowBounds.height,
      width: windowBounds.width,
      y: 0,
      x: 0,
    });

    this.settingsView.setAutoResize({
      width: true,
      height: true,
      horizontal: true,
      vertical: true,
    });

    this.settingsView.webContents.loadURL(isDev ? winUrlDev : winUrlProd);

    this.settingsView.webContents.on("did-finish-load", () => {
      this.settingsView.webContents.send("renderView", "Settings");
      this.settingsView.webContents.openDevTools({ mode: "detach" });
    });
  };

  private logoutAndRestart = (event?: E.Event) => {
    E.net
      .request(`${this.home}/logout`)
      .on("response", response => {
        response.on("error", (err: Error) => {
          console.log("Request error: ", err);
        });
        response.on("end", () => {
          if (response.statusCode >= 200 && response.statusCode <= 299) {
            E.session.defaultSession!.cookies.flushStore().then(() => {
              const view = Tabs.focus(1);
              this.mainWindow.setBrowserView(view);
              view.webContents.reload();

              Tabs.closeAll();

              this.mainWindow.webContents.send(Const.CLOSEALLTAB);
            });
          }

          if (response.statusCode >= 400) {
            E.session.defaultSession!.clearStorageData();
            this.mainWindow.webContents.loadURL(`${this.home}`);
          }
        });
      })
      .end();

    event && event.preventDefault();
    return;
  };

  private onNewWindow = (event: Event, url: string) => {
    console.log("newWindow, url: ", url);

    if (/start_google_sso/.test(url)) return;

    if (/\/app_auth\/.*\/grant/.test(url)) {
      E.shell.openExternal(url);

      event.preventDefault();

      return;
    }

    const view = Tabs.newTab(`${url}`, this.getBounds(), "loadContent.js");

    view.webContents.on("will-navigate", this.onMainWindowWillNavigate);

    this.mainWindow.setBrowserView(view);
    this.mainWindow.webContents.send(Const.TABADDED, { id: view.id, url, showBackBtn: false });
  };

  private onMainWindowWillNavigate = (event: any, newUrl: string) => {
    const currentUrl = event.sender.getURL();

    if (newUrl === currentUrl) {
      event.preventDefault();
      return;
    }

    const from = url.parse(currentUrl);
    const to = url.parse(newUrl);

    if (from.pathname === "/login") {
      Tabs.reloadAll();

      event.preventDefault();
      return;
    }

    if (to.pathname === "/logout") {
      this.logoutAndRestart(event);
    }

    if (Const.REGEXP_APP_AUTH_REDEEM.test(from.pathname || "")) {
      return;
    }
    if (to.search && to.search.match(/[\?\&]redirected=1/)) {
      event.preventDefault();
      return;
    }
  };

  private openFileBrowser = () => {
    const currentView = this.mainWindow.getBrowserView();
    const currentUrl = (currentView && currentView.webContents.getURL()) || "";
    const go: boolean = url.parse(currentUrl).pathname !== "/files/recent";

    MenuState.updateActionState(Const.INITACTIONINITSTATE);

    currentView && go && currentView!.webContents.loadURL(`${this.home}`);
  };

  private closeTab = (id: number) => {
    const views = Tabs.getAll();
    const currentView = this.mainWindow.getBrowserView();
    const index: number = views.findIndex(t => t.id == id);
    const view = Tabs.focus(views[index > 0 ? index - 1 : index].id);
    this.mainWindow.setBrowserView(view);

    if (!currentView) {
      Tabs.close(id);
      return;
    }

    this.closedTabsHistory.push(currentView.webContents.getURL());

    Tabs.close(id);
  };

  private updateAllScale = (scale?: number) => {
    const views = Tabs.getAll();
    let panelHeight = 0;

    if (scale) {
      this.panelScale += scale;
      this.figmaUiScale += scale;
    } else {
      this.panelScale = 1;
      this.figmaUiScale = 1;
    }

    panelHeight = Math.floor(Const.TOPPANELHEIGHT * this.panelScale);
    this.panelHeight = panelHeight;
    this.mainWindow.webContents.send(Const.UPDATEPANELHEIGHT, panelHeight);

    Settings.set("app.panelHeight", panelHeight);

    this.mainWindow.webContents.send(Const.UPDATEPANELSCALE, this.panelScale);
    this.mainWindow.webContents.send(Const.UPDATEUISCALE, this.figmaUiScale);

    this.updateBounds();

    for (const view of views) {
      view.webContents.setZoomFactor(this.figmaUiScale);
    }
  };

  private updateFigmaUiScale = (figmaScale: number) => {
    const views = Tabs.getAll();

    this.figmaUiScale = +figmaScale.toFixed(2);

    for (const view of views) {
      view.webContents.setZoomFactor(+figmaScale.toFixed(2));
    }
  };

  private updatePanelScale = (panelScale: number) => {
    let panelHeight = 0;

    this.panelScale = +panelScale.toFixed(2);
    panelHeight = Math.floor(Const.TOPPANELHEIGHT * panelScale);
    this.panelHeight = panelHeight;
    this.mainWindow.webContents.send(Const.UPDATEPANELHEIGHT, panelHeight);

    Settings.set("app.panelHeight", panelHeight);

    this.updateBounds();
  };

  private getBounds = () => {
    return {
      x: 0,
      y: this.panelHeight,
      width: this.mainWindow.getContentBounds().width,
      height: this.mainWindow.getContentBounds().height - this.panelHeight,
    };
  };

  private updateBounds = (event?: Event) => {
    const views = Tabs.getAll();

    views.forEach((bw: E.BrowserView) => {
      bw.setBounds(this.getBounds());
    });
  };

  private installReactDevTools = () => {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name: string) => console.log(`Added Extension:  ${name}`))
      .catch((err: Error) => console.log("An error occurred: ", err));
  };
}

export default WindowManager;
