import { createSignal } from 'solid-js';
import { DEFAULT_THEME } from 'Const';

const [theme, setTheme] = createSignal<Themes.Theme | undefined>();

export const themeStore = {
  get: theme,
  set: setTheme,
  reset: () => setTheme(structuredClone(DEFAULT_THEME)),
};
