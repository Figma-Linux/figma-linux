import { createStore, produce } from 'solid-js/store';
import { DEFAULT_SETTINGS } from 'Utils/Render';

const [settingsState, setSettingsState] = createStore<Types.SettingsInterface>(DEFAULT_SETTINGS);

export const settingsStore = {
  get: () => settingsState,
  set: (settings: Types.SettingsInterface) => {
    setSettingsState({
      ...settings,
      app: {
        ...settings.app,
        themeDropdownOpen: settings.app.themeDropdownOpen ?? true,
        creatorsThemesDropdownOpen: settings.app.creatorsThemesDropdownOpen ?? false,
        useOldPreviewer: settings.app.useOldPreviewer ?? false,
        dontShowTutorialCreator: settings.app.dontShowTutorialCreator ?? false,
      },
    });
  },
  update: (updater: (state: Types.SettingsInterface) => void) => {
    setSettingsState(produce(updater));
  },
  trim: () => {
    setSettingsState(
      produce((state) => {
        state.app.commandSwitches = state.app.commandSwitches.filter((s) => s.switch !== '');
      })
    );
  },
  reset: () => {
    setSettingsState(DEFAULT_SETTINGS);
  },
};
