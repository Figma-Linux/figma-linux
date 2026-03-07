import { ParentProps, mergeProps } from 'solid-js';
import styles from './Rotate.module.css';

interface RotateProps extends ParentProps {
  deg?: number;
}

export function Rotate(props: RotateProps) {
  const merged = mergeProps({ deg: 0 }, props);

  return (
    <div class={styles.rotate} style={{ '--deg': `${merged.deg}deg` }}>
      {props.children}
    </div>
  );
}
