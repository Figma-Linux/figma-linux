const electron = require('electron');
const {
    shell,
    app,
    BrowserWindow
} = electron;

const HOMEPAGE = 'https://www.figma.com/'
const winOptions = {
    width: 1200,
    height: 900,
    webPreferences: {
        nodeIntegration: false,
        'web-security': false,
        webgl: true,
        experimentalFeatures: true,
        experimentalCanvasFeatures: true,
        zoomFactor: 0.7
    }
};

app.on('ready', () => {
    let window = new BrowserWindow(winOptions);

    window.setMenuBarVisibility(false);
    window.loadURL(HOMEPAGE);

    window.webContents.on('will-navigate', (ev, url) => {
        parts = url.split("/");
        if (parts[0] + "//" + parts[2] != HOMEPAGE) {
            ev.preventDefault()
            shell.openExternal(url)
        };
    })

    window.on('closed', () => {
        window = null;
    });
});

app.on('window-all-closed', () => {

    if(process.platform !== 'darwin') {
        app.quit();
    }
});