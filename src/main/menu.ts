import { Menu, MenuItem, BrowserWindow } from 'electron';

const menu = new Menu();

export default (window: BrowserWindow) => {

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
    window.setMenuBarVisibility(false);
}
