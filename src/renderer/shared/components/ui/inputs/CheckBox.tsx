import { mergeProps } from 'solid-js';
import styles from './CheckBox.module.css';

interface CheckBoxProps {
  text: string;
  checked?: boolean;
  checkSize?: string;
  checkWidth?: string;
  checkBorder?: string;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (event: Event) => void;
}

export function CheckBox(props: CheckBoxProps) {
  const merged = mergeProps(
    {
      checked: false,
      checkSize: '14px',
      checkWidth: '30px',
      checkBorder: '1px',
    },
    props
  );

  const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    props.onCheckedChange?.(target.checked);
    props.onChange?.(event);
  };

  return (
    <div
      class={styles.container}
      style={{
        '--checkSize': merged.checkSize,
        '--checkWidth': merged.checkWidth,
        '--checkBorder': merged.checkBorder,
      }}
    >
      <label class={styles.label}>
        <input
          type="checkbox"
          class={styles.input}
          checked={merged.checked}
          onChange={handleChange}
        />
        <span class={`${styles.span} ${merged.checked ? styles.checked : ''}`}>
          {props.text}
        </span>
      </label>
    </div>
  );
}
