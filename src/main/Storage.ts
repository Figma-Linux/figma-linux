import * as Settings from "electron-settings";
import * as _ from "lodash";

import * as Const from "Const";

export class Storage {
  private settings: SettingsInterface;

  constructor() {
    this.settings = Settings.getSync() as SettingsInterface;

    const mergedSettings = _.merge(Const.DEFAULT_SETTINGS, this.settings);

    this.settings = mergedSettings;
    Settings.setSync(mergedSettings);
  }

  public get = () => {
    return Settings.getSync() as SettingsInterface;
  };

  public set = (settings: SettingsInterface): void => {
    Settings.setSync(settings);
  };

  public getLogLevel = (): number => {
    return this.settings.app.logLevel;
  };
  public setOpenedTabs = (tabs: SavedTab[]): void => {
    if (tabs.length === 0) {
      return;
    }

    this.settings.app.lastOpenedTabs = tabs;

    this.set(this.settings);
  };
  public setFeatureFlags = (flags: FeatureFlags): void => {
    this.settings.app.featureFlags = _.merge(this.settings.app.featureFlags, flags);

    this.set(this.settings);
  };
  public setPanelHeight = (height: number): void => {
    this.settings.app.panelHeight = height;

    this.set(this.settings);
  };
  public saveExtension = (extensions: Extensions.ExtensionJson[]): void => {
    this.settings.app.savedExtensions = _.merge(this.settings.app.savedExtensions, extensions);

    this.set(this.settings);
  };
  public clearLastOpenedTabs = (): void => {
    this.settings.app.lastOpenedTabs = [];

    this.set(this.settings);
  };
}

export const storage = new Storage();
