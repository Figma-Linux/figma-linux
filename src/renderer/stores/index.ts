import { tabs } from "./Tabs";
import route, { Routes } from "./Routes";
import { Settings, settings } from "./Settings";

export interface Stores {
  tabs: TabsStore;
  settings: Settings;
  route: Routes;
}

const stores: Stores = {
  tabs,
  settings,
  route,
};

export default stores;
