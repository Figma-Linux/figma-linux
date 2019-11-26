declare namespace Electron {
	interface MainInterface extends CommonInterface {
		app: App;
	}

	interface MenuItem {
		click: (item: MenuItemConstructorOptions, window: BrowserWindow, event: Event) => void;
	}

	interface App extends NodeJS.EventEmitter {
		on(event: 'handle-command', listener: (command: string) => void): this;
		once(event: 'handle-command', listener: (command: string) => void): this;
		addListener(event: 'handle-command', listener: (command: string) => void): this;
		removeListener(event: 'handle-command', listener: (command: string) => void): this;
		emit(event: 'handle-command', command: string): boolean;

		on(event: 'handle-page-command', listener: (item: any, window: BrowserWindow) => void): this;
		once(event: 'handle-page-command', listener: (item: any, window: BrowserWindow) => void): this;
		addListener(event: 'handle-page-command', listener: (item: any, window: BrowserWindow) => void): this;
		removeListener(event: 'handle-page-command', listener: (item: any, window: BrowserWindow) => void): this;
		emit(event: 'handle-page-command', item: any, window: BrowserWindow): boolean;

		on(event: 'update-figma-ui-scale', listener: (scale: number) => void): this;
		once(event: 'update-figma-ui-scale', listener: (scale: number) => void): this;
		addListener(event: 'update-figma-ui-scale', listener: (scale: number) => void): this;
		removeListener(event: 'update-figma-ui-scale', listener: (scale: number) => void): this;
		emit(event: 'update-figma-ui-scale', scale: number): boolean;

		on(event: 'update-panel-scale', listener: (scale: number) => void): this;
		once(event: 'update-panel-scale', listener: (scale: number) => void): this;
		addListener(event: 'update-panel-scale', listener: (scale: number) => void): this;
		removeListener(event: 'update-panel-scale', listener: (scale: number) => void): this;
		emit(event: 'update-panel-scale', scale: number): boolean;

		on(event: 'set-hide-main-menu', listener: (hide: boolean) => void): this;
		once(event: 'set-hide-main-menu', listener: (hide: boolean) => void): this;
		addListener(event: 'set-hide-main-menu', listener: (hide: boolean) => void): this;
		removeListener(event: 'set-hide-main-menu', listener: (hide: boolean) => void): this;
		emit(event: 'set-hide-main-menu', hide: boolean): boolean;

		on(event: 'set-disable-main-menu', listener: (disabled: boolean) => void): this;
		once(event: 'set-disable-main-menu', listener: (disabled: boolean) => void): this;
		addListener(event: 'set-disable-main-menu', listener: (disabled: boolean) => void): this;
		removeListener(event: 'set-disable-main-menu', listener: (disabled: boolean) => void): this;
		emit(event: 'set-disable-main-menu', disabled: boolean): boolean;

		on(event: 'set-disable-fonts', listener: (disabled: boolean) => void): this;
		once(event: 'set-disable-fonts', listener: (disabled: boolean) => void): this;
		addListener(event: 'set-disable-fonts', listener: (disabled: boolean) => void): this;
		removeListener(event: 'set-disable-fonts', listener: (disabled: boolean) => void): this;
		emit(event: 'set-disable-fonts', disabled: boolean): boolean;

		on(event: 'os-menu-invalidated', listener: (dependencies: MenuState.MenuStateParams) => void): this;
		once(event: 'os-menu-invalidated', listener: (dependencies: MenuState.MenuStateParams) => void): this;
		addListener(event: 'os-menu-invalidated', listener: (dependencies: MenuState.MenuStateParams) => void): this;
		removeListener(event: 'os-menu-invalidated', listener: (dependencies: MenuState.MenuStateParams) => void): this;
		emit(event: 'os-menu-invalidated', dependencies: MenuState.MenuStateParams): boolean;

		on(event: 'log', listener: (data: any) => void): this;
		once(event: 'log', listener: (data: any) => void): this;
		addListener(event: 'log', listener: (data: any) => void): this;
		removeListener(event: 'log', listener: (data: any) => void): this;
		emit(event: 'log', data: any): boolean;

		on(event: 'sign-out', listener: () => void): this;
		once(event: 'sign-out', listener: () => void): this;
		addListener(event: 'sign-out', listener: () => void): this;
		removeListener(event: 'sign-out', listener: () => void): this;
		emit(event: 'sign-out'): boolean;
	}

	interface IpcMain extends NodeJS.EventEmitter {
		on(channel: string, listener: (event: IpcMainEvent, args: any) => void): this;
		once(channel: string, listener: (event: IpcMainEvent, args: any) => void): this;
		removeAllListeners(channel: string): this;
		removeListener(channel: string, listener: (event: IpcMainEvent, args: any) => void): this;

		on(channel: 'setTitle', listener: (event: IpcMainEvent, title: string) => void): this;
		once(channel: 'setTitle', listener: (event: IpcMainEvent, title: string) => void): this;
		removeAllListeners(channel: 'setTitle'): this;
		removeListener(channel: 'setTitle', listener: (event: IpcMainEvent, title: string) => void): this;

		on(channel: 'setPluginMenuData', listener: (event: IpcMainEvent, pluginMenu: Menu.MenuItem[]) => void): this;
		once(channel: 'setPluginMenuData', listener: (event: IpcMainEvent, pluginMenu: Menu.MenuItem[]) => void): this;
		removeAllListeners(channel: 'setPluginMenuData'): this;
		removeListener(channel: 'setPluginMenuData', listener: (event: IpcMainEvent, pluginMenu: Menu.MenuItem[]) => void): this;
	}

	interface RequestHeaders {
		[name: string]: string;
	}
}
