import { For, createSignal, createEffect } from 'solid-js';
import {
  DragDropProvider,
  DragDropSensors,
  SortableProvider,
  createSortable,
  closestCenter,
  DragOverlay,
} from '@thisbeyond/solid-dnd';
import { ButtonTool } from 'Shared/components/ui/buttons';
import { Loader, Close } from 'Shared/components/icons';
import { Spinner } from 'Shared/components/ui/containers';
import { CHROME_GPU, NEW_FILE_TAB_TITLE } from 'Const';
import { tabsStore } from '../stores';
import styles from './TabList.module.css';

interface TabListProps {
  currentTabId?: number;
  items: Types.TabFront[];
  onClickTitle: (event: MouseEvent, id: number) => void;
  onClickClose: (event: MouseEvent, id: number) => void;
  onReorder: (items: Types.TabFront[]) => void;
}

function SortableTab(props: {
  tab: Types.TabFront;
  currentTabId?: number;
  loadingItems: Record<number, boolean>;
  onClickTitle: (event: MouseEvent, id: number) => void;
  onClickClose: (event: MouseEvent, id: number) => void;
  onHover: (id: number) => void;
  onLeave: (id: number) => void;
}) {
  const sortable = createSortable(props.tab.id);

  return (
    <div
      ref={sortable.ref}
      class={`${styles.panelTab} ${props.currentTabId === props.tab.id ? styles.panelTabActive : ''}`}
      classList={{ [styles.dragging]: sortable.isActiveDraggable }}
      {...sortable.dragActivators}
    >
      <div class={styles.text} onMouseUp={(e) => props.onClickTitle(e, props.tab.id)}>
        <span>{props.tab.title}</span>
      </div>
      <ButtonTool
        padding="0 7px"
        normalBgColor="transparent"
        hoverBgColor="transparent"
        onClick={() => props.onClickClose(new MouseEvent('click'), props.tab.id)}
        onMouseEnter={() => props.onHover(props.tab.id)}
        onMouseLeave={() => props.onLeave(props.tab.id)}
      >
        {props.tab.loading &&
        props.loadingItems[props.tab.id] &&
        props.tab.title !== CHROME_GPU &&
        props.tab.title !== NEW_FILE_TAB_TITLE ? (
          <Spinner spin={true}>
            <Loader size="14" />
          </Spinner>
        ) : (
          <Close size="14" />
        )}
      </ButtonTool>
    </div>
  );
}

export function TabList(props: TabListProps) {
  const [loadingItems, setLoadingItems] = createSignal<Record<number, boolean>>({});
  const [activeId, setActiveId] = createSignal<number | null>(null);

  createEffect(() => {
    const newLoadingItems: Record<number, boolean> = {};
    for (const item of props.items) {
      newLoadingItems[item.id] = true;
    }
    setLoadingItems(newLoadingItems);
  });

  const onHover = (itemId: number) => {
    setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
  };

  const onLeave = (itemId: number) => {
    setLoadingItems((prev) => ({ ...prev, [itemId]: true }));
  };

  const onDragStart = ({ draggable }: { draggable: { id: number } }) => {
    setActiveId(draggable.id);
  };

  const onDragEnd = ({
    draggable,
    droppable,
  }: {
    draggable: { id: number };
    droppable: { id: number } | null;
  }) => {
    setActiveId(null);
    if (draggable && droppable) {
      const currentItems = [...props.items];
      const fromIndex = currentItems.findIndex((item) => item.id === draggable.id);
      const toIndex = currentItems.findIndex((item) => item.id === droppable.id);

      if (fromIndex !== toIndex) {
        const [movedItem] = currentItems.splice(fromIndex, 1);
        currentItems.splice(toIndex, 0, movedItem);

        const reorderedItems = currentItems.map((tab, index) => ({
          ...tab,
          order: tab.title === NEW_FILE_TAB_TITLE ? 0 : index + 1,
        }));

        props.onReorder(reorderedItems.sort((a, b) => (a.order > b.order ? 1 : -1)));
      }
    }
  };

  const ids = () => props.items.map((item) => item.id);

  return (
    <DragDropProvider onDragStart={onDragStart} onDragEnd={onDragEnd} collisionDetector={closestCenter}>
      <DragDropSensors />
      <section class={styles.section}>
        <SortableProvider ids={ids()}>
          <For each={props.items}>
            {(tab) => (
              <SortableTab
                tab={tab}
                currentTabId={props.currentTabId}
                loadingItems={loadingItems()}
                onClickTitle={props.onClickTitle}
                onClickClose={props.onClickClose}
                onHover={onHover}
                onLeave={onLeave}
              />
            )}
          </For>
        </SortableProvider>
      </section>
      <DragOverlay>
        {activeId() !== null && (
          <div class={`${styles.panelTab} ${styles.overlay}`}>
            <div class={styles.text}>
              <span>{props.items.find((t) => t.id === activeId())?.title}</span>
            </div>
          </div>
        )}
      </DragOverlay>
    </DragDropProvider>
  );
}
