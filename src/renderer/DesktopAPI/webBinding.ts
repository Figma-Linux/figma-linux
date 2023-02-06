import * as E from "electron";

import { sendMsgToMain, registerCallbackWithMainProcess } from "Utils/Render";
import { isMenuItem } from "Utils/Common";
import { themes } from "./ThemesApplier";

interface IntiApiOptions {
  version: number;
  fileBrowser: boolean;
}

const API_VERSION = 53;
let webPort: MessagePort;
const mainProcessCancelCallbacks: Map<number, () => void> = new Map();

const onWebMessage = (event: MessageEvent) => {
  const msg = event.data;

  if (!msg) return;

  if (msg.callbackID != null) {
    const cancel = registerCallbackWithMainProcess(msg.name, msg.args, (args: any) => {
      webPort.postMessage({ args, callbackID: msg.callbackID });
    });
    mainProcessCancelCallbacks.set(msg.callbackID, cancel);
    return;
  }
  if (msg.cancelCallbackID != null) {
    mainProcessCancelCallbacks.get(msg.cancelCallbackID)();
    mainProcessCancelCallbacks.delete(msg.cancelCallbackID);
    return;
  }
  if (!msg.name || !(msg.name in publicAPI)) {
    sendMsgToMain("log-error", "[desktop] Unhandled message", msg.name);
    return;
  }

  let resultPromise = undefined;

  try {
    resultPromise = msg.name && publicAPI && publicAPI[msg.name](msg.args);
  } catch (e) {
    console.error("onWebMessage, err: ", msg.name, e);
    throw e;
  } finally {
    if (msg.promiseID != null) {
      if (resultPromise instanceof Promise) {
        resultPromise
          .then((result) => {
            webPort.postMessage({ result: result.data, promiseID: msg.promiseID });
          })
          .catch((error) => {
            const errorString = (error && error.name) || "Promise error";
            webPort.postMessage({ error: errorString, promiseID: msg.promiseID });
          });
      } else {
        webPort.postMessage({ error: "No result" + resultPromise, promiseID: msg.promiseID });
      }
    }
  }
};

