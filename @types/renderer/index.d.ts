interface AppProps { }

interface Window extends EventTarget, WindowTimers, WindowSessionStorage, WindowLocalStorage, WindowConsole, GlobalEventHandlers, IDBEnvironment, WindowBase64, GlobalFetch {
    __figmaDesktop: {
        version: number;
        fileBrowser: boolean;

        postMessage(name: string, args?: any, transferList?: Transferable[]): void;
        promiseMessage(name: string, args?: any, transferList?: Transferable[]): Promise<void>
        setMessageHandler(handler: Function): void;
    };

    __figmaContent: any;
}

declare var window: Window;