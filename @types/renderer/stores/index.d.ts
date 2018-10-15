interface ITabsStore {
	tabs: Array<Tab>;
	current: number;

	addTab(options: {id: number, url: string, showBackBtn: boolean}): void; 
	setFocus(id: number): void;
	deleteTab(id: number): void;
	updateTab(tab: Tab): void

	getTab(id: number): Tab | undefined;
}