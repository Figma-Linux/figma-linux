import { createSignal } from 'solid-js';

const [themesLoaded, setThemesLoaded] = createSignal<boolean>(true);

export const themesLoadedStore = {
  get: themesLoaded,
  set: setThemesLoaded,
};
