/// <reference path="../../../@types/common/index.d.ts" />
/// <reference path="../../../@types/renderer/stores/index.d.ts" />
import * as E from "electron";
import { observable, action } from "mobx";

class Tabs implements ITabsStore {
	@observable tabs: Array<Tab> = [];
	@observable current: number = 1;

	constructor() {
		this.events();
	}

	@action addTab = (id: number, url: string) => {
		this.tabs.push({
			id,
			name: 'Figma',
			url
		});
	}

	@action deleteTab = (id: number) => {
		this.tabs = this.tabs.filter(t => t.id != id);
	}

	@action setFocus = (id: number) => {
		this.current = id;
	}

	private events = () => {
		E.ipcRenderer.on('tabadded', (sender: any, data: Tab) => {
			this.addTab(data.id, data.url);
			this.setFocus(data.id);
		});

		E.ipcRenderer.on('closealltab', () => {
			this.current = 1;
			this.tabs = [];
		});
	}
}

const tabs: Tabs = new Tabs();

export default tabs;
export {
	tabs
}