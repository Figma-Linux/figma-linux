import { ParentProps, mergeProps, createMemo } from 'solid-js';
import styles from './Button.module.css';

interface ButtonProps extends ParentProps {
  round?: number;
  size?: number;
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  normalFgColor?: string;
  activeFgColor?: string;
  hoverFgColor?: string;
  normalBgAlpha?: string;
  activeBgAlpha?: string;
  hoverBgAlpha?: string;
  normalBgColor?: string;
  hoverBgColor?: string;
  activeBgColor?: string;
  disabledBgColor?: string;
  normalBorder?: string;
  activeBorder?: string;
  hoverBorder?: string;
  normalCursor?: string;
  activeCursor?: string;
  hoverCursor?: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
}

export function Button(props: ButtonProps) {
  const merged = mergeProps(
    {
      round: 0,
      size: undefined as number | undefined,
      width: 'inherit',
      height: 'inherit',
      padding: 'inherit',
      margin: 'inherit',
      normalFgColor: 'var(--text)',
      activeFgColor: 'var(--text-active)',
      hoverFgColor: 'var(--text-active)',
      normalBgAlpha: '1',
      activeBgAlpha: '1',
      hoverBgAlpha: '1',
      normalBgColor: 'transparent',
      hoverBgColor: 'var(--bg-tab-hover)',
      activeBgColor: 'var(--bg-tab-hover)',
      disabledBgColor: 'var(--borders)',
      normalBorder: 'none',
      activeBorder: 'none',
      hoverBorder: 'none',
      normalCursor: 'default',
      activeCursor: 'default',
      hoverCursor: 'default',
      isActive: false,
      disabled: false,
    },
    props
  );

  const effectiveWidth = createMemo(() => (merged.size ? `${merged.size}px` : merged.width));
  const effectiveHeight = createMemo(() => (merged.size ? `${merged.size}px` : merged.height));

  const clickHandler = (event: MouseEvent) => {
    if (!merged.disabled) {
      props.onClick?.(event);
    }
  };

  return (
    <div
      onMouseUp={clickHandler}
      class={`${styles.button} ${merged.isActive ? styles.active : ''} ${merged.disabled ? styles.disabled : ''}`}
      style={{
        '--padding': merged.padding,
        '--margin': merged.margin,
        '--width': effectiveWidth(),
        '--height': effectiveHeight(),
        '--border-radius': `${merged.round}px`,
        '--normal-bg-alpha': merged.normalBgAlpha,
        '--active-bg-alpha': merged.activeBgAlpha,
        '--hover-bg-alpha': merged.hoverBgAlpha,
        '--normal-bg-color': merged.normalBgColor,
        '--hover-bg-color': merged.hoverBgColor,
        '--active-bg-color': merged.activeBgColor,
        '--disabled-bg-color': merged.disabledBgColor,
        '--normal-fg-color': merged.normalFgColor,
        '--active-fg-color': merged.activeFgColor,
        '--hover-fg-color': merged.hoverFgColor,
        '--normal-border': merged.normalBorder,
        '--active-border': merged.activeBorder,
        '--hover-border': merged.hoverBorder,
        '--normal-cursor': merged.normalCursor,
        '--active-cursor': merged.activeCursor,
        '--hover-cursor': merged.hoverCursor,
      }}
    >
      {props.children}
    </div>
  );
}
