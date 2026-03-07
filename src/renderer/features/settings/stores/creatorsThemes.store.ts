import { createStore, produce } from 'solid-js/store';

const [creatorsThemesState, setCreatorsThemesState] = createStore<Themes.Theme[]>([]);

export const creatorsThemesStore = {
  get: () => creatorsThemesState,
  set: (themes: Themes.Theme[]) => setCreatorsThemesState(themes),
  update: (updater: (themes: Themes.Theme[]) => void) => {
    setCreatorsThemesState(produce(updater));
  },
  exists: (name: string) => !!creatorsThemesState.find((theme) => theme.name === name),
};
