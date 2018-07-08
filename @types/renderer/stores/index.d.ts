interface ITabsStore {
	tabs: Array<Tab>;
	current: number;

	addTab(id: number, url: string): void; 
	setFocus(id: number): void;
	deleteTab(id: number): void;
}