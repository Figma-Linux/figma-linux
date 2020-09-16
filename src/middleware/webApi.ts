interface IntiApiOptions {
  version: number;
  fileBrowser: boolean;
  shortcutBinding?: any;
  shortcutsMap?: ShortcutsMap[];
  shortcutMan?: any;
}

export default (args: IntiApiOptions): void => {
  const channel = new MessageChannel();
  const pendingPromises = new Map();
  const registeredCallbacks = new Map();

  let messageHandler: Function;
  let nextPromiseID = 0;
  let nextCallbackID = 0;
  const messageQueue: any[] = [];

  // console.log('args: ', args, args.shortcutMan);
  // const shortcutBinding = new Function(`return ${args.shortcutBinding}`);
  // console.log('args.shortcutBinding: ', `return ${args.shortcutBinding}`);
  // console.log('shortcutBinding(args.shortcutsMap): ', shortcutBinding()(args.shortcutsMap, args.shortcutMan));

  const tryFlushMessages = (): void => {
    if (messageHandler) {
      while (true) {
        const msg = messageQueue.shift();
        if (!msg) {
          break;
        }
        messageHandler(msg.name, msg.args);
      }
    }
  };

  window.__figmaContent = false;

  console.log("args.fileBrowser: ", typeof args.fileBrowser, args.fileBrowser);

  if (/file\/.+/.test(location.href)) {
    args.fileBrowser = false;
  }

  window.__figmaDesktop = {
    version: args.version,
    fileBrowser: args.fileBrowser,
    postMessage: function (name, args, transferList) {
      console.log("postMessage, name, args, transferList: ", name, args, transferList);

      // FIXME: ugly hack
      if (!/recent/.test(window.location.href) && name === "updateActionState") {
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

        channel.port1.postMessage({ name, args: { state: { ...args.state, ...state } } }, transferList);

        return;
      }

      channel.port1.postMessage({ name, args }, transferList);
    },
    registerCallback: function (name, args, callback) {
      const id = nextCallbackID++;
      registeredCallbacks.set(id, callback);
      channel.port1.postMessage({ name, args, callbackID: id });
      return () => {
        channel.port1.postMessage({ cancelCallbackID: id });
      };
    },
    promiseMessage: function (name, args, transferList) {
      console.log("promiseMessage, name, args, transferList: ", name, args, transferList);
      return new Promise((resolve, reject) => {
        const id = nextPromiseID++;
        pendingPromises.set(id, { resolve, reject });
        channel.port1.postMessage({ name, args, promiseID: id }, transferList);
      });
    },
    setMessageHandler: function (handler) {
      console.log("setMessageHandler: handler", handler);
      messageHandler = handler;
      tryFlushMessages();
    },
  };

  channel.port1.onmessage = (event: MessageEvent) => {
    const msg = event.data;

    if (!msg) return;

    console.log("webApi channel.port1.onmessage, event, event.data: ", event, event.data);

    if (msg.promiseID != null) {
      const pendingPromise = pendingPromises.get(msg.promiseID);

      if (pendingPromise) {
        pendingPromises.delete(msg.promiseID);
        if ("result" in msg) {
          pendingPromise.resolve(msg.result);
        } else {
          pendingPromise.reject(msg.error);
        }
      }
    } else if (msg.name != null) {
      messageQueue.push(msg);
      tryFlushMessages();
    }
  };

  window.postMessage("init", location.origin, [channel.port2]);
};
