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
			moves: false,
			showBackBtn: options.showBackBtn,
			order: this.tabs.length === 0 ? 1 : this.tabs.length + 1
		});
	}

	@action deleteTab = (id: number) => {
		this.tabs = this.tabs.filter(t => t.id !== id);
	}

	@action setFocus = (id: number) => {
		this.current = id;
	}

	@action updateTab = (tab: Tab) => {
		console.log('updateTab, tab: ', tab.order);
		this.tabs = this.tabs
			.map(t => t.id === tab.id ? { ...t, ...tab } : t)
			.sort((a, b) => a.order > b.order ? 1 : 0);

		console.log('tabs: ', toJS(this.tabs));
	}

	@action changeTagOrder = (tab: Tab) => {
		let tabs: Array<Tab> = toJS(this.tabs);

		tabs = tabs.map(t => t.id === tab.id ? { ...tab, order: tab.order } : t);
		tabs.sort((a, b) => a.order > b.order ? 1 : 0);

		this.tabs = tabs;
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

		E.ipcRenderer.on(Const.CLOSETAB, (sender: any, data: { id: number }) => {
			let index: number = this.tabs.findIndex(t => t.id === data.id);
			this.deleteTab(data.id);

			this.setFocus(
				index != 0 ?
					this.tabs[index > 0 ? index-1 : index].id : 1
			);
		});
	}
}

const tabs: Tabs = new Tabs();

export default tabs;
export {
	tabs
}