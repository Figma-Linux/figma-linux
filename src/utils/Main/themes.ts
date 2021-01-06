import { app } from "electron";
import * as fs from "fs";
import * as path from "path";
import { v4 } from "uuid";

import { AVAILABLE_THEME_FIELDS, AVAILABLE_THEME_FIELDS_COUNT, AVAILABLE_THEME_COLOR_VALUE } from "Const";
import { logger } from "Main/Logger";

export const themesDirectory = path.resolve(app.getPath("userData"), "Themes");

export function checkThemeColorValue(value: string): boolean {
  return AVAILABLE_THEME_COLOR_VALUE.test(value);
}

function translateTheme(themeFile: Themes.Theme): Themes.Theme {
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

export async function readThemeFile(filePath: string): Promise<Themes.Theme> {
  const buffer = await fs.promises.readFile(filePath);
  const fileText = buffer.toString();
  const theme: Themes.Theme = JSON.parse(fileText);

  return theme;
}

export async function writeThemeFile(filePath: string, theme: Themes.Theme): Promise<void> {
  fs.promises.writeFile(filePath, JSON.stringify(theme));
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

  const palette = Object.keys(theme.palette);

  if (palette.length !== AVAILABLE_THEME_FIELDS_COUNT) {
    logger.error(`The file "${filePath}" has invalid count of palette colors`);
    return false;
  }

  for (const paletteKey of palette) {
    const paletteValue = theme.palette[paletteKey];

    if (!AVAILABLE_THEME_FIELDS.includes(paletteKey)) {
      logger.error(`Theme "${filePath}" has unavailable color field "${paletteKey}"`);
      return false;
    }

    if (!checkThemeColorValue(paletteValue)) {
      logger.error(`Theme "${filePath}" has incorrect color value: "${paletteValue}" for "${paletteKey}" field`);
      return false;
    }
  }

  if (!theme.id) {
    const id = v4();

    await writeThemeFile(filePath, { ...theme, id });
  }

  return true;
}

export async function getThemesFromDirectory(): Promise<Themes.Theme[]> {
  const files = await fs.promises.readdir(themesDirectory);
  const themes: Themes.Theme[] = [];

  for (const fileName of files) {
    const fullFilePath = path.resolve(themesDirectory, fileName);
    const themeFile = await readThemeFile(fullFilePath);

    if (!isValidThemeFile(fullFilePath, themeFile)) {
      continue;
    }

    const theme: Themes.Theme = translateTheme(themeFile);

    themes.push(theme);
  }

  return themes;
}
