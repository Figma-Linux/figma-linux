import * as E from "electron";

import Tab from "Main/window/Tabs";
import { isDev } from "Utils/Common";

export function listenToWebBinding(channel: string, listener: Function): void {
  E.ipcMain.on(`web:${channel}`, (event: E.IpcMainEvent, ...args: any[]) => {
    isDev && console.log(`[ipc] from web: ${channel}`);

    event.returnValue = listener(event.sender, ...args);
  });
}

export function listenToWebBindingPromise(channel: string, listener: Function): void {
  E.ipcMain.on(
    `web-promise:${channel}`,
    async (event: E.IpcMainEvent, promiseID: number, ...args: any[]) => {
      isDev && console.log(`[ipc] from web: ${channel} (promise ${promiseID})`);

      let result;
      let method;

      try {
        result = await listener(event.sender, ...args);
        method = "handlePromiseResolve";
      } catch (error) {
        result = error + "";
        method = "handlePromiseReject";
      }

      const view = Tab.getByWebContentId(event.sender.id);

      if (!view) {
        return;
      }

      view.webContents.send(method, promiseID, result);
    },
  );
}

export function listenToWebRegisterCallback(channel: string, listener: Function): void {
  E.ipcMain.on(`web-callback:${channel}`, (event: E.IpcMainEvent, args: any, callbackID: number) => {
    isDev && console.log(`[ipc] from web: ${channel} (callback ${callbackID})`);

    const view = Tab.getByWebContentId(event.sender.id);

    if (!view) {
      return;
    }

    const cancel = listener(event.sender, args, (args: any) => {
      view.webContents.send("handleCallback", callbackID, args);
    });

    Tab.registeredCancelCallbackMap.set(callbackID, cancel);
  });
}
