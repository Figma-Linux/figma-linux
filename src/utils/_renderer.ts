import * as E from "electron";

export const isComponentUrl = (url: string): boolean => /^component:\/\/\w+/.test(url);

export const getComponentTitle = (url: string): string => url.substr(url.search(/\/\//)+2);

export const handleItemAction = (item: any, window: E.BrowserWindow) => {
	// FIXME: ugly hack
	if (!/ctrl|alt|shift|meta/i.test(item.accelerator)) return;

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
