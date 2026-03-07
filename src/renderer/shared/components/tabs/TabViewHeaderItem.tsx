import { mergeProps } from 'solid-js';
import styles from './TabViewHeaderItem.module.css';

interface TabViewHeaderItemProps {
  text: string;
  round?: number;
  width?: string;
  height?: string;
  padding?: string;
  normalFgColor?: string;
  normalBgColor?: string;
  activeFgColor?: string;
  activeBgColor?: string;
  hoverFgColor?: string;
  hoverBgColor?: string;
  isActive?: boolean;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
}

export function TabViewHeaderItem(props: TabViewHeaderItemProps) {
  const merged = mergeProps(
    {
      round: 0,
      width: 'inherit',
      height: 'inherit',
      padding: 'inherit',
      normalFgColor: 'var(--text)',
      normalBgColor: 'transparent',
      activeFgColor: 'var(--text-active)',
      activeBgColor: 'transparent',
      hoverFgColor: 'var(--text-active)',
      hoverBgColor: 'transparent',
      isActive: false,
    },
    props
  );

  return (
    <span
      class={`${styles.item} ${merged.isActive ? styles.active : ''}`}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      style={{
        '--width': merged.width,
        '--height': merged.height,
        '--padding': merged.padding,
        '--border-radius': `${merged.round}px`,
        '--normal-fg-color': merged.normalFgColor,
        '--normal-bg-color': merged.normalBgColor,
        '--hover-fg-color': merged.hoverFgColor,
        '--hover-bg-color': merged.hoverBgColor,
        '--active-fg-color': merged.activeFgColor,
        '--active-bg-color': merged.activeBgColor,
      }}
    >
      {props.text}
    </span>
  );
}
