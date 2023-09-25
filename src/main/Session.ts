import { session, Event, Cookie, app } from "electron";

import * as Const from "Const";
import { logger } from "./Logger";
import { isSameCookieDomain } from "Utils/Main";

export default class Session {
  private _hasFigmaSession: boolean;
  private assessSessionTimer: NodeJS.Timer;

  constructor() {
    this._hasFigmaSession = null;
    this.assessSessionTimer = null;
  }

  public get hasFigmaSession() {
    return this._hasFigmaSession;
  }

  public handleAppReady = () => {
    session.defaultSession.setPermissionRequestHandler((_, permission, callback) => {
      const whitelist = ["fullscreen", "pointerLock"];
      callback(whitelist.includes(permission));
    });

    const defaultUserAgent = session.defaultSession.getUserAgent();
    const userAgent = defaultUserAgent.replace(/Figma([^/]+)\/([^\s]+)/, "Figma$1/$2 Figma/$2");

    session.defaultSession.setUserAgent(userAgent);
    session.defaultSession.cookies
      .get({
        url: Const.HOMEPAGE,
      })
      .then((cookies) => {
        this._hasFigmaSession = !!cookies.find((cookie) => {
          return cookie.name === Const.FIGMA_SESSION_COOKIE_NAME;
        });

        logger.info("[wm] already signed in?", this._hasFigmaSession);
      })
      .catch((error: Error) =>
        logger.error("[wm] failed to get cookies during handleAppReady:", Const.HOMEPAGE, error),
      );
  };
}
