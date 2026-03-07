import { ParentProps, mergeProps } from 'solid-js';
import styles from './Flex.module.css';

interface FlexProps extends ParentProps {
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  direction?: 'row' | 'column';
  justifyContent?: string;
  overflow?: string;
  justifyItems?: string;
  alignItems?: string;
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRadius?: string;
  bgColor?: string;
}

export function Flex(props: FlexProps) {
  const merged = mergeProps(
    {
      width: 'auto',
      height: 'auto',
      padding: '0',
      margin: '0',
      direction: 'row' as const,
      justifyContent: 'auto',
      overflow: 'auto',
      justifyItems: 'auto',
      alignItems: 'auto',
      border: 'none',
      borderTop: 'none',
      borderRight: 'none',
      borderBottom: 'none',
      borderLeft: 'none',
      borderRadius: 'none',
      bgColor: 'transparent',
    },
    props
  );

  return (
    <div
      class={styles.flex}
      style={{
        '--width': merged.width,
        '--height': merged.height,
        '--direction': merged.direction,
        '--justifyItems': merged.justifyItems,
        '--justifyContent': merged.justifyContent,
        '--alignItems': merged.alignItems,
        '--overflow': merged.overflow,
        '--border': merged.border,
        '--tborder': merged.borderTop,
        '--rborder': merged.borderRight,
        '--bborder': merged.borderBottom,
        '--lborder': merged.borderLeft,
        '--bradius': merged.borderRadius,
        '--padding': merged.padding,
        '--margin': merged.margin,
        '--bgColor': merged.bgColor,
      }}
    >
      {props.children}
    </div>
  );
}
