import { ParentProps, mergeProps, createMemo } from 'solid-js';
import styles from './Grid.module.css';

interface GridProps extends ParentProps {
  gap?: string;
  width?: string;
  height?: string;
  padding?: string;
  columns?: string;
  rows?: string;
  columnGap?: string;
  rowGap?: string;
  areas?: string;
}

export function Grid(props: GridProps) {
  const merged = mergeProps(
    {
      gap: '',
      width: 'auto',
      height: 'auto',
      padding: 'inherit',
      columns: 'auto',
      rows: 'auto',
      columnGap: 'auto',
      rowGap: 'auto',
      areas: 'auto',
    },
    props
  );

  const effectiveColumnGap = createMemo(() => (merged.gap ? merged.gap : merged.columnGap));
  const effectiveRowGap = createMemo(() => (merged.gap ? merged.gap : merged.rowGap));

  return (
    <div
      class={styles.grid}
      style={{
        '--width': merged.width,
        '--height': merged.height,
        '--padding': merged.padding,
        '--columns': merged.columns,
        '--rows': merged.rows,
        '--areas': merged.areas,
        '--grid-column-gap': effectiveColumnGap(),
        '--grid-row-gap': effectiveRowGap(),
      }}
    >
      {props.children}
    </div>
  );
}
