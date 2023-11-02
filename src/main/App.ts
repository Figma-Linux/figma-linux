import {
  app,
  session,
  clipboard,
  nativeImage,
  ipcMain,
  Event,
  IpcMainEvent,
  IpcMainInvokeEvent,
  protocol,
  ProtocolRequest,
  ProtocolResponse,
} from "electron";

import * as Const from "Const";
import { request } from "Utils/Main";
import { isAppAuthLink, isValidProjectLink } from "Utils/Common";
import Args from "./Args";
import { logger } from "./Logger";
import { storage } from "./Storage";
import ExtensionManager from "./ExtensionManager";
import ThemeManager from "./Ui/ThemeManager";
import WindowManager from "./Ui/WindowManager";
import Session from "./Session";
import FontManager from "./Fonts";

export default class App {
  constructor(
    private windowManager: WindowManager,
    private extensionManager: ExtensionManager,
    private session: Session,
    private fontManager: FontManager,
    private themeManager: ThemeManager,
  ) {
    const isSingleInstance = app.requestSingleInstanceLock();

    if (!isSingleInstance) {
      app.emit("focusLastWindow");
      app.quit();
      return;
    }

    // Chromium flags for better performance and GPU support
    // Full flags reference: https://peter.sh/experiments/chromium-command-line-switches/
    // app.commandLine.appendSwitch("no-sandbox");
    // app.commandLine.appendSwitch("ignore-gpu-blocklist");
    // app.commandLine.appendSwitch("enable-gpu-rasterization");
    // app.commandLine.appendSwitch("enable-video-decode");
    // app.commandLine.appendSwitch("enable-accelerated-2d-canvas");
    // app.commandLine.appendSwitch("enable-experimental-canvas-features");

    const colorSpace = storage.settings.app.enableColorSpaceSrgb;

    if (colorSpace) {
      app.commandLine.appendSwitch("force-color-profile", "srgb");
    } else {
      app.commandLine.appendSwitch("disable-color-correct-rendering");
    }

    if (!app.isDefaultProtocolClient(Const.PROTOCOL)) {
      app.setAsDefaultProtocolClient(Const.PROTOCOL);
    }

    this.registerEvents();
  }

  private ready = (): void => {
    const { figmaUrl } = Args();

    this.windowManager.restoreState();
    this.session.handleAppReady();

    setTimeout(() => {
      if (figmaUrl !== "") {
        this.windowManager.openUrl(figmaUrl);
      }
    }, 1500);

    protocol.registerHttpProtocol(
      Const.PROTOCOL,
      (req: ProtocolRequest, cb: (req: ProtocolResponse) => void) => {
        if (this.windowManager.tryHandleAppAuthRedeemUrl(req.url)) {
          return;
        }

        this.windowManager.openUrl(req.url);
        // this.windowManager.addTab("loadMainContent.js", req.url);

        cb({
          url: req.url,
          method: req.method,
        });
      },
    );
  };

  private secondInstance(event: Event, argv: string[]) {
    let projectLink = "";
    logger.debug("second-instance, argv: ", argv);

    const paramIndex = argv.findIndex((i) => isValidProjectLink(i));
    const hasAppAuthorization = argv.find((i) => isAppAuthLink(i));

    if (this.windowManager.tryHandleAppAuthRedeemUrl(hasAppAuthorization)) {
      return;
    }

    if (paramIndex !== -1) {
      projectLink = argv[paramIndex];
    }

    if (projectLink !== "") {
      this.windowManager.focusLastWindow();
      this.windowManager.openUrl(projectLink);
    }
  }
  private frontReady(_: IpcMainEvent) {
    if (!this.session.hasFigmaSession) {
      app.emit("closeAllTab");
    }

    this.themeManager.loadThemes();
    this.themeManager.loadCreatorTheme();
  }
  private setAuthedUsers(_: IpcMainEvent, userIds: string[]) {
    if (!Array.isArray(storage.settings.authedUserIDs)) {
      storage.settings.authedUserIDs = userIds;
      storage.save();
    }

    storage.settings.authedUserIDs = [...new Set([...storage.settings.authedUserIDs, ...userIds])];
  }
  private setWorkspaceName(_: IpcMainEvent, name: string) {
    logger.info("The setWorkspaceName not implemented, workspaceName: ", name);
  }
  private setFigjamEnabled(_: IpcMainEvent, enabled: boolean) {
    logger.info("The setFigjamEnabled not implemented, enabled: ", enabled);
  }
  private setClipboardData(_: IpcMainEvent, data: WebApi.SetClipboardData) {
    const format = data.format;
    const buffer = Buffer.from(data.data);

    if (["image/jpeg", "image/png"].indexOf(format) !== -1) {
      clipboard.writeImage(nativeImage.createFromBuffer(buffer));
    } else if (format === "image/svg+xml") {
      clipboard.writeText(buffer.toString());
    } else if (format === "application/pdf") {
      clipboard.writeBuffer("Portable Document Format", buffer);
    } else {
      clipboard.writeBuffer(format, buffer);
    }
  }
  private async getFonts(_: IpcMainInvokeEvent) {
    const dirs = storage.settings.app.fontDirs;

    return this.fontManager.getFonts(dirs);
  }
  private async getFontFile(_: IpcMainInvokeEvent, data: WebApi.GetFontFile) {
    const file = await this.fontManager.getFontFile(data.path);

    if (file && file.byteLength > 0) {
      return file;
    }

    return null;
  }
  private async logout() {
    await request({
      url: Const.LOGOUT_PAGE,
      useSessionCookies: true,
    });

    // TODO: remove only current user's id
    storage.settings.authedUserIDs = [];

    try {
      await Promise.all([
        session.defaultSession.clearStorageData(),
        session.defaultSession.clearCache(),
      ]);
    } catch (error) {
      logger.error(error);
    }

    this.windowManager.closeTabOnAllWindows();
    this.windowManager.loadLoginPageAllWindows();
  }
  private onWindowAllClosed() {
    app.quit();
  }
  private relaunchApp() {
    app.relaunch();
    app.quit();
  }
  private quitApp() {
    this.windowManager.saveState();
    storage.save();

    app.quit();
  }

  private registerEvents = (): void => {
    ipcMain.on("frontReady", this.frontReady.bind(this));
    ipcMain.on("setAuthedUsers", this.setAuthedUsers.bind(this));
    ipcMain.on("setWorkspaceName", this.setWorkspaceName.bind(this));
    ipcMain.on("setFigjamEnabled", this.setFigjamEnabled.bind(this));
    ipcMain.on("setClipboardData", this.setClipboardData.bind(this));

    ipcMain.handle("getFonts", this.getFonts.bind(this));
    ipcMain.handle("getFontFile", this.getFontFile.bind(this));

    app.on("ready", this.ready.bind(this));
    app.on("second-instance", this.secondInstance.bind(this));
    app.on("window-all-closed", this.onWindowAllClosed.bind(this));
    app.on("relaunchApp", this.relaunchApp.bind(this));
    app.on("signOut", this.logout.bind(this));
    app.on("quitApp", this.quitApp.bind(this));
  };
}
