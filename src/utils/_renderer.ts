import * as E from "electron";


const sendMsgToMain = (msg: string, data: any) => {
	E.ipcRenderer.send(msg, data);
};

export {
	sendMsgToMain
}