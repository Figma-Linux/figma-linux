import * as E from "electron";


const sendMsgToMain = (msg: string, ...data: Array<any>) => {
	E.ipcRenderer.send(msg, ...data);
};

export {
	sendMsgToMain
}