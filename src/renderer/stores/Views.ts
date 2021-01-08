import * as E from "electron";
import { observable, action } from "mobx";

export class Views {
  @observable view: View = "TopPanel";
  @observable settingsView: SettingsView = "General";

  constructor() {
    this.events();
  }

  @action
  setView = (view: View): void => {
    this.view = view;
  };
  @action
  setSettingsView = (view: SettingsView): void => {
    this.settingsView = view;
  };

  private events = (): void => {
    E.ipcRenderer.on("renderView", (sender, view) => {
      this.setView(view);
    });
  };
}

export const views = new Views();
