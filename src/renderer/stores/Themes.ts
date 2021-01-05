import * as E from "electron";

import { DEFAULT_THEME } from "Const";
import { observable, action, toJS } from "mobx";
import { storage } from "Storage";

export class Themes {
  @observable themes: Themes.Theme[] = [];
  @observable currentTheme: string;

  constructor() {
    this.currentTheme = storage.get().theme.currentTheme;

    this.events();
  }

  @action
  setTheme = (theme: string): void => {
    this.currentTheme = theme;
  };

  @action
  uploadGitTheme = (theme: string): void => {
    this.currentTheme = theme;
  };

  @action
  changeTheme = (id: string): void => {
    this.currentTheme = id;

    if (id === "0") {
      E.ipcRenderer.send("set-default-theme");
    } else {
      const theme = toJS(this.getThemeById(id));
      E.ipcRenderer.send("themes-change", theme);
    }
  };

  @action
  uploadFileTheme = (theme: string): void => {
    const filePath = E.remote.dialog.showOpenDialogSync({
      properties: ["openFile", "showHiddenFiles"],
      buttonLabel: "Save",
    });

    console.log("uploadFileTheme, filePath: ", filePath);

    if (!filePath || filePath.length !== 1) {
      return;
    }

    this.currentTheme = theme;
  };

  getThemeById = (id: string): Themes.Theme | undefined => {
    const theme = this.themes.find(theme => {
      return theme.id === id;
    });

    if (!theme) {
      return DEFAULT_THEME;
    }

    return theme;
  };
  private events = (): void => {
    E.ipcRenderer.on("getUploadedThemes", (sender, themes) => {
      this.themes = themes;
    });
    E.ipcRenderer.on("themes-change", (sender, theme) => {
      this.setTheme(theme.id);
    });
  };
}

export const themes = new Themes();
