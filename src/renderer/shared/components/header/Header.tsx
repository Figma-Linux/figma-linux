import { ParentProps, mergeProps } from 'solid-js';
import styles from './Header.module.css';

interface HeaderProps extends ParentProps {
  bgColor?: string;
}

export function Header(props: HeaderProps) {
  const merged = mergeProps({ bgColor: 'var(--bg-header)' }, props);

  return (
    <div class={styles.header} style={{ '--bg-color': merged.bgColor }}>
      {props.children}
    </div>
  );
}
