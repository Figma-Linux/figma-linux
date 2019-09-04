import * as E from 'electron';

import { getMenuTemlate } from 'Utils/Main';
import { stringOfActionMenuItemName, assertNever } from 'Utils/Common';
import MenuState from 'Main/MenuState';

export const handlePluginMenuAction = (item: Menu.PluginMenuItem, window: E.BrowserWindow) => {
    const currentView = window.getBrowserView();

    if (item && item.pluginMenuAction && currentView) {
        currentView.webContents.send('handlePluginMenuAction', item.pluginMenuAction);
    }
};

export const electronOfPluginMenuItem = (input: Menu.MenuItem): Menu.PluginMenuItem | undefined => {
    switch (input.type) {
        case 'run-menu-action': {
            let label = stringOfActionMenuItemName(input.name);
            return {
                type: 'normal',
                label,
                click: handlePluginMenuAction,
                enabled: !input.disabled,
                pluginMenuAction: input.menuAction,
            };
        }
        case 'separator': {
            return {
                type: 'separator',
            };
        }
        case 'submenu': {
            return {
                type: 'submenu',
                label: input.name,
                submenu: input.submenu.map(electronOfPluginMenuItem),
            };
        }
        default: {
            // throw exception
            assertNever(input);
        }
    }

    return undefined;
};

export const resetMenu = (pluginMenuData: Menu.MenuItem[], template?: E.MenuItemConstructorOptions[]) => {
    const mainMenu: E.Menu = setMenuFromTemplate(pluginMenuData, template);
    const menuItemMap = buildActionToMenuItemMap(mainMenu);

    for (let action of Object.keys(menuItemMap)) {
        const menuItem: E.MenuItem = menuItemMap[action];
        menuItem.enabled = MenuState.actionState ? !!MenuState.actionState[action] : false;
    }
}
export const buildActionToMenuItemMap = (menu: E.Menu) => {
    const map: any = {};
    const parseMenu = (menu: any) => {
        for (let item of menu.items) {
            if (item.action) {
                map[item.action] = item;
            }
            if (item.submenu) {
                parseMenu(item.submenu);
            }
        }
    };

    parseMenu(menu);
    return map;
};
export const setMenuFromTemplate = (pluginMenuData: Menu.MenuItem[], template?: E.MenuItemConstructorOptions[]): E.Menu => {
    let mainMenu: E.Menu;

    const pluginMenuItems = pluginMenuData.length === 0
        ? undefined
        : pluginMenuData.map(electronOfPluginMenuItem);

    if (template) {
        mainMenu = E.Menu.buildFromTemplate(template as E.MenuItemConstructorOptions[]);
    } else {
        mainMenu = E.Menu.buildFromTemplate(getMenuTemlate(pluginMenuItems) as E.MenuItemConstructorOptions[]);
    }

    E.Menu.setApplicationMenu(mainMenu);

    return mainMenu;
};

export const item = (label: string, accelerator: string, params: Menu.Params) => {
    const props: E.MenuItemConstructorOptions = {
        label,
        enabled: true,
        ...params
    };

    if (accelerator) {
        props.accelerator = accelerator;
    }

    return new E.MenuItem(props);
};

export const commandToMainProcess = (item: E.MenuItemConstructorOptions) => {
    E.app.emit('handle-command', item.id);
};

export const handleCommandItemClick = (item: any, window: E.BrowserWindow) => {
    const currentView = window.getBrowserView();

    currentView.webContents.send('handlePageCommand', item.command);
};

export const handleItemAction = (item: any, window: E.BrowserWindow) => {
    // FIXME: ugly hack
    if ((!item.accelerator && item.accelerator) && !/ctrl|alt|shift|meta/i.test(item.accelerator)) return;

    const currentView = window.getBrowserView();

    currentView.webContents.send('handleAction', item.action, 'os-menu');
};
