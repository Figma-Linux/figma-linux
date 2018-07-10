import * as E from "electron";
import Tabs from "../webContent/Tabs";

export default (mainWindow: E.BrowserWindow) => {
    let zoom = 0.8;

    E.globalShortcut.register('CommandOrControl+-', () => {
        const allWebContents: Array<E.WebContents> = E.webContents.getAllWebContents();
        
        allWebContents.map(w => {
            if (/(chrome-devtools|chrome-extension)/.test(w.getTitle())) return;
            const browserViews = Tabs.getAll();
            zoom -= 0.1;

            w.setZoomFactor(zoom);
            
            // browserViews.forEach(bw => bw.setBounds({
            //     x: 0,
            //     y: 28 / zoom,
            //     width: mainWindow.getContentBounds().width,
            //     height: mainWindow.getContentBounds().height - 28 / zoom 
            // }));
        });
    });
    E.globalShortcut.register('CommandOrControl+=', () => {
        const allWebContents: Array<E.WebContents> = E.webContents.getAllWebContents();

        allWebContents.map(w => {
            if (/(chrome-devtools|chrome-extension)/.test(w.getTitle())) return;
            const browserViews = Tabs.getAll();
            zoom += 0.1;

            w.setZoomFactor(zoom);
            
            // browserViews.forEach(bw => bw.setBounds({
            //     x: 0,
            //     y: 28 / zoom,
            //     width: mainWindow.getContentBounds().width,
            //     height: mainWindow.getContentBounds().height - 28 / zoom 
            // }));
        });
    });
    E.globalShortcut.register('Shift+CommandOrControl+-', () => {
        const allWebContents: Array<E.WebContents> = E.webContents.getAllWebContents();
        
        allWebContents.map(w => {
            if (/(chrome-devtools|chrome-extension)/.test(w.getTitle())) return;
            const browserViews = Tabs.getAll();
            zoom -= 0.05;

            w.setZoomFactor(zoom);
            
            // browserViews.forEach(bw => bw.setBounds({
            //     x: 0,
            //     y: 28 / zoom,
            //     width: mainWindow.getContentBounds().width,
            //     height: mainWindow.getContentBounds().height - 28 / zoom 
            // }));
        });
    });
    E.globalShortcut.register('Shift+CommandOrControl+=', () => {
        const allWebContents: Array<E.WebContents> = E.webContents.getAllWebContents();
        
        allWebContents.map(w => {
            if (/(chrome-devtools|chrome-extension)/.test(w.getTitle())) return;
            const browserViews = Tabs.getAll();
            zoom += 0.05;

            w.setZoomFactor(zoom);
            
            // browserViews.forEach(bw => bw.setBounds({
            //     x: 0,
            //     y: 28 / zoom,
            //     width: mainWindow.getContentBounds().width,
            //     height: mainWindow.getContentBounds().height - 28 / zoom 
            // }));
        });
    });
}