import { creatorsThemes, themeNameError, themeAuthorError } from "../store";

export function validateThemeName(name: string): boolean {
  if (name === "Default Theme") {
    themeNameError.set("Change the theme name");
    return false;
  }
  if (name === "") {
    themeNameError.set("Enter the name of new theme");
    return false;
  }

  const exists = creatorsThemes.exists(name);

  if (exists) {
    themeNameError.set("Theme already exists. Please, choose other name");
    return false;
  }

  themeNameError.set("");
  return true;
}
export function validateThemeAuthor(author: string): boolean {
  if (author === "Figma") {
    themeAuthorError.set("Change the theme author name");
    return false;
  }
  if (author === "") {
    themeAuthorError.set("Enter the author name of new theme");
    return false;
  }

  themeAuthorError.set("");
  return true;
}
