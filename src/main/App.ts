import {
  app,
  net,
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

    this.applySwitches();

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

    protocol.handle(Const.PROTOCOL, (req: GlobalRequest) => {
      logger.info("protocol.handle, req.url: ", req.url);
      if (this.windowManager.tryHandleAppAuthRedeemUrl(req.url)) {
        return new Response();
      }

      this.windowManager.openUrl(req.url);

      return net.fetch(req.url, { method: req.method });
    });
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
  private applySwitches() {
    // Chromium flags for better performance and GPU support
    // Full flags reference: https://peter.sh/experiments/chromium-command-line-switches/
    const switches = storage.settings.app.commandSwitches;

    if (!switches.length) {
      return;
    }

    for (const item of switches) {
      app.commandLine.appendSwitch(item.switch, item.value);
    }

    const colorSpace = storage.settings.app.enableColorSpaceSrgb;

    if (colorSpace) {
      app.commandLine.appendSwitch("force-color-profile", "srgb");
    } else {
      app.commandLine.appendSwitch("disable-color-correct-rendering");
    }
  }
  private setAuthedUsers(_: IpcMainEvent, userIds: string[]) {
    if (!Array.isArray(storage.settings.authedUserIDs)) {
      storage.settings.authedUserIDs = userIds;
      storage.save();
    }

    storage.settings.authedUserIDs = [...new Set([...storage.settings.authedUserIDs, ...userIds])];
  }
  private setWorkspaceName(_: IpcMainEvent, name: string) {
    logger.warn("The setWorkspaceName not implemented, workspaceName: ", name);
  }
  private setFigjamEnabled(_: IpcMainEvent, enabled: boolean) {
    logger.warn("The setFigjamEnabled not implemented, enabled: ", enabled);
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
