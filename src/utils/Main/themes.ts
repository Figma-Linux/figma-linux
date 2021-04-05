import { app, net } from "electron";
import * as Azip from "adm-zip";
import * as fs from "fs";
import * as path from "path";
import { v4 } from "uuid";

import {
  AVAILABLE_THEME_FIELDS,
  AVAILABLE_THEME_FIELDS_COUNT,
  AVAILABLE_THEME_COLOR_VALUE,
  DEFAULT_THEME,
  TEST_THEME_ID,
  DOWNLOAD_ZIP_URI,
  DOWNLOAD_ZIP_PATH,
} from "Const";
import { storage } from "Main/Storage";
import { mkPath, access } from "Utils/Main";
import { dialogs } from "Main/Dialogs";
import { logger } from "Main/Logger";

export const themesDirectory = path.resolve(app.getPath("userData"), "Themes");
export const creatorThemeDirectory = path.resolve(app.getPath("userData"), "ThemeCreator");
export const creatorThemeFileName = "theme.json";

export function checkThemeColorValue(value: string): boolean {
  return AVAILABLE_THEME_COLOR_VALUE.test(value);
}

function translatePaletteToKebabCase(themeFile: Themes.Theme): Themes.Theme {
  const theme = {
    id: themeFile.id,
    name: themeFile.name,
    author: themeFile.author,
  } as Themes.Theme;

  const palette = Object.keys(themeFile.palette);
  const newPalette = {} as Themes.Palette;

  for (const paletteKey of palette) {
    const paletteValue = themeFile.palette[paletteKey];
    const newPaletteKey = paletteKey.replace(/([A-Z])/gm, "-$1").toLowerCase();

    newPalette[newPaletteKey] = paletteValue;
  }

  theme.palette = newPalette;

  return theme;
}

function translatePaletteToCamelCase(themeFile: Themes.Theme): Themes.Theme {
  const theme = {
    id: themeFile.id,
    name: themeFile.name,
    author: themeFile.author,
  } as Themes.Theme;

  const palette = Object.keys(themeFile.palette);
  const newPalette = {} as Themes.Palette;

  for (const paletteKey of palette) {
    const paletteValue = themeFile.palette[paletteKey];
    const newPaletteKey = paletteKey.replace(/-([a-z])/g, s => s.replace("-", "").toUpperCase());

    newPalette[newPaletteKey] = paletteValue;
  }

  theme.palette = newPalette;

  return theme;
}

export async function readThemeFile(filePath: string): Promise<Themes.Theme> {
  const buffer = await fs.promises.readFile(filePath);
  const fileText = buffer.toString();
  const theme: Themes.Theme = JSON.parse(fileText);

  return theme;
}

export function isValidThemePalette(theme: Themes.Theme, fileName?: string): boolean {
  if (!theme.palette) {
    return false;
  }

  if (!fileName) {
    fileName = theme.name;
  }

  const palette = Object.keys(theme.palette);

  if (palette.length !== AVAILABLE_THEME_FIELDS_COUNT) {
    logger.error(`The file "${fileName}" has invalid count of palette colors`);
    return false;
  }

  for (const paletteKey of palette) {
    const paletteValue = theme.palette[paletteKey];

    if (!AVAILABLE_THEME_FIELDS.includes(paletteKey)) {
      logger.error(`Theme "${fileName}" has unavailable color field "${paletteKey}"`);
      return false;
    }

    if (!checkThemeColorValue(paletteValue)) {
      logger.error(`Theme "${fileName}" has incorrect color value: "${paletteValue}" for "${paletteKey}" field`);
      return false;
    }
  }

  return true;
}

export async function writeThemeFile(filePath: string, theme: Themes.Theme): Promise<void> {
  return fs.promises.writeFile(filePath, JSON.stringify(translatePaletteToCamelCase(theme)));
}

export async function isValidThemeFile(filePath: string, theme: Themes.Theme): Promise<boolean> {
  const extname = path.extname(filePath);

  if (extname !== ".json") {
    logger.error(`The file "${filePath}" has not .json extension`);
    return false;
  }

  if (!theme.author || !theme.name || !theme.palette) {
    logger.error(`The file "${filePath}" has not the author or name or palette fields`);
    return false;
  }

  if (!isValidThemePalette(theme, filePath)) {
    return false;
  }

  return true;
}

