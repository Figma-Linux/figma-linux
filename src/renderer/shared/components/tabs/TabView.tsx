import { For, mergeProps, Component, createEffect, createMemo, untrack } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { tabViewStore } from '../../stores';
import styles from './TabView.module.css';

export interface TabItem {
  id: string;
  text: string;
  item: Component<TabItemComponentProps>;
  itemArgs?: Record<string, unknown>;
}

export interface TabItemComponentProps {
  text: string;
  isActive: boolean;
  onMouseUp: () => void;
  [key: string]: unknown;
}

interface TabViewProps {
  items?: TabItem[];
  currentId?: string;
  initItemId?: string;
  padding?: string;
  flexDirection?: string;
  normalFgColor?: string;
  normalBgColor?: string;
  onItemClick?: (item: TabItem) => void;
  onCurrentIdChange?: (id: string) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
}

export function TabView(props: TabViewProps) {
  const merged = mergeProps(
    {
      items: [] as TabItem[],
      currentId: '',
      initItemId: undefined as string | undefined,
      padding: 'inherit',
      flexDirection: 'row',
      normalFgColor: 'var(--fg-header)',
      normalBgColor: 'inherit',
    },
    props
  );

  const id = createMemo(() => merged.items.map((i) => i.id).join('.'));

  // Initialize once with initItemId if provided
  untrack(() => {
    if (merged.initItemId) {
      tabViewStore.set(id(), merged.initItemId);
      props.onCurrentIdChange?.(merged.initItemId);
    }
  });

  createEffect(() => {
    tabViewStore.set(id(), merged.currentId);
  });

  const currentTabId = createMemo(() => tabViewStore.get()[id()] || merged.currentId);

  const handleItemClick = (item: TabItem) => {
    tabViewStore.set(id(), item.id);
    props.onCurrentIdChange?.(item.id);
    props.onItemClick?.(item);
  };

  return (
    <div
      class={styles.tabView}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      style={{
        '--padding': merged.padding,
        '--flex-direction': merged.flexDirection,
        '--normal-bg-color': merged.normalBgColor,
        '--normal-fg-color': merged.normalFgColor,
      }}
    >
      <For each={merged.items}>
        {(item) => (
          <Dynamic
            component={item.item}
            isActive={item.id === currentTabId()}
            text={item.text}
            onMouseUp={() => handleItemClick(item)}
            {...item.itemArgs}
          />
        )}
      </For>
    </div>
  );
}
