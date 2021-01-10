import * as E from "electron";

import * as Const from "Const";
import { isAppAuthLink, isValidProjectLink } from "Utils/Common";
import { mkdirIfNotExists, themesDirectory } from "Utils/Main";
import Args from "./Args";
import { logger } from "./Logger";
import { storage } from "./Storage";
import WindowManager from "./window/WindowManager";
import { Session } from "./Session";
import "./events/app";

class App {
  windowManager: WindowManager;
  session: Session;

  constructor() {
    const isSingleInstance = E.app.requestSingleInstanceLock();

    if (!isSingleInstance) {
      E.app.quit();
      return;
    } else {
      E.app.on("second-instance", (event, argv) => {
        let projectLink = "";
        logger.debug("second-instance, argv: ", argv);

        const paramIndex = argv.findIndex(i => isValidProjectLink(i));
        const hasAppAuthorization = argv.find(i => isAppAuthLink(i));

        if (this.windowManager.tryHandleAppAuthRedeemUrl(hasAppAuthorization)) {
          return;
        }

        if (paramIndex !== -1) {
          projectLink = argv[paramIndex];
        }

        if (this.windowManager && this.windowManager.mainWindow) {
          if (projectLink !== "") {
            this.windowManager.openUrl(projectLink);
          }

          this.windowManager.mainWindow.isMinimized() && this.windowManager.mainWindow.restore();
          !this.windowManager.mainWindow.isVisible() && this.windowManager.mainWindow.show();

          this.windowManager.mainWindow.focus();
        }
      });

      this.session = new Session();
    }

    const colorSpace = storage.get().app.enableColorSpaceSrgb;

    if (colorSpace) {
      E.app.commandLine.appendSwitch("force-color-profile", "srgb");
    } else {
      E.app.commandLine.appendSwitch("disable-color-correct-rendering");
    }

    mkdirIfNotExists(themesDirectory).catch(error => {
      logger.error("mkdirIfNotExists error: ", error);
    });

    this.appEvent();
  }

  private appEvent = (): void => {
    E.app.setAsDefaultProtocolClient(Const.PROTOCOL);
    E.app.allowRendererProcessReuse = false;

    E.app.on("ready", this.ready);
    E.app.on("browser-window-created", (e, window) => window.setMenu(null));
    E.app.on("window-all-closed", this.onWindowAllClosed);
  };

  private ready = (): void => {
    const { figmaUrl } = Args();

    this.windowManager = WindowManager.instance;
    this.session.handleAppReady();

    setTimeout(() => {
      figmaUrl !== "" && this.windowManager.openUrl(figmaUrl);
    }, 1500);

    E.protocol.registerHttpProtocol(Const.PROTOCOL, (req: E.ProtocolRequest, cb: (req: E.ProtocolResponse) => void) => {
      if (this.windowManager.tryHandleAppAuthRedeemUrl(req.url)) {
        return;
      }

      this.windowManager.addTab("loadMainContent.js", req.url);

      cb({
        url: req.url,
        method: req.method,
      });
    });
  };

  private onWindowAllClosed = (): void => {
    E.app.quit();
  };
}

export default (): void => {
  new App();
};
