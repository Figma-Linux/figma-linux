import { createSignal, createEffect, Show } from 'solid-js';
import { themeStore } from 'Shared/stores';
import { initCommonIpc } from 'Shared/ipc/common';
import { getColorPallet } from 'Utils/Render/themes';
import { initSettingsIpc } from './ipc';
import { settingsStore } from './stores';
import { Body } from './components';
import styles from './Settings.module.css';

export function Settings() {
  const [loadError, setLoadError] = createSignal<string | null>(null);
  const [isLoaded, setIsLoaded] = createSignal(false);
  const [pallet, setPallet] = createSignal<string[]>([]);

  const api = window.settingsAPI;

  try {
    initCommonIpc();
    initSettingsIpc();
    setIsLoaded(true);
  } catch (e) {
    setLoadError(String(e));
  }

  createEffect(() => {
    const theme = themeStore.get();
    if (theme) {
      setPallet(getColorPallet(theme));
    }
  });

  const onCloseModalHandler = (event: MouseEvent) => {
    settingsStore.trim();
    api.closeSettingsView(settingsStore.get());
  };

  const handleBackgroundClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      onCloseModalHandler(event);
    }
  };

  return (
    <div
      id="settings"
      class={styles.settings}
      style={Object.fromEntries(
        pallet().map((p) => {
          const [key, value] = p.split(':').map((s) => s.trim());
          return [key, value];
        })
      )}
      onMouseDown={handleBackgroundClick}
    >
      <Show
        when={!loadError()}
        fallback={
          <div class={styles.errorBox}>
            <h2>Settings Load Error</h2>
            <p>{loadError()}</p>
            <button onClick={onCloseModalHandler}>Close</button>
          </div>
        }
      >
        <Body onCloseSettings={onCloseModalHandler} />
      </Show>
    </div>
  );
}
