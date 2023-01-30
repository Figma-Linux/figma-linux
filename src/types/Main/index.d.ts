declare namespace MenuState {
  interface State {
    [name: string]: boolean;
  }

  interface MenuStateParams {
    actionState?: State;
    pluginMenuData?: Menu.MenuItem[];
  }
}
