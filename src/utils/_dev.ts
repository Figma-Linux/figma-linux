import * as E from "electron";

export const isDev = process.env.NODE_ENV !== 'production';

export const toggleDetachedDevTools = (webContents: E.WebContents) => {
	if (webContents.isDevToolsOpened()) {
		webContents.closeDevTools();

		return;
	}

	webContents.openDevTools({ mode: 'detach' });
}
