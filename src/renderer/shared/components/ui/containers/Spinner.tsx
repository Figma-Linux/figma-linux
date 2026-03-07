import { ParentProps, mergeProps } from 'solid-js';
import styles from './Spinner.module.css';

interface SpinnerProps extends ParentProps {
  spin?: boolean;
}

export function Spinner(props: SpinnerProps) {
  const merged = mergeProps({ spin: false }, props);

  return (
    <div class={`${styles.spinner} ${merged.spin ? styles.spin : ''}`}>{props.children}</div>
  );
}
