import * as electron from "electron";
import Args from "./Args";

import WindowManager from "./WindowManager";

interface IApp {
    windowManager: WindowManager;
}

class App implements IApp {
    windowManager: WindowManager;

    private static _instance: App;

    constructor() {
        if (App._instance) {
            throw new Error(`You don't can create instance of App class manually. Call the getInstance method.`);
        }

        const { withoutFrame } = Args();
        const options: electron.BrowserWindowConstructorOptions = {
            width: 1200,
            height: 900,
            frame: withoutFrame,
            webPreferences: {
                nodeIntegration: false,
                webSecurity: false,
                webgl: true,
                experimentalFeatures: true,
                experimentalCanvasFeatures: true,
                zoomFactor: 0.7
            }
        }

        const home = 'https://www.figma.com';
        this.windowManager = new WindowManager(options, home);
    }

    public static init = () => {
        if (App._instance) {
            return App._instance;
        }

        return App._instance = new App(); 
    }
}

export default App;
export {
    IApp
}