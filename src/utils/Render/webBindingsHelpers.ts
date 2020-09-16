import * as E from "electron";

export const postPromiseMessageToMainProcess = (function () {
  let nextPromiseID = 0;
  const pendingPromises = new Map();

  E.ipcRenderer.on("handlePromiseResolve", (event: E.Event, promiseID: number, result: any) => {
    const pendingPromise = pendingPromises.get(promiseID);
    if (pendingPromise) {
      pendingPromises.delete(promiseID);
      pendingPromise.resolve(result);
    } else {
      console.error("[desktop] unexpected resolve for promise", promiseID);
    }
  });
  E.ipcRenderer.on("handlePromiseReject", (event: E.Event, promiseID: number, error: any) => {
    const pendingPromise = pendingPromises.get(promiseID);
    if (pendingPromise) {
      pendingPromises.delete(promiseID);
      pendingPromise.reject(error);
    } else {
      console.error("[desktop] unexpected reject for promise", promiseID);
    }
  });

  return function (channel: string, ...args: any[]) {
    return new Promise(function (resolve, reject) {
      const promiseID = nextPromiseID++;
      let noResp = setTimeout(() => console.log("pPMTMP no response:", promiseID, channel), 1000);
      pendingPromises.set(promiseID, {
        resolve: (r: any) => {
          clearTimeout(noResp);
          resolve(r);
        }, reject: (r: any) => {
          clearTimeout(noResp);
          reject(r);
        }
      });
      E.ipcRenderer.send("web-promise:" + channel, promiseID, ...args);
    });
  };
})();

export const postCallbackMessageToMainProcess = (channel: string, ...args: any[]) => {
  E.ipcRenderer.send(`web-callback:${channel}`, ...args);
};

export const sendMsgToMain = (msg: string, ...data: any[]) => {
  E.ipcRenderer.send(msg, ...data);
};

export const registerCallbackWithMainProcess = (() => {
  let nextCallbackID = 0;
  const registeredCallbacks = new Map();

  E.ipcRenderer.on("handleCallback", (event: E.Event, callbackID: number, result: any) => {
    const registeredCallback = registeredCallbacks.get(callbackID);
    if (registeredCallback) {
      registeredCallback(result);
    } else {
      console.error("[desktop] unexpected callback", callbackID);
    }
  });

  return function (channel: string, args: any, callback: Function) {
    const callbackID = nextCallbackID++;
    registeredCallbacks.set(callbackID, callback);

    E.ipcRenderer.send(`web-callback:${channel}`, args, callbackID);

    return () => {
      // TODO: this message is not handled anywhere
      E.ipcRenderer.send("web-cancel-callback", callbackID);
      registeredCallbacks.delete(callbackID);
    };
  };
})();
