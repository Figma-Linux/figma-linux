
import { resolve } from "path";
import { format as formatUrl } from "url";

const winUrlDev = `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`;

const winUrlProd = formatUrl({
	pathname: resolve(__dirname, '../index.html'),
	protocol: 'file',
	slashes: true
});

export {
    winUrlDev,
    winUrlProd
}