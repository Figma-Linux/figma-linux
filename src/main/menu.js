const { Menu, MenuItem } = require('electron');

const menu = new Menu();

module.exports = (window) => {

    menu.append(new MenuItem({
        label: 'Window',
        accelerator: 'F5',
        visible: false,
        click: () => {
            window.reload();
        }
    }));

    menu.append(new MenuItem({
        label: 'DevTools',
        accelerator: 'ctrl+alt+i',
        visible: false,
        click: () => {
            window.webContents.openDevTools();
        }
    }));

    Menu.setApplicationMenu(menu);
}
