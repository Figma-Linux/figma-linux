interface AppProps { }

interface Window extends EventTarget, WindowTimers, WindowSessionStorage, WindowLocalStorage, WindowConsole, GlobalEventHandlers, IDBEnvironment, WindowBase64, GlobalFetch {
    __figmaDesktop: {
        version: number;
        fileBrowser: boolean;

        postMessage(name: string, args?: any, transferList?: Array<string>): void;
        promiseMessage(name: string, args?: any, transferList?: Array<string>): Promise<void>
        setMessageHandler(handler: Function): void;
    };

    __figmaContent: any;
}

declare var window: Window;