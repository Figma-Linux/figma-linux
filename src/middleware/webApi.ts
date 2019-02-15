interface IIntiApiOptions {
    version: number;
    fileBrowser: boolean;
    shortcutBinding?: any;
    shortcutsMap?: ShortcutsMap[];
    shortcutMan?: any;
}

export default (args: IIntiApiOptions) => {
    const channel = new MessageChannel();
    const pendingPromises = new Map();
    let messageHandler: Function;
    let nextPromiseID = 0;
    let messageQueue: Array<any> = [];

    console.log('args: ', args, args.shortcutMan);
    const shortcutBinding = new Function(`return ${args.shortcutBinding}`);
    console.log('args.shortcutBinding: ', `return ${args.shortcutBinding}`);
    console.log('shortcutBinding(args.shortcutsMap): ', shortcutBinding()(args.shortcutsMap, args.shortcutMan));

    const tryFlushMessages = () => {
        if (messageHandler) {
            while (true) {
                const msg = messageQueue.shift();
                if (!msg) {
                    break;
                }
                messageHandler(msg.name, msg.args);
            }
        }
    }

    window.__figmaContent = false;

    window.__figmaDesktop = {
        version: args.version,
        fileBrowser: args.fileBrowser,
        postMessage: function (name, args, transferList) {
            console.log('postMessage, name, args, transferList: ', name, args, transferList);
            window.__figmaDesktop.fileBrowser = false;

            // FIXME: ugly hack
            if (!/recent/.test(window.location.href) && name === 'updateActionState') {
                let state = {
                    'save-as': true,
                    'export-selected-exportables': true,
                    'toggle-grid': true,
                    'toggle-shown-layout-grids': true,
                    'toggle-show-masks': true,
                    'toggle-show-artboard-outlines': true,
                    'toggle-rulers': true,
                    'toggle-sidebar': true,
                    'toggle-ui': true,
                    'toggle-outlines': true,
                    'toggle-layers': true,
                    'toggle-publish': true,
                    'toggle-library': true,
                    'toggle-pixel-preview': true,
                    'toggle-checkerboard': true,
                    'zoom-in': true,
                    'zoom-out': true,
                    'zoom-reset': true,
                    'zoom-to-fit': true,
                    'zoom-to-selection': true,
                    'next-artboard': true,
                    'previous-artboard': true
                };

                channel.port1.postMessage({ name, args: { state: { ...args.state, ...state } } }, transferList);

                return;
            }

            channel.port1.postMessage({ name, args }, transferList);

        },
        promiseMessage: function (name, args, transferList) {
            console.log('promiseMessage, name, args, transferList: ', name, args, transferList);
            return new Promise((resolve, reject) => {
                const id = nextPromiseID++;
                pendingPromises.set(id, { resolve, reject });
                channel.port1.postMessage({ name, args, promiseID: id }, transferList);
            });
        },
        setMessageHandler: function (handler) {
            console.log('setMessageHandler: handler', handler);
            messageHandler = handler;
            tryFlushMessages();
        },
    };

    channel.port1.onmessage = (event: MessageEvent) => {
        const msg = event.data;

        if (!msg) return;
        console.log('channel.port1.onmessage, event: ', event);
        if (msg.promiseID != null) {
            const pendingPromise = pendingPromises.get(msg.promiseID);
            if (pendingPromise) {
                pendingPromises.delete(msg.promiseID);
                if ('result' in msg) {
                    pendingPromise.resolve(msg.result);
                }
                else {
                    pendingPromise.reject(msg.error);
                }
            }
        }
        else if (msg.name != null) {
            messageQueue.push(msg);
            tryFlushMessages();
        }
    };

    window.postMessage('init', location.origin, [channel.port2]);
}