const initWebApi = (props: IntiApiOptions) => {
  const channel = new MessageChannel();
  const pendingPromises = new Map();
  const registeredCallbacks = new Map();

  let messageHandler: (name: string, args: any) => void;
  let nextPromiseID = 0;
  let nextCallbackID = 0;
  const messageQueue: any[] = [];

  const tryFlushMessages = () => {
    if (messageHandler) {
      let msg = messageQueue.shift();
      while (msg) {
        msg = messageQueue.shift();
        if (!msg) {
          break;
        }
        messageHandler(msg.name, msg.args);
      }
    }
  };

  window.__figmaContent = false;

  if (/file\/.+/.test(location.href)) {
    props.fileBrowser = false;
  }

  window.__figmaDesktop = {
    version: props.version,
    fileBrowser: props.fileBrowser,
    postMessage: function (name, args, transferList): void {
      console.log("postMessage, name, args, transferList: ", name, args, transferList);

      // FIXME: ugly hack
      if (!/recent/.test(window.location.href) && name === "updateActionState") {
        console.log("postMessage ugly hack: ", name, args);
        const state = {
          "save-as": true,
          "export-selected-exportables": true,
          "toggle-grid": true,
          "toggle-shown-layout-grids": true,
          "toggle-show-masks": true,
          "toggle-show-artboard-outlines": true,
          "toggle-rulers": true,
          "toggle-sidebar": true,
          "toggle-ui": true,
          "toggle-outlines": true,
          "toggle-layers": true,
          "toggle-publish": true,
          "toggle-library": true,
          "toggle-pixel-preview": true,
          "toggle-checkerboard": true,
          "zoom-in": true,
          "zoom-out": true,
          "zoom-reset": true,
          "zoom-to-fit": true,
          "zoom-to-selection": true,
          "next-artboard": true,
          "previous-artboard": true,
        };

        args = { state: { ...args.state, ...state } };
      }

      channel.port1.postMessage({ name, args }, transferList);
    },
    registerCallback: function (name, args, callback) {
      const id = nextCallbackID++;
      console.log(`Register pending promise with id: "${id}", name: "${name}", args: `, args);
      registeredCallbacks.set(id, callback);
      channel.port1.postMessage({ name, args, callbackID: id });
      return (): void => {
        registeredCallbacks.delete(id); // TODO: is it okay to delete this? will it ever be needed after cancelled?
        channel.port1.postMessage({ cancelCallbackID: id });
      };
    },
    promiseMessage: function (name, args, transferList) {
      return new Promise((resolve, reject) => {
        const id = nextPromiseID++;
        pendingPromises.set(id, { resolve, reject });
        channel.port1.postMessage({ name, args, promiseID: id });
      });
    },
    setMessageHandler: function (handler: () => void): void {
      messageHandler = handler;
      tryFlushMessages();
    },
  };

  channel.port1.onmessage = (event: MessageEvent): void => {
    const msg = event.data;

    if (!msg) return;

    if (msg.promiseID != null) {
      const pendingPromise = pendingPromises.get(msg.promiseID);

      if (pendingPromise) {
        pendingPromises.delete(msg.promiseID);
        if ("result" in msg) {
          pendingPromise.resolve(msg.result);
        } else {
          console.error(`Pending Promise (id: "${msg.promiseID}") reject via error: `, msg.error);
          pendingPromise.reject(msg.error);
        }
      }
    } else if (msg.callbackID != null) {
      const registeredCallback = registeredCallbacks.get(msg.callbackID);
      if (registeredCallback) {
        registeredCallback(msg.args);
      } else {
        console.log("callback missing? ", msg);
      }
    } else if (msg.name != null) {
      messageQueue.push(msg);
      tryFlushMessages();
    }
  };

  window.postMessage("init", location.origin, [channel.port2]);
};

const initWebBindings = (): void => {
  E.ipcRenderer.on("newFile", () => {
    webPort.postMessage({ name: "newFile", args: {} });
  });
  E.ipcRenderer.on("handleAction", (_: Event, action: string, source: string) => {
    webPort.postMessage({ name: "handleAction", args: { action, source } });
  });
  E.ipcRenderer.on("handleUrl", (_: Event, path: string, params: string) => {
    console.log("handleUrl, url: ", path);
    webPort.postMessage({ name: "handleUrl", args: { path, params } });
  });
  E.ipcRenderer.on("handlePageCommand", (_: Event, command: string) => {
    const fullscreenFocusTargetFocused =
      document.activeElement && document.activeElement.classList.contains("focus-target");
    if (fullscreenFocusTargetFocused) {
      let action = null;
      switch (command) {
        case "redo":
        case "undo":
          action = command;
          break;
        case "selectAll":
          action = "select-all";
          break;
      }

      if (action) {
        webPort.postMessage({ name: "handleAction", args: { action, source: "os-menu" } });
      }
    } else {
      document.execCommand(command);
    }
  });

  E.ipcRenderer.on("redeemAppAuth", (event: Event, gSecret: string) => {
    webPort.postMessage({ name: "redeemAppAuth", args: { gSecret } });
  });

  E.ipcRenderer.on("handlePluginMenuAction", (event: Event, pluginMenuAction: any) => {
    webPort.postMessage({ name: "handlePluginMenuAction", args: { pluginMenuAction } });
  });
};

