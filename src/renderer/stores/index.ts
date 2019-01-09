import tabs from "./Tabs";
import route, { Routes } from "./Routes";


export interface IStores {
	tabs: ITabsStore;
	route: Routes
}

const stores: IStores = {
	tabs,
	route
};

export default stores;
