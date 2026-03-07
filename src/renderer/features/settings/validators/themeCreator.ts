import { creatorsThemesStore, inputErrorsStore } from '../stores';

export function validateThemeName(name: string): boolean {
  if (name === 'Default Theme') {
    inputErrorsStore.themeNameError.set('Change the theme name');
    return false;
  }
  if (name === '') {
    inputErrorsStore.themeNameError.set('Enter the name of new theme');
    return false;
  }

  const exists = creatorsThemesStore.exists(name);

  if (exists) {
    inputErrorsStore.themeNameError.set('Theme already exists. Please, choose other name');
    return false;
  }

  inputErrorsStore.themeNameError.set('');
  return true;
}

export function validateThemeAuthor(author: string): boolean {
  if (author === 'Figma') {
    inputErrorsStore.themeAuthorError.set('Change the theme author name');
    return false;
  }
  if (author === '') {
    inputErrorsStore.themeAuthorError.set('Enter the author name of new theme');
    return false;
  }

  inputErrorsStore.themeAuthorError.set('');
  return true;
}
