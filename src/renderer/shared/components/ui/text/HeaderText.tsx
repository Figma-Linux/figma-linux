import { ParentProps } from 'solid-js';
import styles from './HeaderText.module.css';

export function HeaderText(props: ParentProps) {
  return <span class={styles.headerText}>{props.children}</span>;
}
