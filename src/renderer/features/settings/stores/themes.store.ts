import { createSignal } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { DEFAULT_THEME } from 'Const';

const [themesState, setThemesState] = createStore<Themes.Theme[]>([structuredClone(DEFAULT_THEME)]);

export const themesStore = {
  get: () => themesState,
  set: (themes: Themes.Theme[]) => {
    setThemesState([structuredClone(DEFAULT_THEME), ...themes]);
  },
  update: (updater: (themes: Themes.Theme[]) => void) => {
    setThemesState(produce(updater));
  },
};
