import { createEffect, createSignal } from 'solid-js';
import { themeStore } from 'Shared/stores';
import { initCommonIpc } from 'Shared/ipc/common';
import { getColorPallet } from 'Utils/Render/themes';
import { initPanelIpc } from './ipc';
import { panelZoomStore } from './stores';
import { LeftSection, Tabs, RightSection } from './components';
import styles from './Panel.module.css';

export function Panel() {
  initCommonIpc();
  initPanelIpc();

  const [pallet, setPallet] = createSignal<string[]>([]);

  createEffect(() => {
    const theme = themeStore.get();
    if (theme) {
      setPallet(getColorPallet(theme));
    }
  });

  return (
    <div
      id="panel"
      class={styles.panel}
      style={{
        zoom: panelZoomStore.get(),
        ...Object.fromEntries(pallet().map((p) => {
          const [key, value] = p.split(':').map((s) => s.trim());
          return [key, value];
        })),
      }}
    >
      <LeftSection />
      <Tabs />
      <RightSection />
    </div>
  );
}
