import * as Settings from "electron-settings";
import * as E from "electron";
import * as _ from "lodash";

import * as Const from "Const";
import { isAppAuthLink, isValidProjectLink } from "Utils/Common";
import { mkdirIfNotExists, themesDirectory } from "Utils/Main";
import Args from "./Args";
import { logger } from "./Logger";
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

      mkdirIfNotExists(themesDirectory).catch(error => {
        logger.error("mkdirIfNotExists error: ", error);
      });
    }

    this.appEvent();

    // TODO: to move in separate storage module
    const settings = Settings.getSync();
    const mergedSettings = _.mergeWith(Const.DEFAULT_SETTINGS, settings, (oldValue, newValue, key) => {
      if (key === "version") {
        return oldValue;
      }
    });

    Settings.setSync(mergedSettings);
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

    this.windowManager = new WindowManager();
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
    if (process.platform !== "darwin") {
      E.app.quit();
    }
  };
}

export default (): void => {
  new App();
};
