import { ParentProps, mergeProps } from 'solid-js';
import styles from './HeaderModal.module.css';

interface HeaderModalProps extends ParentProps {
  bgColor?: string;
}

export function HeaderModal(props: HeaderModalProps) {
  const merged = mergeProps({ bgColor: 'var(--bg-header)' }, props);

  return (
    <div class={styles.headerModal} style={{ '--bg-color': merged.bgColor }}>
      {props.children}
    </div>
  );
}
