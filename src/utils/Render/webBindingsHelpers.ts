import * as E from "electron";

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

  return function(channel: string, args: any, callback: (result: any) => void) {
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
