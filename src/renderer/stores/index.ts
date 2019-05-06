import { tabs } from "./Tabs";
import route, { Routes } from "./Routes";
import { Settings, settings } from './Settings';


export interface IStores {
	tabs: ITabsStore;
	settings: Settings;
	route: Routes
}

const stores: IStores = {
	tabs,
	settings,
	route
};

export default stores;
