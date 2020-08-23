import * as E from "electron";

import { observable, action } from "mobx";

export class Themes {
  @observable themes: Themes.Theme[] = [];
  @observable currentTheme: string;

  constructor() {
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

  private events = (): void => {
    E.ipcRenderer.on("getUploadedThemes", (sender, themes) => {
      this.themes = themes;
    });
  };
}

export const themes = new Themes();
