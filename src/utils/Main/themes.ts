import { app } from "electron";
import * as fs from "fs";
import * as path from "path";
import { v4 } from "uuid";

export const themesDirectory = path.resolve(app.getPath("userData"), "Themes");

export async function readThemeFile(filePath: string): Promise<Themes.Theme> {
  const buffer = await fs.promises.readFile(filePath);
  const fileText = buffer.toString();
  const theme: Themes.Theme = JSON.parse(fileText);

  return theme;
}

export async function getThemeById(id: string): Promise<Themes.Theme> {
  const buffer = await fs.promises.readFile(path.resolve(themesDirectory, `${id}.json`));
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
    return false;
  }

  if (!theme.author || !theme.name || !theme.palette) {
    return false;
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

    themes.push(themeFile);
  }

  return themes;
}
