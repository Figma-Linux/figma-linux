import * as E from 'electron';

import { toggleDetachedDevTools, handleCommandItemClick, handleItemAction } from "Utils";
import WindowManager from "./WindowManager";

export let isHidden: boolean = false;

const commandToMainProcess = (item: E.MenuItem & { id: string }, window: E.BrowserWindow) => {
    E.app.emit('handleCommand', item.id);
};

const item = (label: string, accelerator: string, params: any) => ({
    label,
    accelerator,
    ...params
});

const SEPARATOR = { type: 'separator' };
const FILE_MENU = {
    label: 'File',
    submenu: [
        item('New File', 'Ctrl+N', { id: 'newFile', click: commandToMainProcess }),
        item('Open File Browser', 'Ctrl+O', { id: 'openFileBrowser', click: commandToMainProcess }),
        item('Reopen Closed Tab', 'Ctrl+Shift+T', { id: 'reopenClosedTab', click: commandToMainProcess }),
        SEPARATOR,
        {
            label: 'Close Window',
            accelerator: 'Ctrl+Shift+W',
            click(item: E.MenuItem, window: E.BrowserWindow) {
                if (window) {
                    window.close();
                }
            },
        },
        item('Close Tab', 'Ctrl+W', { id: 'closeTab', click: commandToMainProcess }),
        SEPARATOR,
        item('Save As .fig...', 'Ctrl+Shift+S', { action: 'save-as', click: handleItemAction }),
        item('Export...', 'Ctrl+Shift+E', { action: 'export-selected-exportables', click: handleItemAction }),
        SEPARATOR,
        item('Settings', '', { id: 'openSettings', click: commandToMainProcess }),
        { role: 'quit' },
    ]
} as E.MenuItemConstructorOptions;
const EDIT_MENU = {
    label: 'Edit',
    submenu: [
        item('Undo', 'Ctrl+Z', { command: 'undo', click: handleCommandItemClick }),
        item('Redo', 'Control+Y', { command: 'redo', click: handleCommandItemClick }),
        SEPARATOR,
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        item('Paste Over Selection', 'Shift+Ctrl+V', { action: 'paste-over-selection', click: handleItemAction }),
        SEPARATOR,
        item('Pick Color', 'I', { action: 'toggle-dropper', click: handleItemAction }),
        SEPARATOR,
        item('Set Default Style', 'Alt+Ctrl+X', { action: 'set-default-style', click: handleItemAction }),
        item('Copy Properties', 'Alt+Ctrl+C', { action: 'copy-properties', click: handleItemAction }),
        item('Paste Properties', 'Alt+Ctrl+V', { action: 'paste-properties', click: handleItemAction }),
        SEPARATOR,
        item('Select All', 'Ctrl+A', { command: 'selectAll', click: handleCommandItemClick }),
        item('Select None', '', { action: 'deselect-all', click: handleItemAction }),
        item('Select Inverse', 'Shift+Ctrl+A', { action: 'select-inverse', click: handleItemAction }),
        SEPARATOR,
        item('Select All with Same Style', null, { action: 'select-same-style', click: handleItemAction }),
        item('Select All with Same Fill', null, { action: 'select-same-fill', click: handleItemAction }),
        item('Select All with Same Stroke', null, { action: 'select-same-stroke', click: handleItemAction }),
        item('Select All with Same Effect', null, { action: 'select-same-effect', click: handleItemAction }),
        item('Select All with Same Text', null, { action: 'select-same-text', click: handleItemAction }),
        item('Select All with Same Font', null, { action: 'select-same-font', click: handleItemAction }),
        item('Select All with Same Instance', null, { action: 'select-same-instance', click: handleItemAction }),
    ],
} as E.MenuItemConstructorOptions;
const VIEW_MENU = {
    label: 'View',
    submenu: [
        item('Show Pixel Grid', 'Ctrl+\'', { action: 'toggle-grid', click: handleItemAction }),
        item('Show Layout Grids', 'Ctrl+Shift+4', { action: 'toggle-shown-layout-grids', click: handleItemAction }),
        item('Show Mask Outlines', null, { action: 'toggle-show-masks', click: handleItemAction }),
        item('Frame Outlines', null, { action: 'toggle-show-artboard-outlines', click: handleItemAction }),
        item('Show Rulers', 'Shift+R', { action: 'toggle-rulers', click: handleItemAction }),
        item('Show Layers Panel', 'Ctrl+Shift+\\', { action: 'toggle-sidebar', click: handleItemAction }),
        item('Show UI', 'Ctrl+\\', { action: 'toggle-ui', click: handleItemAction }),
        item('Show Outlines', 'Ctrl+Shift+3', { action: 'toggle-outlines', click: handleItemAction }),
        SEPARATOR,
        item('Switch to Layers', 'Alt+1', { action: 'toggle-layers', click: handleItemAction }),
        item('Switch to Components', 'Alt+2', { action: 'toggle-publish', click: handleItemAction }),
        item('Switch to Team Library', 'Alt+3', { action: 'toggle-library', click: handleItemAction }),
        SEPARATOR,
        item('Pixel Preview', 'Control+Alt+Y', { action: 'toggle-pixel-preview', click: handleItemAction }),
        item('Show Transparency Checkerboard', 'Alt+Shift+\'', { action: 'toggle-checkerboard', click: handleItemAction }),
        SEPARATOR,
        item('Zoom In', '=', { action: 'zoom-in', click: handleItemAction }),
        item('Zoom Out', '-', { action: 'zoom-out', click: handleItemAction }),
        item('Zoom to 100%', 'Shift+0', { action: 'zoom-reset', click: handleItemAction }),
        item('Zoom to Fit', 'Shift+1', { action: 'zoom-to-fit', click: handleItemAction }),
        item('Zoom to Selection', 'Shift+2', { action: 'zoom-to-selection', click: handleItemAction }),
        SEPARATOR,
        item('Scale UI Normal', 'Ctrl+Shift+Backspace', { id: 'scale-normal', click: commandToMainProcess }),
        item('Scale UI + 10%', 'Ctrl+=', { id: 'scale-inc0.1', click: commandToMainProcess }),
        item('Scale UI - 10%', 'Ctrl+-', { id: 'scale-dic0.1', click: commandToMainProcess }),
        item('Scale UI + 5%', 'Ctrl+Shift+=', { id: 'scale-inc0.05', click: commandToMainProcess }),
        item('Scale UI - 5%', 'Ctrl+Shift+-', { id: 'scale-dic0.05', click: commandToMainProcess }),
        SEPARATOR,
        item('Find Next Frame', 'N', { action: 'next-artboard', click: handleItemAction }),
        item('Find Previous Frame', 'Shift+N', { action: 'previous-artboard', click: handleItemAction }),
        SEPARATOR,
        { role: 'togglefullscreen' },
    ],
} as E.MenuItemConstructorOptions;
const OBJECT_MENU = {
    label: 'Object',
    submenu: [
        item('Group Selection', 'Ctrl+G', { action: 'group-selection', click: handleItemAction }),
        item('Ungroup Selection', 'Shift+Ctrl+G', { action: 'ungroup-selection', click: handleItemAction }),
        item('Frame Selection', 'Ctrl+Alt+G', { action: 'frame-selection', click: handleItemAction }),
        item('Use as Mask', 'Alt+Ctrl+M', { action: 'mask-selection', click: handleItemAction }),
        SEPARATOR,
        item('Create Component', 'Ctrl+Alt+K', { action: 'create-symbol', click: handleItemAction }),
        item('Go to Master Component', null, { action: 'find-symbol', click: handleItemAction }),
        item('Reset Instance', null, { action: 'reset-symbol', click: handleItemAction }),
        item('Detach Instance', 'Ctrl+Alt+B', { action: 'detach-instance', click: handleItemAction }),
        item('Resize to Fit', null, { action: 'resize-to-fit', click: handleItemAction }),
        item('Toggle Clipping', null, { action: 'toggle-frame-clipping', click: handleItemAction }),
        SEPARATOR,
        item('Bring to Front', 'Ctrl+Shift+]', { action: 'bring-to-front', click: handleItemAction }),
        item('Bring Forward', 'Ctrl+]', { action: 'bring-forward', click: handleItemAction }),
        item('Send Backward', 'Ctrl+[', { action: 'send-backward', click: handleItemAction }),
        item('Send to Back', 'Ctrl+Shift+[', { action: 'send-to-back', click: handleItemAction }),
        SEPARATOR,
        item('Flip Horizontal', '', { action: 'flip-horizontal', click: handleItemAction }),
        item('Flip Vertical', '', { action: 'flip-vertical', click: handleItemAction }),
        // item('Flip Horizontal', 'Shift+H', { action: 'flip-horizontal', click: handleItemAction }),
        // item('Flip Vertical', 'Shift+V', { action: 'flip-vertical', click: handleItemAction }),
        SEPARATOR,
        item('Rotate 180˚', null, { action: 'rotate-180', click: handleItemAction }),
        item('Rotate 90˚ Left', null, { action: 'rotate-90-counterclockwise', click: handleItemAction }),
        item('Rotate 90˚ Right', null, { action: 'rotate-90-clockwise', click: handleItemAction }),
        SEPARATOR,
        item('Flatten Selection', 'Ctrl+E', { action: 'flatten-selection', click: handleItemAction }),
        item('Outline Stroke', 'Shift+Ctrl+O', { action: 'outline-stroke', click: handleItemAction }),
        {
            label: 'Boolean Groups',
            submenu: [
                item('Union Selection', null, { action: 'live-boolean-union', click: handleItemAction }),
                item('Subtract Selection', null, { action: 'live-boolean-subtract', click: handleItemAction }),
                item('Intersect Selection', null, { action: 'live-boolean-intersect', click: handleItemAction }),
                item('Exclude Selection', null, { action: 'live-boolean-xor', click: handleItemAction }),
            ],
        },
        SEPARATOR,
        item('Duplicate Selection in Place', 'Ctrl+D', { action: 'duplicate-in-place', click: handleItemAction }),
        item('Delete Selection', 'Backspace', { action: 'delete-selection', click: handleItemAction }),
        item('Rasterize Selection', null, { action: 'convert-to-raster', click: handleItemAction }),
        SEPARATOR,
        item('Show/Hide Selection', 'Shift+Ctrl+H', { action: 'toggle-shown-for-selected-nodes', click: handleItemAction }),
        item('Lock/Unlock Selection', 'Shift+Ctrl+L', { action: 'toggle-locked-for-selected-nodes', click: handleItemAction }),
        item('Hide Other Layers', null, { action: 'hide-sibling-layers', click: handleItemAction }),
        item('Collapse Layers', 'Alt+L', { action: 'collapse-layers', click: handleItemAction }),
        SEPARATOR,
        item('Remove Fill', 'Alt+/', { action: 'remove-fill', click: handleItemAction }),
        item('Remove Stroke', '/', { action: 'remove-stroke', click: handleItemAction }),
        item('Swap Fill and Stroke', '', { action: 'swap-fill-and-stroke', click: handleItemAction }),
        // item('Swap Fill and Stroke', 'Shift+X', { action: 'swap-fill-and-stroke', click: handleItemAction }),
    ],
} as E.MenuItemConstructorOptions;
const VECTOR_MENU = {
    label: 'Vector',
    submenu: [
        item('Join Selection', 'Ctrl+J', { action: 'join-selection', click: handleItemAction }),
        item('Smooth Join Selection', null, { action: 'smooth-join-selection', click: handleItemAction }),
        item('Delete and Heal Selection', 'Shift+Backspace', { action: 'delete-and-heal-selection', click: handleItemAction }),
    ],
};
const TEXT_MENU = {
    label: 'Text',
    submenu: [
        item('Toggle Bold', 'Ctrl+B', { action: 'text-toggle-bold', click: handleItemAction }),
        item('Toggle Italic', 'Ctrl+I', { action: 'text-toggle-italic', click: handleItemAction }),
        item('Toggle Underline', 'Ctrl+U', { action: 'text-toggle-underline', click: handleItemAction }),
        item('Toggle Strikethrough', null, { action: 'text-toggle-strikethrough', click: handleItemAction }),
        SEPARATOR,
        item('Text Original Case', null, { action: 'text-original-case', click: handleItemAction }),
        item('Text Upper Case', null, { action: 'text-upper-case', click: handleItemAction }),
        item('Text Lower Case', null, { action: 'text-lower-case', click: handleItemAction }),
    ],
} as E.MenuItemConstructorOptions;
const ARRANGE_MENU = {
    label: 'Arrange',
    submenu: [
        item('Round to Pixels', null, { action: 'round-to-pixels', click: handleItemAction }),
        SEPARATOR,
        item('Align Left', null, { action: 'align-left', click: handleItemAction }),
        item('Align Horizontal Centers', null, { action: 'align-horizontal-center', click: handleItemAction }),
        item('Align Right', null, { action: 'align-right', click: handleItemAction }),
        item('Align Top', null, { action: 'align-top', click: handleItemAction }),
        item('Align Vertical Centers', null, { action: 'align-vertical-center', click: handleItemAction }),
        item('Align Bottom', null, { action: 'align-bottom', click: handleItemAction }),
        SEPARATOR,
        item('Pack Horizontal', null, { action: 'pack-horizontal', click: handleItemAction }),
        item('Pack Vertical', null, { action: 'pack-vertical', click: handleItemAction }),
        SEPARATOR,
        item('Distribute Horizontal Spacing', 'Ctrl+Alt+Control+H', { action: 'distribute-horizontal-spacing', click: handleItemAction }),
        item('Distribute Vertical Spacing', 'Ctrl+Alt+Control+V', { action: 'distribute-vertical-spacing', click: handleItemAction }),
        SEPARATOR,
        item('Distribute Left', null, { action: 'distribute-left', click: handleItemAction }),
        item('Distribute Horizontal Centers', null, { action: 'distribute-horizontal-center', click: handleItemAction }),
        item('Distribute Right', null, { action: 'distribute-right', click: handleItemAction }),
        item('Distribute Top', null, { action: 'distribute-top', click: handleItemAction }),
        item('Distribute Vertical Centers', null, { action: 'distribute-vertical-center', click: handleItemAction }),
        item('Distribute Bottom', null, { action: 'distribute-bottom', click: handleItemAction }),
    ],
} as E.MenuItemConstructorOptions;
const HELP_MENU = {
    role: 'help',
    submenu: [
        {
            label: 'Help Page',
            click() {
                E.shell.openExternal('https://help.figma.com');
            },
        },
        {
            label: 'Community Forum',
            click() {
                E.shell.openExternal('https://spectrum.chat/figma');
            }
        },
        {
            label: 'Video Tutorials',
            click() {
                E.shell.openExternal('https://www.youtube.com/playlist?list=PLXDU_eVOJTx4HJKh8tQkQRtIe5YlP5smB');
            }
        },
        {
            label: 'Release Notes',
            click() {
                E.shell.openExternal('http://releases.figma.com');
            },
        },
        {
            label: 'Legal Summary',
            click() {
                E.shell.openExternal('https://www.figma.com/summary-of-policy');
            },
        },
        SEPARATOR,
        {
            label: 'Sign Out',
            click() {
                const windowManager = WindowManager.instance;

                windowManager.logoutAndRestart();
            },
        },
        SEPARATOR,
        {
            label: 'Toggle Developer Tools',
            accelerator: 'Ctrl+Alt+I',
            click() {
                const windowManager = WindowManager.instance;
                const webContents = windowManager.mainWindow.getBrowserView().webContents;

                if (webContents) {
                    toggleDetachedDevTools(webContents)
                }
            },
        },
        {
            label: 'Toggle Window Developer Tools',
            accelerator: 'Shift+Ctrl+Alt+I',
            click(item, win) {
                if (win) {
                    toggleDetachedDevTools(win.webContents);
                }
            }
        }
    ]
} as E.MenuItemConstructorOptions;


