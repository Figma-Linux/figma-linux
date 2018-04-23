const {
    shell,
    app,
    net,
    session,
    BrowserWindow,
} = require('electron');
const url = require('url');

const shorcuts = require('./shortcuts');
const menu = require('./menu');

const HOME = 'https://www.figma.com'
const winOptions = {
    width: 1200,
    height: 900,
    frame: false,
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
    window.loadURL(HOME);

    window.webContents.on('will-navigate', (event, url) => {
        parts = url.split("/");
        if (parts[0] + "//" + parts[2] != HOME) {
            event.preventDefault()
            shell.openExternal(url)
        };
    });

    shorcuts(window);
    menu(window);


    window.webContents.on('will-navigate', (event, newUrl) => {
        const currentUrl = event.sender.getURL();

        if (newUrl === currentUrl) {
            window.reload();

            event.preventDefault();
            return;
        }

        const from = url.parse(currentUrl);
        const to = url.parse(newUrl);

        if (from.pathname === '/login') {
            window.reload();
            return;
        }

        if (to.pathname === '/logout') {
            net.request(`${HOME}/logout`).on('response', response => {
                response.on('data', chunk => {});
                response.on('error', err => {
                    console.log('Request error: ', err);
                });
                response.on('end', () => {
                    console.log('response.statusCode: ', response.statusCode);
                    if (response.statusCode >= 200 && response.statusCode <= 299) {

                        session.defaultSession.cookies.flushStore(() => {
                            const reload = () => app.relaunch({
                                args: process.argv.slice(1).concat(['--reset'])
                            });

                            app.on('will-quit', reload);
                            app.quit();
                        });
                    }
                });
            }).end();;

            event.preventDefault();
            return;
        }
    });

    // window.webContents.on('did-navigate', (event) => {
    //     console.log('did-navigate event args:', event.sender.getURL());
    // });

    window.webContents.on('new-window', (...args) => {
        console.log('new-window event args:', args);
    });

    window.on('closed', () => {
        window = null;
    });
});

app.on('window-all-closed', () => {

    if(process.platform !== 'darwin') {
        app.quit();
    }
});