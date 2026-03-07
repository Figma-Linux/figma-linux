import { ParentProps, mergeProps } from 'solid-js';
import styles from './Text.module.css';

interface TextProps extends ParentProps {
  width?: string;
  padding?: string;
  whiteSpace?: string;
  overflow?: string;
  textOverflow?: string;
  size?: string;
  color?: string;
  disabledColor?: string;
  disabled?: boolean;
}

export function Text(props: TextProps) {
  const merged = mergeProps(
    {
      width: 'auto',
      padding: 'auto',
      whiteSpace: 'nowrap',
      overflow: 'auto',
      textOverflow: 'auto',
      size: 'auto',
      color: 'var(--text)',
      disabledColor: 'var(--text-disabled)',
      disabled: false,
    },
    props
  );

  const effectiveColor = () => (merged.disabled ? merged.disabledColor : merged.color);

  return (
    <span
      class={styles.text}
      style={{
        'font-size': merged.size,
        width: merged.width,
        color: effectiveColor(),
        padding: merged.padding,
        overflow: merged.overflow,
        'white-space': merged.whiteSpace,
        'text-overflow': merged.textOverflow,
      }}
    >
      {props.children}
    </span>
  );
}