const publicAPI: any = {
  setTitle(args: WebApi.SetTitleArgs) {
    sendMsgToMain("setTitle", args.title);
  },

  setUser(args: WebApi.SetUser) {
    sendMsgToMain("setAuthedUsers", [args.id]);
  },
  setUsingMicrophone(args: WebApi.SetUsingMic) {
    sendMsgToMain("setUsingMicrophone", args.isUsingMicrophone);
  },
  setIsInVoiceCall(args: WebApi.SetIsInVoiceCall) {
    sendMsgToMain("setIsInVoiceCall", args.isInVoiceCall);
  },

  addTabAnalyticsMetadata(args: any) {
    // sendMsgToMain("addTabAnalyticsMetadata", args.isUsingMicrophone);
    console.log("Method addTabAnalyticsMetadata not implemented, args: ", args);
  },
  requestMicrophonePermission() {
    sendMsgToMain("requestMicrophonePermission");
  },

  newFile(args: any) {
    sendMsgToMain("newFile", args.info);
  },
  openFile(args: any) {
    sendMsgToMain("openFile", "/file/" + args.fileKey, args.title, undefined, args.target);
  },
  openPrototype(args: any) {
    sendMsgToMain(
      "openFile",
      "/proto/" + args.fileKey,
      args.title,
      "?node-id=" + args.pageId,
      args.target,
    );
  },
  close(args: any) {
    sendMsgToMain("closeTab", args.suppressReopening);
  },
  setFileKey(args: any) {
    sendMsgToMain("updateFileKey", 1, args.fileKey);
  },
  setLoading(args: any) {
    sendMsgToMain("updateLoadingStatus", args.loading);
  },
  setSaved(args: any) {
    sendMsgToMain("updateSaveStatus", args.saved);
  },
  updateActionState(args: any) {
    sendMsgToMain("updateActionState", args.state);
  },
  showFileBrowser() {
    sendMsgToMain("showFileBrowser");
  },
  setIsPreloaded() {
    sendMsgToMain("setIsPreloaded");
  },
  setPluginMenuData(args: WebApi.SetPluginMenuDataProps) {
    const pluginMenuData = [];
    for (const item of args.data) {
      if (isMenuItem(item)) {
        pluginMenuData.push(item);
      } else {
        // sendMsgToMain("log-error", "[desktop] invalid plugin menu item", args);
      }
    }

    sendMsgToMain("setPluginMenuData", pluginMenuData);
  },

  setFeatureFlags(args: any) {
    sendMsgToMain("setFeatureFlags", args);
  },
  startAppAuth(args: any) {
    sendMsgToMain("startAppAuth", args);
  },
  finishAppAuth(args: any) {
    sendMsgToMain("finishAppAuth", args);
  },
  openDevTools(args: { mode: string }) {
    sendMsgToMain("openDevTools", args.mode);
  },

  setAuthedUsers(args: WebApi.SetAuthedUsers) {
    sendMsgToMain("setAuthedUsers", args.userIDs);
  },
  setWorkspaceName(args: WebApi.SetWorkspaceName) {
    sendMsgToMain("setWorkspaceName", args.name);
  },
  setFigjamEnabled(args: WebApi.SetFigjamEnabled) {
    sendMsgToMain("setFigjamEnabled", args.figjamEnabled);
  },

  async createMultipleNewLocalFileExtensions(args: WebApi.CreateMultipleExtension) {
    console.log("createMultipleNewLocalFileExtensions, args: ", args);
    const result = await E.ipcRenderer.invoke("createMultipleNewLocalFileExtensions", args);

    return { data: result };
  },
  async getAllLocalManifestFileExtensionIds() {
    const list = await E.ipcRenderer.invoke("getAllLocalFileExtensionIds");
    return { data: list };
  },
  async getLocalFileExtensionManifest(args: WebApi.ExtensionId) {
    const manifest = await E.ipcRenderer.invoke("getLocalFileExtensionManifest", args.id);
    return { data: manifest };
  },
  async getLocalFileExtensionSource(args: WebApi.ExtensionId) {
    const source = await E.ipcRenderer.invoke("getLocalFileExtensionSource", args.id);
    return { data: source };
  },
  removeLocalFileExtension(args: WebApi.ExtensionId) {
    E.ipcRenderer.send("removeLocalFileExtension", args.id);
  },
  openExtensionDirectory(args: WebApi.ExtensionId) {
    E.ipcRenderer.send("openExtensionDirectory", args.id);
  },
  async writeNewExtensionToDisk(args: WebApi.WriteNewExtensionToDiskArgs) {
    const extId = await E.ipcRenderer.invoke("writeNewExtensionToDisk", args);
    return { data: extId };
  },

  async isDevToolsOpened() {
    const isOpened = await E.ipcRenderer.invoke("isDevToolsOpened");

    return { data: isOpened };
  },

  async getFonts(args: WebApi.GetFonts) {
    const fonts = await E.ipcRenderer.invoke("getFonts");
    return { data: fonts };
  },

  async getFontFile(args: WebApi.GetFontFile) {
    const fontBuffer = await E.ipcRenderer.invoke("getFontFile", args);

    return { data: fontBuffer, transferList: [fontBuffer] };
  },

  getClipboardData(args: any) {
    return new Promise((resolve, reject) => {
      if (E.clipboard.has("org.nspasteboard.ConcealedType")) {
        sendMsgToMain("log-error", "Clipboard unavailable");
        reject(new Error("Clipboard unavailable"));
        return;
      }

      const whitelistedFormats = ["com.adobe.pdf", "com.adobe.xd", "com.bohemiancoding.sketch.v3"];

      const formats = args.getArray("formats");

      for (const format of formats) {
        let data = null;

        if (format === "text/html") {
          const unsafeHTML = E.clipboard.readHTML().trim();

          if (unsafeHTML.includes("<!--(figma)") && unsafeHTML.includes("(/figma)-->")) {
            data = Buffer.from(unsafeHTML);
          }
        } else if (format === "image/svg+xml") {
          data = E.clipboard.readBuffer(format);
          data = data.byteLength > 0 ? data : E.clipboard.readBuffer("Scalable Vector Graphics");
          data =
            data.byteLength > 0
              ? data
              : E.clipboard.readBuffer("CorePasteboardFlavorType 0x53564720");

          if (data.byteLength === 0) {
            const unsafeText = E.clipboard.readText().trim();
            if (unsafeText.startsWith("<svg") && unsafeText.endsWith("</svg>")) {
              data = Buffer.from(unsafeText);
            }
          }
        } else if (format === "image/jpeg" || format === "image/png") {
          data = E.clipboard.readImage().toBitmap();
        } else if (whitelistedFormats.indexOf(format) !== -1) {
          data = E.clipboard.readBuffer(format);
        }

        if (data && data.byteLength > 0) {
          const result = {
            data: data.buffer,
            format: format,
          };

          resolve({ data: result, transferList: [data.buffer] });
          return;
        }
      }

      sendMsgToMain("log-error", "Formats not found. Formats: ", formats);
      reject(new Error("Formats not found"));
    });
  },

  setClipboardData(args: WebApi.SetClipboardData) {
    E.ipcRenderer.send("setClipboardData", args);
  },

  async writeFiles(args: WebApi.WriteFiles) {
    console.log("writeFiles, args: ", args);
    await E.ipcRenderer.invoke("writeFiles", args);
  },
};

const init = (fileBrowser: boolean): void => {
  window.addEventListener(
    "message",
    (event) => {
      webPort = event.ports[0];
      console.log(`window message, webPort: `, webPort, event.data);
      webPort && (webPort.onmessage = onWebMessage);
    },
    { once: true },
  );

  const initWebOptions: IntiApiOptions = {
    version: API_VERSION,
    fileBrowser: fileBrowser,
  };

  initWebBindings();

  E.webFrame.executeJavaScript(`(${initWebApi.toString()})(${JSON.stringify(initWebOptions)})`);

  document.addEventListener("DOMContentLoaded", () => {
    E.ipcRenderer.invoke("themesIsDisabled").then((disabled) => {
      if (!disabled) {
        setTimeout(() => {
          themes.init();
        }, 10);
      }
    });
  });
};

export default init;
