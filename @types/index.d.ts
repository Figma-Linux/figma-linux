declare namespace Electron {
	interface MainInterface extends CommonInterface {
		app: App;
	}

	interface App extends EventEmitter {
		on(event: 'updateActionState', listener: (state: Object) => void): this;
		once(event: 'updateActionState', listener: (state: Object) => void): this;
		addListener(event: 'updateActionState', listener: (state: Object) => void): this;
		removeListener(event: 'updateActionState', listener: (state: Object) => void): this;

		on(event: 'handleCommand', listener: (command: string) => void): this;
		once(event: 'handleCommand', listener: (command: string) => void): this;
		addListener(event: 'handleCommand', listener: (command: string) => void): this;
		removeListener(event: 'handleCommand', listener: (command: string) => void): this;

		on(event: 'hiddeMenu', listener: (isHidden: boolean) => void): this;
		once(event: 'hiddeMenu', listener: (isHidden: boolean) => void): this;
		addListener(event: 'hiddeMenu', listener: (isHidden: boolean) => void): this;
		removeListener(event: 'hiddeMenu', listener: (isHidden: boolean) => void): this;
	}
}