import { ipcMain, WebContents, IpcMainEvent } from "electron";

import Tab from "Main/Ui/TabManager";
import { isDev } from "Utils/Common";

export function listenToWebBinding(
  channel: string,
  listener: (sender: WebContents, ...args: any[]) => void,
): void {
  ipcMain.on(`web:${channel}`, (event: IpcMainEvent, ...args: any[]) => {
    isDev && console.log(`[ipc] from web: ${channel}`);

    event.returnValue = listener(event.sender, ...args);
  });
}

export function listenToWebBindingPromise(
  channel: string,
  listener: (sender: WebContents, ...args: any[]) => void,
): void {
  ipcMain.on(
    `web-promise:${channel}`,
    async (event: IpcMainEvent, promiseID: number, ...args: any[]) => {
      console.log(`[ipc] from web: ${channel} (promise ${promiseID})`);

      let result;
      let method;

      try {
        result = await listener(event.sender, ...args);
        method = "handlePromiseResolve";
      } catch (error) {
        result = error + "";
        method = "handlePromiseReject";
      }

      // const tab = Tab.getByWebContentId(event.sender.id);

      // if (!tab) {
      //   return;
      // }

      // tab.view.webContents.send(method, promiseID, result);
    },
  );
}

export function listenToWebRegisterCallback(
  channel: string,
  listener: (sender: WebContents, ...args: any[]) => () => void,
): void {
  ipcMain.on(`web-callback:${channel}`, (event: IpcMainEvent, args: any, callbackID: number) => {
    isDev && console.log(`[ipc] from web: ${channel} (callback ${callbackID})`);

    // const tab = Tab.getByWebContentId(event.sender.id);

    // if (!tab) {
    //   return;
    // }

    // const cancel = listener(event.sender, args, (args: any) => {
    //   tab.view.webContents.send("handleCallback", callbackID, args);
    // });

    // Tab.registeredCancelCallbackMap.set(callbackID, cancel);
  });
}
