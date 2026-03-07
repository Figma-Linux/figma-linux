import { createSignal, onMount, onCleanup, For, Show, Component } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { HeaderModal } from 'Shared/components/header';
import { Button } from 'Shared/components/ui/buttons';
import { CloseModal } from 'Shared/components/icons';
import { FlexItem } from 'Shared/components/ui/containers';
import { TabView, TabViewHeaderItem } from 'Shared/components/tabs';
import { GeneralView } from './views/general';
import { ThemesView, ThemesHeaderComponent } from './views/themes';
import { ThemeCreatorView, ThemeCreatorHeaderComponent } from './views/theme-creator';
import { modalBoundsStore } from '../stores';
import styles from './Body.module.css';

interface SettingsTabItem {
  id: string;
  text: string;
  itemArgs?: Record<string, unknown>;
  item: Component<any>;
  bodyComponent: Component<any>;
  headerComponent?: Component;
}

interface BodyProps {
  onCloseSettings?: (event: MouseEvent) => void;
}

export function Body(props: BodyProps) {
  const items: SettingsTabItem[] = [
    {
      id: 'general',
      text: 'General',
      itemArgs: { padding: '14px 10px' },
      item: TabViewHeaderItem,
      bodyComponent: GeneralView,
    },
    {
      id: 'themes',
      text: 'Themes',
      itemArgs: { padding: '14px 10px' },
      item: TabViewHeaderItem,
      bodyComponent: ThemesView,
      headerComponent: ThemesHeaderComponent,
    },
    {
      id: 'themeCreator',
      text: 'Theme Creator',
      itemArgs: { padding: '14px 10px' },
      item: TabViewHeaderItem,
      bodyComponent: ThemeCreatorView,
      headerComponent: ThemeCreatorHeaderComponent,
    },
  ];

  const [currentItem, setCurrentItem] = createSignal(items[0]);
  const [currentId, setCurrentId] = createSignal(items[0].id);
  let modalRef: HTMLDivElement | undefined;

  const onTabItemClick = (item: any) => {
    const tabItem = items.find((i) => i.id === item.id);
    if (tabItem) {
      setCurrentItem(tabItem);
    }
  };

  const onSetTabViewIndex = (detail: { index: number }) => {
    const item = items[detail.index];
    if (item) {
      setCurrentItem(item);
      setCurrentId(item.id);
    }
  };

  const getModalBounds = () => {
    if (modalRef) {
      modalBoundsStore.set(modalRef.getBoundingClientRect());
    }
  };

  onMount(() => {
    getModalBounds();
    window.addEventListener('resize', getModalBounds);
  });

  onCleanup(() => {
    window.removeEventListener('resize', getModalBounds);
  });

  return (
    <div ref={modalRef} class={styles.container}>
      <HeaderModal bgColor="var(--bg-panel)">
        <FlexItem grow={1}>
          <TabView
            items={items.map((i) => ({
              id: i.id,
              text: i.text,
              item: i.item,
              itemArgs: i.itemArgs,
            }))}
            currentId={currentId()}
            initItemId="general"
            onItemClick={onTabItemClick}
            onCurrentIdChange={setCurrentId}
          />
        </FlexItem>
        <Show when={currentItem().headerComponent}>
          <Dynamic component={currentItem().headerComponent} />
        </Show>
        <Button size={32} round={3} onClick={props.onCloseSettings} hoverBgColor="var(--borders)">
          <CloseModal color="var(--text)" />
        </Button>
      </HeaderModal>
      <div class={styles.settingsBody}>
        <For each={items}>
          {(item) => (
            <Dynamic
              component={item.bodyComponent}
              zIndex={item.id === currentItem().id ? 2 : 0}
              onSetTabViewIndex={onSetTabViewIndex}
            />
          )}
        </For>
      </div>
    </div>
  );
}
