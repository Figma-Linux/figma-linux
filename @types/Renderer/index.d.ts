interface Window
  extends EventTarget,
    WindowTimers,
    WindowSessionStorage,
    WindowLocalStorage,
    WindowConsole,
    GlobalEventHandlers,
    IDBEnvironment,
    WindowBase64,
    AnimationFrameProvider,
    WindowOrWorkerGlobalScope,
    WindowEventHandlers {
  __figmaDesktop: {
    version: number;
    fileBrowser: boolean;

    postMessage(name: string, args?: any, transferList?: Transferable[]): void;
    registerCallback(name: string, args: any, callback: Function): void;
    promiseMessage(name: string, args?: any, transferList?: Transferable[]): Promise<void>;
    setMessageHandler(handler: Function): void;
  };

  __figmaContent: any;
}

// eslint-disable-next-line no-var
declare var Window: {
  prototype: Window;
  new (): Window;
};
