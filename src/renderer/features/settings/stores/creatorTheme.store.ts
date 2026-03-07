import { createStore, produce } from 'solid-js/store';
import { DEFAULT_THEME } from 'Const';

const [creatorThemeState, setCreatorThemeState] = createStore<Store.CreatorThemeStore>({
  state: 'new',
  loadedTemplateId: '',
  previewMaskVisible: true,
  zoom: 1,
  theme: structuredClone(DEFAULT_THEME),
});

export const creatorThemeStore = {
  get: () => creatorThemeState,
  set: (state: Store.CreatorThemeStore) => setCreatorThemeState(state),
  update: (updater: (state: Store.CreatorThemeStore) => void) => {
    setCreatorThemeState(produce(updater));
  },
  reset: () => {
    setCreatorThemeState({
      state: 'new',
      loadedTemplateId: '',
      previewMaskVisible: true,
      zoom: 1,
      theme: structuredClone(DEFAULT_THEME),
    });
  },
  setTheme: (theme: Themes.Theme) => {
    setCreatorThemeState(produce((state) => {
      state.theme = theme;
    }));
  },
  setColor: (key: string, value: string) => {
    setCreatorThemeState(produce((state) => {
      (state.theme.palette as any)[key] = value;
    }));
  },
  setPaletteTheme: (theme: Themes.Theme) => {
    setCreatorThemeState(produce((state) => {
      state.loadedTemplateId = theme.id;
      state.state = 'new';
      state.theme.palette = theme.palette;
    }));
  },
  setEditTheme: (theme: Themes.Theme) => {
    setCreatorThemeState(produce((state) => {
      state.state = 'edit';
      state.theme = theme;
    }));
  },
  togglePreviewVisible: () => {
    setCreatorThemeState(produce((state) => {
      state.previewMaskVisible = !state.previewMaskVisible;
    }));
  },
};
