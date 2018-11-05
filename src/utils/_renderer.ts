import * as E from "electron";

export const handleItemAction = (item: any, window: E.BrowserWindow) => {
	const currentView = window.getBrowserView();

	currentView.webContents.send('handleAction', item.action, 'os-menu');
};

export const handleCommandItemClick = (item?: any, window?: E.BrowserWindow) => {
	const currentView = window.getBrowserView();

	currentView.webContents.send('handlePageCommand', item.command);
};

export const sendMsgToMain = (msg: string, ...data: Array<any>) => {
	E.ipcRenderer.send(msg, ...data);
};

export const isFileBrowser = (url: string) => {
	return !/file\/.+/.test(url);
}
