import { tabs } from "./Tabs";
import { Views, views } from "./Views";
import { Settings, settings } from "./Settings";

export interface Stores {
  tabs: TabsStore;
  settings: Settings;
  views: Views;
}

const stores: Stores = {
  tabs,
  settings,
  views,
};

export default stores;
