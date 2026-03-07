import { For, mergeProps, Component, JSX } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import styles from './List.module.css';

export interface ListItem {
  id: number;
  text: string;
  item: Component<ListItemComponentProps>;
  itemArgs?: Record<string, unknown>;
  disabled?: boolean;
}

export interface ListItemComponentProps {
  text: string;
  disabled: boolean;
  onItemClick: () => void;
  onItemRemoveClick: () => void;
  [key: string]: unknown;
}

interface ListProps {
  items?: ListItem[];
  width?: string;
  height?: string;
  border?: string;
  padding?: string;
  borderRadius?: string;
  onItemClick?: (item: ListItem) => void;
  onItemRemoveClick?: (item: ListItem) => void;
}

export function List(props: ListProps) {
  const merged = mergeProps(
    {
      items: [] as ListItem[],
      width: 'auto',
      height: 'auto',
      border: '1px solid var(--borders)',
      padding: '8px 8px 8px 16px',
      borderRadius: '3px',
    },
    props
  );

  const handleItemClick = (item: ListItem) => {
    props.onItemClick?.(item);
  };

  const handleItemRemoveClick = (item: ListItem) => {
    props.onItemRemoveClick?.(item);
  };

  return (
    <div
      class={styles.list}
      style={{
        '--width': merged.width,
        '--height': merged.height,
        '--border': merged.border,
        '--padding': merged.padding,
        '--bradius': merged.borderRadius,
      }}
    >
      <For each={merged.items}>
        {(item) => (
          <Dynamic
            component={item.item}
            text={item.text}
            disabled={item.disabled ?? false}
            onItemClick={() => handleItemClick(item)}
            onItemRemoveClick={() => handleItemRemoveClick(item)}
            {...item.itemArgs}
          />
        )}
      </For>
    </div>
  );
}
