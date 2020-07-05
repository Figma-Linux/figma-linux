import * as E from "electron";
import * as S from "electron-settings";
import { observable, action, toJS, autorun } from "mobx";

import * as Const from "Const";

export class Settings {
  @observable settings: SettingsInterface;

  constructor() {
    this.settings = S.getAll() as any;

    this.events();
  }

  @action
  public updateFigmaUiScale = (delta: number): void => {
    const d = +(delta / 100).toFixed(2);

    if (d) {
      this.settings.ui.scaleFigmaUI = d;
    } else {
      this.settings.ui.scaleFigmaUI = 1;
    }

    E.remote.app.emit("update-figma-ui-scale", d);
  };
  @action
  public updatePanelScale = (delta: number): void => {
    const d = +(delta / 100).toFixed(2);

    if (d) {
      this.settings.ui.scalePanel = d;
    } else {
      this.settings.ui.scalePanel = 1;
    }

    E.remote.app.emit("update-panel-scale", d);
  };

  @action
  public updateShowMainMenu = (show: boolean): void => {
    this.settings.app.showMainMenu = show;

    E.remote.app.emit("set-hide-main-menu", show);
  };
  @action
  public updateDisableMainMenu = (disabled: boolean): void => {
    this.settings.app.disabledMainMenu = disabled;

    E.remote.app.emit("set-disable-main-menu", disabled);
  };
  @action
  public saveLastOpenedTabs = (save: boolean): void => {
    this.settings.app.saveLastOpenedTabs = save;
  };
  @action
  public updateWindowFrame = (show: boolean): void => {
    this.settings.app.windowFrame = show;
  };
  @action
  public updateDisabledFonts = (disabled: boolean): void => {
    this.settings.app.disabledFonts = disabled;

    E.remote.app.emit("set-disable-fonts", disabled);
  };

  @action
  public selectExportDir = (): void => {
    const dirs = E.remote.dialog.showOpenDialogSync({ properties: ["openDirectory"] });

    this.settings.app.exportDir = dirs[0];
  };
  @action
  public inputExportDir = (dir: string): void => {
    this.settings.app.exportDir = dir;
  };

  @action
  public addDir = (): void => {
    const dirs = E.remote.dialog.showOpenDialogSync({ properties: ["openDirectory", "multiSelections"] });

    this.settings.app.fontDirs = [...this.settings.app.fontDirs, ...dirs];
  };
  @action
  public removeDir = (index: number): void => {
    if (this.settings.app.fontDirs.length <= 1) {
      return;
    }

    this.settings.app.fontDirs = this.settings.app.fontDirs.filter((e, i) => i !== index);
  };

  private events = (): void => {
    E.ipcRenderer.on(Const.UPDATEUISCALE, (sender: Event, scale: number) => {
      this.settings.ui.scaleFigmaUI = scale;
    });
    E.ipcRenderer.on(Const.UPDATEPANELSCALE, (sender: Event, scale: number) => {
      this.settings.ui.scalePanel = scale;
    });
    E.ipcRenderer.on(Const.UPDATEPANELHEIGHT, (sender: Event, height: number) => {
      this.settings.app.panelHeight = height;
    });
    E.ipcRenderer.on(Const.UPDATEMAINMENUVIS, (sender: Event, show: boolean) => {
      this.settings.app.showMainMenu = show;
    });
  };
}

export const settings = new Settings();

autorun(() => {
  S.setAll(toJS(settings.settings));
});
