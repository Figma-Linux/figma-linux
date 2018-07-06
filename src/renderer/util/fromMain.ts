import * as E from "electron";



const currentWindow = () => {
	let win = E.remote.getCurrentWindow();
	console.log('currentWindow: ', win);

	return win.homepage;
};


export default currentWindow;