/// <reference path="../../@types/renderer/index.d.ts" />

import * as E from "electron";


const API_VERSION = 9;
let webPort: MessagePort;

const onWebMessage = (event: MessageEvent) => {
    const msg = event.data;
    
    if (!msg) return;
    
    let resultPromise = undefined;

    try {
        resultPromise = msg.name && publicAPI[msg.name](msg.args);
        console.log('onWebMessage, msg: ', msg);
    }
    finally {
        if (msg.promiseID != null) {
            if (resultPromise instanceof Promise) {
                resultPromise.then((result) => {
                    webPort.postMessage({ result: result.data, promiseID: msg.promiseID }, result.transferList);
                }).catch(error => {
                    const errorString = error && error.name || 'Promise error';
                    webPort.postMessage({ error: errorString, promiseID: msg.promiseID });
                });
            }
            else {
                webPort.postMessage({ error: 'No result', promiseID: msg.promiseID });
            }
        }
    }

}

const initWebApi = (version: number) => {
    const channel = new MessageChannel();
    const pendingPromises = new Map();
    let messageHandler: Function;
    let nextPromiseID = 0;
    let messageQueue: Array<any> = [];

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

    window.__figmaDesktop = {
        version: version,
        fileBrowser: false,
        postMessage: function (name, args, transferList) {
            console.log('postMessage, name, args, transferList: ', name, args, transferList);
            
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
            messageHandler = handler;
            tryFlushMessages();
        },
    };

    channel.port1.onmessage = (event: MessageEvent) => {
        const msg = event.data;

        if (!msg) return;

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

const publicAPI: any = {
    setTitle(args: any) {
        console.log('setTitle ,args: ', args);
        // postMessageToMainProcess('updateTitle', args.getString('title'));
    }
}



const init = () => {
    window.addEventListener('message', event => {
        // console.log(`window message, ${event.origin} === ${location.origin}, data, ports: `, event.data, event.ports);
        webPort = event.ports[0];
        webPort.onmessage = onWebMessage;
        console.log(`window message, webPort: `, webPort);
    }, { once: true });

    E.webFrame.executeJavaScript(`(${initWebApi.toString()})(${API_VERSION})`);
}


init();

// export default init;