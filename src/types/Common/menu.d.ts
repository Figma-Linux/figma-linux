declare namespace Menu {
  interface State {
    pluginMenuData?: Menu.MenuItem[];
    widgetMenuData?: Menu.MenuItem[];
    recentClosedTabsMenuData?: Types.SavedTab[];
    actionCheckedState?: { [key: string]: boolean };

    [key: string]: any;
  }

  interface MenuActionParameter {
    type: "plugin-parameter";
    name: string;
    key: string;
    valueType: string;
    description?: string;
    allowFreeform?: boolean;
    optional?: boolean;
  }
  interface MenuAction {
    type: string;
    pluginId?: string;
    actualTypeForBackwardsCompatibility?: string;
    parameterEntry?: {
      type: "parameter-entry";
      parameters: MenuActionParameter[];
      commandName: string;
    };
    parameterOnly?: false;
  }
  interface MenuPluginItemName {
    type: "plugin-name";
    plugin: string;
  }
  interface MenuKeyStringItemName {
    type: "string-key";
    key: string;
    string: string;
  }
  type MenuItemName = MenuPluginItemName | MenuKeyStringItemName | string;
  interface MenuItem {
    type: string;
    name: MenuItemName;
    submenu?: MenuItem[];
    menuAction: MenuAction;
    iconType?: string;
    disabled: boolean;
    property?: string;
    propertyValue?: boolean;
  }
  interface PluginMenuData {}
}
