import { ParentProps, mergeProps, createMemo } from 'solid-js';
import styles from './ButtonTool.module.css';

interface ButtonToolProps extends ParentProps {
  round?: number;
  size?: number;
  width?: string;
  height?: string;
  padding?: string;
  normalFgColor?: string;
  hoverFgColor?: string;
  normalBgColor?: string;
  hoverBgColor?: string;
  normalOpacity?: number;
  hoverOpacity?: number;
  disabled?: boolean;
  onClick?: () => void;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
}

export function ButtonTool(props: ButtonToolProps) {
  const merged = mergeProps(
    {
      round: 0,
      size: undefined as number | undefined,
      width: 'auto',
      height: 'auto',
      padding: 'auto',
      normalFgColor: 'var(--fg-header)',
      hoverFgColor: 'var(--fg-tab-hover)',
      normalBgColor: 'var(--bg-header)',
      hoverBgColor: 'var(--bg-tab-hover)',
      normalOpacity: 0.4,
      hoverOpacity: 1,
      disabled: false,
    },
    props
  );

  const effectiveWidth = createMemo(() => (merged.size ? `${merged.size}px` : merged.width));
  const effectiveHeight = createMemo(() => (merged.size ? `${merged.size}px` : merged.height));

  const clickHandler = (event: MouseEvent) => {
    if (!merged.disabled) {
      props.onClick?.();
    }
  };

  return (
    <div
      onMouseUp={clickHandler}
      onMouseEnter={(e) => props.onMouseEnter?.(e)}
      onMouseLeave={(e) => props.onMouseLeave?.(e)}
      class={styles.buttonTool}
      style={{
        '--padding': merged.padding,
        '--width': effectiveWidth(),
        '--height': effectiveHeight(),
        '--border-radius': `${merged.round}px`,
        '--normal-bg-color': merged.normalBgColor,
        '--hover-bg-color': merged.hoverBgColor,
        '--normal-fg-color': merged.normalFgColor,
        '--hover-fg-color': merged.hoverFgColor,
        '--normal-opacity': merged.normalOpacity.toString(),
        '--hover-opacity': merged.hoverOpacity.toString(),
      }}
    >
      {props.children}
    </div>
  );
}
