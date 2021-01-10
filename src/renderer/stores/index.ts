import { tabs } from "./Tabs";
import { Views, views } from "./Views";
import { Settings, settings } from "./Settings";
import { Themes, themes } from "./Themes";

export interface Stores {
  tabs: TabsStore;
  settings: Settings;
  themes: Themes;
  views: Views;
}

const stores: Stores = {
  tabs,
  settings,
  themes,
  views,
};

export default stores;