export async function loadCreatorTheme(): Promise<Themes.Theme> {
  await mkPath(creatorThemeDirectory);

  const filePath = path.resolve(creatorThemeDirectory, creatorThemeFileName);
  const defaultTheme: Themes.Theme = {
    ...DEFAULT_THEME,
    id: TEST_THEME_ID,
  };

  if (!(await access(filePath))) {
    return defaultTheme;
  }

  const themeFile = await fs.promises.readFile(filePath).catch(error => {
    logger.error("Cannot read theme creator file: '${filePath}', error: ", error);

    return defaultTheme;
  });

  const theme = JSON.parse(themeFile.toString()) as Themes.Theme;
  const data = translatePaletteToCamelCase(theme);

  if (!isValidThemePalette(data, filePath)) {
    return defaultTheme;
  }

  return {
    ...translatePaletteToKebabCase(data),
    id: TEST_THEME_ID,
  };
}
export async function saveCreatorTheme(theme: Themes.Theme): Promise<void> {
  await mkPath(creatorThemeDirectory);

  const filePath = path.resolve(creatorThemeDirectory, creatorThemeFileName);

  return writeThemeFile(filePath, theme);
}

export async function exportCreatorTheme(theme: Themes.Theme): Promise<void> {
  const themeData = translatePaletteToCamelCase(theme);

  if (!isValidThemePalette(themeData)) {
    return;
  }

  delete themeData.id;

  const themeName = `${theme.name.replace(/\s/, "_")}.json`;
  const lastDir = storage.get().app.exportDir;
  const dir = lastDir ? `${lastDir}/${themeName}` : themeName;

  const filePath = await dialogs.showSaveDialog({
    title: "Choose theme export directory location",
    defaultPath: dir,
  });
  if (!filePath) {
    return;
  }

  return writeThemeFile(filePath, themeData);
}

export async function getThemesFromDirectory(): Promise<Themes.Theme[]> {
  const files = await fs.promises.readdir(themesDirectory);
  const creatorTheme = await loadCreatorTheme();
  const themes: Themes.Theme[] = [creatorTheme];

  for (const fileName of files) {
    const fullFilePath = path.resolve(themesDirectory, fileName);
    const themeFile = await readThemeFile(fullFilePath);

    if (await isValidThemeFile(fullFilePath, themeFile)) {
      const theme: Themes.Theme = translatePaletteToKebabCase(themeFile);

      if (!theme.id) {
        theme.id = v4();

        await writeThemeFile(fullFilePath, theme);
      }

      themes.push(theme);
    }
  }

  return themes;
}

export async function getThemesCount(): Promise<number> {
  const files = await fs.promises.readdir(themesDirectory);

  return files.length;
}

export function updateThemesFromRepository(): Promise<void> {
  return new Promise((res, rej) => {
    net
      .request(DOWNLOAD_ZIP_URI)
      .on("response", response => {
        const buffers: Uint8Array[] = [];
        let length = 0;

        response.on("error", (error: Error) => {
          logger.error("Cannot download themes, error: ", error);
          rej(error);
        });
        response.on("data", data => {
          buffers.push(data);
          length += data.length;
        });
        response.on("end", async () => {
          const buffer = Buffer.concat(buffers);

          await fs.promises.writeFile(DOWNLOAD_ZIP_PATH, buffer).catch(error => {
            rej(error);
          });

          const zip = new Azip(DOWNLOAD_ZIP_PATH);

          for (const entry of zip.getEntries()) {
            if (/\.json/.test(entry.entryName) && !entry.isDirectory) {
              const themeData = entry.getData().toString("utf8");
              const themeFileName = path.parse(entry.entryName).base;
              const filePath = path.resolve(themesDirectory, themeFileName);

              try {
                const theme = JSON.parse(themeData) as Themes.Theme;
                await writeThemeFile(filePath, theme);
              } catch (error) {
                logger.error("Cannot parse JSON file: ", filePath, error);
              }
            }
          }

          res();
        });
      })
      .end();
  });
}
