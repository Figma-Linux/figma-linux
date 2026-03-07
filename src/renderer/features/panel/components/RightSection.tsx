import { Minimize, Maximize, Close, Corner } from 'Shared/components/icons';
import { ButtonWindow } from 'Shared/components/ui/buttons';
import { menuStore } from '../stores';
import styles from './RightSection.module.css';

export function RightSection() {
  const api = window.panelAPI;

  const clickMenu = () => {
    if (menuStore.get()) {
      return;
    }

    api.openMainMenu();
    menuStore.toggle();
  };

  const closeHandler = () => {
    api.windowClose();
  };

  return (
    <div class={styles.panelRight}>
      <ButtonWindow isActive={menuStore.get()} onClick={clickMenu}>
        <Corner size="14" />
      </ButtonWindow>
      <ButtonWindow onClick={() => api.windowMinimize()}>
        <Minimize size="16" />
      </ButtonWindow>
      <ButtonWindow onClick={() => api.windowMaximize()}>
        <Maximize size="16" />
      </ButtonWindow>
      <ButtonWindow hoverBgColor="var(--bg-window-close)" onClick={closeHandler}>
        <Close size="16" />
      </ButtonWindow>
    </div>
  );
}
