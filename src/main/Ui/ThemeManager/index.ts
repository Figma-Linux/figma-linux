import { app, ipcMain, IpcMainEvent } from "electron";
import * as Azip from "adm-zip";
import * as fs from "fs";
import * as path from "path";
import { dialogs } from "Main/Dialogs";
import { storage } from "Main/Storage";
import { logger } from "Main/Logger";

import { DEFAULT_THEME, TEST_THEME_ID, DOWNLOAD_ZIP_URI, DOWNLOAD_ZIP_PATH } from "Const";
import { keysToCamelCase, keysToKebabCase } from "Utils/Common";
import { mkPath, access, downloadFile } from "Utils/Main";
import ThemeValidator from "./ThemeValidator";

export default class ThemeManager {
  private themes: Map<string, Themes.Theme> = new Map();
  private creatorTheme: Themes.Theme;
  private themesDirectory: string;
  private creatorThemeDirectory: string;
  private creatorThemeFileName: string;

  constructor(private validator: ThemeValidator) {
    this.themesDirectory = path.resolve(app.getPath("userData"), "Themes");
    this.creatorThemeDirectory = path.resolve(app.getPath("userData"), "ThemeCreator");
    this.creatorThemeFileName = "theme.json";
    this.creatorTheme = {
      ...DEFAULT_THEME,
      id: TEST_THEME_ID,
    };

    this.registerEvents();
  }

  public async loadThemes() {
    if (!(await access(this.themesDirectory))) {
      await mkPath(this.themesDirectory);
      await this.updateThemesFromRepository();
    } else {
      await this.loadFromDirectory();
    }

    app.emit("syncThemesEnd", [...this.themes.values()]);

    const currentThemeId = storage.settings.theme.currentTheme;
    const disableThemes = storage.settings.app.disableThemes;

    if (disableThemes) return;

    app.emit("loadCurrentTheme", this.themes.get(currentThemeId));
  }

  public async loadFromDirectory() {
    const files = await fs.promises.readdir(this.themesDirectory);

    for (const fileName of files) {
      const fullFilePath = path.resolve(this.themesDirectory, fileName);
      const themeFile = await this.readThemeFile(fullFilePath);

      if (this.validator.isValidThemeFile(fullFilePath, themeFile)) {
        const theme = this.translatePaletteToKebabCase(themeFile);

        if (!theme.id) {
          theme.id = path.parse(fileName).name;

          await this.writeThemeFile(fullFilePath, theme);
        }

        this.themes.set(theme.id, theme);
      }
    }
  }

  public async loadCreatorTheme() {
    await mkPath(this.creatorThemeDirectory);

    const filePath = path.resolve(this.creatorThemeDirectory, this.creatorThemeFileName);

    if (!(await access(filePath))) {
      return;
    }

    const themeFile = await fs.promises.readFile(filePath);
    const rawTheme = JSON.parse(themeFile.toString()) as Themes.Theme;
    const theme = this.translatePaletteToCamelCase(rawTheme);

    if (!this.validator.isValidThemePalette(theme, filePath)) {
      return;
    }

    this.creatorTheme = {
      ...this.translatePaletteToKebabCase(theme),
      id: TEST_THEME_ID,
    };

    app.emit("loadCreatorTheme", this.creatorTheme);
  }

  public async saveCreatorTheme(theme: Themes.Theme): Promise<void> {
    await mkPath(this.creatorThemeDirectory);

    const filePath = path.resolve(this.creatorThemeDirectory, this.creatorThemeFileName);

    return this.writeThemeFile(filePath, theme);
  }

  public async updateThemesFromRepository() {
    await downloadFile(DOWNLOAD_ZIP_URI, DOWNLOAD_ZIP_PATH);

    const zip = new Azip(DOWNLOAD_ZIP_PATH);

    for (const entry of zip.getEntries()) {
      if (/\.json/.test(entry.entryName) && !entry.isDirectory) {
        const themeJson = entry.getData().toString("utf8");
        const themeFileName = path.parse(entry.entryName).base;
        const filePath = path.resolve(this.themesDirectory, themeFileName);

        try {
          const themeData = JSON.parse(themeJson) as Themes.Theme;
          const themeId = path.parse(filePath).name;
          const theme: Themes.Theme = {
            ...themeData,
            id: themeId,
          };

          this.themes.set(themeId, theme);

          await this.writeThemeFile(filePath, theme);
        } catch (error) {
          logger.error("Cannot parse JSON file: ", filePath, error);
        }
      }
    }
  }

  private async exportCreatorTheme(_: IpcMainEvent, theme: Themes.Theme): Promise<void> {
    const themeData = this.translatePaletteToCamelCase(theme);

    if (!this.validator.isValidThemePalette(themeData)) {
      return;
    }

    delete themeData.id;

    const themeName = `${theme.name.replace(/\s/, "_")}.json`;
    const lastDir = storage.settings.app.exportDir;
    const dir = lastDir ? `${lastDir}/${themeName}` : themeName;

    const filePath = await dialogs.showSaveDialog({
      title: "Choose theme export directory location",
      defaultPath: dir,
    });
    if (!filePath) {
      return;
    }

    return this.writeThemeFile(filePath, themeData);
  }
  private async readThemeFile(filePath: string): Promise<Themes.Theme> {
    const buffer = await fs.promises.readFile(filePath);
    const fileText = buffer.toString();

    return JSON.parse(fileText);
  }
  private async writeThemeFile(filePath: string, theme: Themes.Theme): Promise<void> {
    return fs.promises.writeFile(filePath, JSON.stringify(this.translatePaletteToCamelCase(theme)));
  }
  private translatePaletteToCamelCase(themeFile: Themes.Theme): Themes.Theme {
    return {
      id: themeFile.id,
      name: themeFile.name,
      author: themeFile.author,
      palette: keysToCamelCase(themeFile.palette),
    };
  }
  private translatePaletteToKebabCase(themeFile: Themes.Theme): Themes.Theme {
    return {
      id: themeFile.id,
      name: themeFile.name,
      author: themeFile.author,
      palette: keysToKebabCase(themeFile.palette),
    };
  }

  private async syncThemes(_: IpcMainEvent) {
    logger.debug("Sync themes start");

    app.emit("syncThemesStart");

    await this.updateThemesFromRepository();

    app.emit("syncThemesEnd", [...this.themes.values()]);

    logger.debug("Sync themes end");
  }
  private async handlerSaveCreatorTheme(_: IpcMainEvent, theme: Themes.Theme) {
    this.saveCreatorTheme(theme);
    this.creatorTheme = theme;
  }
  private async reloadCurrentTheme() {
    app.emit("loadCurrentTheme", this.themes.get(storage.settings.theme.currentTheme));
  }

  private registerEvents() {
    ipcMain.on("syncThemes", this.syncThemes.bind(this));
    ipcMain.on("saveCreatorTheme", this.handlerSaveCreatorTheme.bind(this));
    ipcMain.on("themeCreatorExportTheme", this.exportCreatorTheme.bind(this));

    app.on("reloadCurrentTheme", this.reloadCurrentTheme.bind(this));
  }
}
