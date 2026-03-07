import { createSignal } from 'solid-js';

const [themeNameError, setThemeNameError] = createSignal<string>('');
const [themeAuthorError, setThemeAuthorError] = createSignal<string>('');

export const inputErrorsStore = {
  themeNameError: {
    get: themeNameError,
    set: setThemeNameError,
  },
  themeAuthorError: {
    get: themeAuthorError,
    set: setThemeAuthorError,
  },
};
