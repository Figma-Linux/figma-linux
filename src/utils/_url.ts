import * as E from 'electron';
import * as Settings from 'electron-settings';

import { resolve } from "path";
import { format as formatUrl } from "url";

export const winUrlDev = `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`;

export const winUrlProd = formatUrl({
	pathname: resolve(__dirname, '../index.html'),
	protocol: 'file',
	slashes: true
});
