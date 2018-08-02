/// <reference path="../../@types/renderer/index.d.ts" />

import * as E from "electron";
import * as path from "path";
import * as fs from "fs";

import { sendMsgToMain } from "./util";

const API_VERSION = 9;
let webPort: MessagePort;

const onWebMessage = (event: MessageEvent) => {
    const msg = event.data;
    
    if (!msg) return;
    
    let resultPromise = undefined;

    try {
        console.log('onWebMessage, publicAPI, msg: ', publicAPI, msg);
        resultPromise = msg.name && publicAPI && publicAPI[msg.name](msg.args);
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

const initWebApi = (version: number, fileBrowser: boolean) => {
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

    console.log('initWebApi, fileBrowser: ', fileBrowser);
    window.__figmaDesktop = {
        version: version,
        fileBrowser: fileBrowser,
        postMessage: function (name, args, transferList) {
            console.log('postMessage, name, args, transferList: ', name, args, transferList);
            window.__figmaDesktop.fileBrowser = false;
            
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

const publicAPI: any = {
    setTitle(args: any) {
        sendMsgToMain('setTitle', args.title);
    },

    writeFiles(args: any) {
        console.log('writeFiles args: ', args);
        const files = args.files;
        if (!Array.isArray(files) || files.length === 0) {
            return;
        }
        let skipReplaceConfirmation = false;
        let directoryPath;
        if (files.length === 1 && !files[0].name.includes(path.sep)) {
            const originalFileName = files[0].name;
            const savePath = E.remote.dialog.showSaveDialog({
                defaultPath: path.basename(originalFileName),
                showsTagField: false,
            });
            if (savePath) {
                directoryPath = path.dirname(savePath);
                files[0].name = path.basename(savePath);
                if (path.extname(files[0].name) === '') {
                    files[0].name += path.extname(originalFileName);
                }
                else {
                    skipReplaceConfirmation = true;
                }
            }
        }
        else {
            const directories = E.remote.dialog.showOpenDialog({
                properties: ['openDirectory', 'createDirectory'],
                buttonLabel: 'Save',
            });
            if (!directories || directories.length !== 1) {
                return;
            }
            directoryPath = directories[0];
        }
        if (!directoryPath) {
            return;
        }
        directoryPath = path.resolve(directoryPath);
        let filesToBeReplaced = 0;
        for (let file of files) {
            const outputPath = path.join(directoryPath, file.name);
            const validExtensions = [
                '.fig',
                '.jpg',
                '.pdf',
                '.png',
                '.svg',
            ];
            if (path.relative(directoryPath, outputPath).startsWith('..') ||
                !validExtensions.findIndex(i => i === path.extname(outputPath))) {
                E.remote.dialog.showMessageBox({
                    type: 'error',
                    title: 'Export Failed',
                    message: 'Export failed',
                    detail: `"${outputPath}" is not a valid path. No files were saved.`,
                    buttons: ['OK'],
                    defaultId: 0,
                });
                return;
            }
            try {
                fs.accessSync(outputPath, fs.constants.R_OK);
                ++filesToBeReplaced;
            }
            catch (ex) {
            }
        }
        if (filesToBeReplaced > 0 && !skipReplaceConfirmation) {
            const single = filesToBeReplaced === 1;
            const selectedID = E.remote.dialog.showMessageBox({
                type: 'warning',
                title: 'Replace Existing Files',
                message: `Replace existing file${single ? '' : `s`}?`,
                detail: `${single ? `"${files[0].name}" already exists` : `${filesToBeReplaced} files including "${files[0].name}" already exist`}. Replacing ${single ? 'it' : 'them'} will overwrite ${single ? 'its' : 'their'} existing contents.`,
                buttons: ['Replace', 'Cancel'],
                defaultId: 0,
            });
            if (selectedID !== 0) {
                return;
            }
        }
        for (let file of files) {
            {
                const parts = file.name.split('/');
                parts.pop();
                let dirPath = directoryPath;
                for (let part of parts) {
                    try {
                        dirPath = path.join(dirPath, part);
                        fs.mkdirSync(dirPath);
                    }
                    catch (ex) {
                    }
                }
            }
            try {
                const outputPath = path.join(directoryPath, file.name);
                const opts = { encoding: 'binary' };
                fs.writeFileSync(outputPath, Buffer.from(file.buffer), opts);
            }
            catch (ex) {
                E.remote.dialog.showMessageBox({
                    type: 'error',
                    title: 'Export Failed',
                    message: 'Saving file failed',
                    detail: `"${file.name}" could not be saved. Remaining files will not be saved.`,
                    buttons: ['OK'],
                    defaultId: 0,
                });
            }
        }
    }
}

const init = (fileBrowser: boolean) => {
    window.addEventListener('message', event => {
        // console.log(`window message, ${event.origin} === ${location.origin}, data, ports: `, event.data, event.ports);
        webPort = event.ports[0];
        webPort.onmessage = onWebMessage;
        console.log(`window message, webPort: `, webPort);
        // console.log('window.__figmaDesktop.fileBrowser: ', window.__figmaDesktop.fileBrowser);
        // window.__figmaDesktop.fileBrowser = false;
    }, { once: true });

    E.webFrame.executeJavaScript(`(${initWebApi.toString()})(${API_VERSION}, ${fileBrowser})`);
}


export default init;