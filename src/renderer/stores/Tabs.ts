/// <reference path="../../../@types/common/index.d.ts" />
/// <reference path="../../../@types/renderer/stores/index.d.ts" />

import * as E from "electron";
import { observable, action, toJS } from "mobx";

import * as Const from "Const";

class Tabs implements ITabsStore {
	@observable tabs: Array<Tab> = [];
	@observable current: number = 1;

	constructor() {
		this.events();
	}

	@action addTab = (options: {id: number, url: string, showBackBtn: boolean}) => {
		this.tabs.push({
			id: options.id,
			title: 'Figma',
			url: options.url,
			showBackBtn: options.showBackBtn
		});
	}

	@action deleteTab = (id: number) => {
		this.tabs = this.tabs.filter(t => t.id != id);
	}

	@action setFocus = (id: number) => {
		this.current = id;
	}

	getTab = (id: number): Tab | undefined => {
		return this.tabs.length !== 0 ? this.tabs.find(tab => tab.id === id) : undefined;
	}; 

	private events = () => {
		E.ipcRenderer.on(Const.TABADDED, (sender: any, data: Tab) => {
			this.addTab({id: data.id, url: data.url, showBackBtn: data.showBackBtn});
			this.setFocus(data.id);
		});

		E.ipcRenderer.on(Const.CLOSEALLTAB, () => {
			this.current = 1;
			this.tabs = [];
		});

		E.ipcRenderer.on(Const.SETTITLE, (sender: any, data: { id: number, title: string }) => {
			this.tabs = this.tabs.map(t => t.id === data.id ? { ...t, title: data.title } : t);
		});

		E.ipcRenderer.on(Const.UPDATEFILEKEY, (sender: any, data: { id: number, fileKey: string }) => {
			this.tabs = this.tabs.map(t => t.id === data.id ? { ...t, fileKey: data.fileKey } : t);
		});
	}
}

const tabs: Tabs = new Tabs();

export default tabs;
export {
	tabs
}