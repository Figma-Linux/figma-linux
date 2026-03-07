import { createSignal, createEffect } from 'solid-js';
import { tabsStore, currentTabStore } from '../stores';
import { closeTab, tabFocus } from './utils';
import { TabList } from './TabList';
import styles from './Tabs.module.css';

export function Tabs() {
  const api = window.panelAPI;
  let itemRef: HTMLDivElement | undefined;
  const [currentTabId, setCurrentTabId] = createSignal<number | undefined>(undefined);

  const wheelHandler = (e: WheelEvent) => {
    if (!itemRef) return;
    if (e.deltaY > 0) {
      itemRef.scrollLeft += 50;
    } else {
      itemRef.scrollLeft -= 50;
    }
  };

  const dblclickHandler = (e: MouseEvent) => {
    api.windowMaximize();
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
  };

  const onClickTitle = (event: MouseEvent, id: number) => {
    switch (event.button) {
      // left mouse button
      case 0: {
        tabFocus(id);
        break;
      }
      // wheel mouse button
      case 1: {
        closeTab(id);
        break;
      }
      // right mouse button
      case 2: {
        api.openTabMenu(id, event.clientX, event.clientY);
        break;
      }
    }
  };

  const onClickClose = (event: MouseEvent, id: number) => {
    closeTab(id);
  };

  const onReorder = (items: Types.TabFront[]) => {
    tabsStore.set(items);
  };

  createEffect(() => {
    const id = currentTabStore.get();
    if (typeof id === 'number') {
      setCurrentTabId(id);
    } else {
      setCurrentTabId(undefined);
    }
  });

  return (
    <div
      ref={itemRef}
      class={styles.panelTabs}
      onWheel={wheelHandler}
      onDblClick={dblclickHandler}
    >
      <TabList
        items={tabsStore.get()}
        currentTabId={currentTabId()}
        onClickTitle={onClickTitle}
        onClickClose={onClickClose}
        onReorder={onReorder}
      />
    </div>
  );
}
