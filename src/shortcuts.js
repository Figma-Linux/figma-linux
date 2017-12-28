const { globalShortcut } = require('electron');

module.exports = function(window) {
    let zoom = 0.7;

    globalShortcut.register('CommandOrControl+-', () => {
        zoom -= 0.1; 
        window.webContents.setZoomFactor(zoom);
    });
    globalShortcut.register('CommandOrControl+=', () => {
        zoom += 0.1; 
        window.webContents.setZoomFactor(zoom);
    });
    globalShortcut.register('Shift+CommandOrControl+-', () => {
        zoom -= 0.05; 
        window.webContents.setZoomFactor(zoom);
    });
    globalShortcut.register('Shift+CommandOrControl+=', () => {
        zoom += 0.05; 
        window.webContents.setZoomFactor(zoom);
    });
    globalShortcut.register('F5', () => {
        window.reload();
    });
}