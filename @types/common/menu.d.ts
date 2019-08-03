declare namespace Menu {
    /**
     * Import Electron types
     */
    type _MenuItemConstructorOptions = import('electron').MenuItemConstructorOptions;
    type _MenuItem = import('electron').MenuItem;
    type _BrowserWindow = import('electron').BrowserWindow;

    type NativeClick = (item: _MenuItem, window: _BrowserWindow, event: Event) => void;
    type CutsomClick = (item: _MenuItemConstructorOptions, window: _BrowserWindow, event: Event) => void;

    interface ParamsId {
        id: string;
        click?: NativeClick | CutsomClick
    }
    interface ParamsAction {
        action: string;
        click?: NativeClick | CutsomClick
    }
    interface ParamsCommand {
        command: string;
        click?: NativeClick | CutsomClick
    }

    /**
     * Public types
     */
    type Params = ParamsId | ParamsAction | ParamsCommand;
}