import { ParentProps, mergeProps, createMemo } from 'solid-js';
import styles from './Line.module.css';

interface LineProps extends ParentProps {
  width?: string;
  height?: string;
  type?: 'H' | 'V';
}

export function Line(props: LineProps) {
  const merged = mergeProps(
    {
      width: undefined as string | undefined,
      height: undefined as string | undefined,
      type: 'H' as const,
    },
    props
  );

  const effectiveWidth = createMemo(() =>
    merged.type === 'H' ? (merged.width ?? '100%') : merged.width
  );
  const effectiveHeight = createMemo(() =>
    merged.type === 'V' ? (merged.height ?? '100%') : merged.height
  );

  return (
    <div
      class={styles.line}
      style={{
        '--width': effectiveWidth(),
        '--height': effectiveHeight(),
      }}
    >
      {props.children}
    </div>
  );
}
