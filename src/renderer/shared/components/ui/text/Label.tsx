import { ParentProps, mergeProps } from 'solid-js';
import styles from './Label.module.css';

interface LabelProps extends ParentProps {
  padding?: string;
}

export function Label(props: LabelProps) {
  const merged = mergeProps({ padding: '0 0 20px 0' }, props);

  return (
    <span class={styles.label} style={{ padding: merged.padding }}>
      {props.children}
    </span>
  );
}
