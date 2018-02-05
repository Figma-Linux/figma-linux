const { Menu, MenuItem } = require('electron');

const menu = new Menu();

module.exports = (window) => {
    menu.append(new MenuItem({
        label: 'Window',
        accelerator: 'F5',
        click: () => {
            window.reload();
        }
    }));

    Menu.setApplicationMenu(menu);
}
