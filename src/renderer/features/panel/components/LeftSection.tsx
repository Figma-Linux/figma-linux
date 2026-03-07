import { Show } from 'solid-js';
import { Figma, Community, Plus } from 'Shared/components/icons';
import { ButtonWindow, ButtonTool } from 'Shared/components/ui/buttons';
import { newFileVisibleStore, communityTabStore, currentTabStore } from '../stores';
import { onClickHome, onClickNewProject, onClickCommunity } from './utils';
import styles from './LeftSection.module.css';

export function LeftSection() {
  return (
    <div class={styles.panelLeft}>
      <ButtonWindow
        padding="0px 10px"
        hoverBgColor="var(--bg-tab-hover)"
        activeBgColor="var(--bg-tab-hover)"
        isActive={currentTabStore.get() === 'mainTab'}
        onClick={onClickHome}
      >
        <Figma size="22" />
      </ButtonWindow>

      <Show when={communityTabStore.get()}>
        <ButtonWindow
          padding="0px 10px"
          hoverBgColor="var(--bg-tab-hover)"
          activeBgColor="var(--bg-tab-hover)"
          isActive={currentTabStore.get() === 'communityTab'}
          onClick={onClickCommunity}
        >
          <Community size="20" />
        </ButtonWindow>
      </Show>

      <Show when={newFileVisibleStore.get()}>
        <ButtonTool padding="0px 8px" onClick={onClickNewProject}>
          <Plus size="15" />
        </ButtonTool>
      </Show>
    </div>
  );
}
