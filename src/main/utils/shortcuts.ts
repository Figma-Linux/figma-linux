import { globalShortcut } from 'electron';
import * as E from "electron";

export default () => {
    const allWebContents: Array<E.WebContents> = E.webContents.getAllWebContents();
    let zoom = 0.7;

    globalShortcut.register('CommandOrControl+-', () => {
        allWebContents.map(w => {
            zoom -= 0.1;
            w.setZoomFactor(zoom);
        });
    });
    globalShortcut.register('CommandOrControl+=', () => {
        allWebContents.map(w => {
            zoom += 0.1;
            w.setZoomFactor(zoom);
        });
    });
    globalShortcut.register('Shift+CommandOrControl+-', () => {
        allWebContents.map(w => {
            zoom -= 0.05;
            w.setZoomFactor(zoom);
        });
    });
    globalShortcut.register('Shift+CommandOrControl+=', () => {
        allWebContents.map(w => {
            zoom += 0.05;
            w.setZoomFactor(zoom);
        });
    });
}