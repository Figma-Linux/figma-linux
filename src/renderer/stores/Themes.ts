import * as E from "electron";

import { DEFAULT_THEME, TEST_THEME_ID } from "Const";
import { observable, action, toJS } from "mobx";
import { storage } from "Storage";

export class Themes {
  @observable themes: Themes.Theme[] = [];
  @observable currentTheme: string;
  @observable creatorTheme: Themes.Theme;
  @observable previewerZoom: number;

  constructor() {
    this.currentTheme = storage.get().theme.currentTheme;
    this.creatorTheme = {
      ...DEFAULT_THEME,
      id: TEST_THEME_ID,
    };
    this.previewerZoom = 1;

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
  changeCreatorThemeName = (value: string): void => {
    this.creatorTheme.name = value;
  };
  @action
  changeCreatorThemeAuthorName = (value: string): void => {
    this.creatorTheme.author = value;
  };
  @action
  changeCreatorThemePalette = (key: string, value: string): void => {
    this.creatorTheme.palette[key] = value;
  };
  @action
  changeCreatorThemeZoom = (delta: number): void => {
    this.previewerZoom = +(delta / 100).toFixed(2);
  };

  saveCreatorTheme = () => {
    E.ipcRenderer.send("saveCreatorTheme", toJS(this.creatorTheme));
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
      if (theme.id === TEST_THEME_ID) {
        const testTheme = toJS(this.themes).find(t => t.id === theme.id);

        if (testTheme) {
          const themes = toJS(this.themes).filter(t => t.id !== theme.id);
          testTheme.palette = theme.palette;
          this.themes = [...themes, testTheme];
        }
      }

      this.setTheme(theme.id);
    });
    E.ipcRenderer.on("loadCreatorTheme", (sender, theme) => {
      this.creatorTheme = theme;
    });
  };
}

export const themes = new Themes();