const getMenuTemlate = () => [FILE_MENU, EDIT_MENU, VIEW_MENU, OBJECT_MENU, VECTOR_MENU, TEXT_MENU, ARRANGE_MENU, HELP_MENU];

const buildActionToMenuItemMap = (menu: E.Menu) => {
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
}

const setMenuFromTemplate = (template?: Array<E.MenuItemConstructorOptions>): E.Menu => {
    let mainMenu: E.Menu;

    if (template) {
        mainMenu = E.Menu.buildFromTemplate(template as E.MenuItemConstructorOptions[]);
    } else {
        mainMenu = E.Menu.buildFromTemplate(getMenuTemlate() as E.MenuItemConstructorOptions[]);
    }

    E.Menu.setApplicationMenu(mainMenu);

    return mainMenu;
}

const init = (template?: Array<E.MenuItemConstructorOptions>) => {
    const mainMenu: E.Menu = setMenuFromTemplate(template);
    const menuItemMap = buildActionToMenuItemMap(mainMenu);

    E.app.on('updateActionState', (actionState: any) => {
        if (!actionState) return;

        for (let action of Object.keys(menuItemMap)) {
            const menuItem: E.MenuItem = menuItemMap[action];
            menuItem.enabled = actionState ? !!actionState[action] : false;
        }
    });
};

export default init;
