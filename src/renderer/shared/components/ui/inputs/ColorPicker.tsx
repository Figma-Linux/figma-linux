import { createMemo, mergeProps } from 'solid-js';
import styles from './ColorPicker.module.css';

export interface ColorClickEvent {
  input: EventTarget | null;
  button: number;
  value: string;
  key: string;
}

interface ColorPickerProps {
  size?: number;
  value?: string;
  key?: string;
  width?: string;
  height?: string;
  onValueChange?: (value: string) => void;
  onChange?: (event: Event) => void;
  onColorClick?: (event: ColorClickEvent) => void;
}

export function ColorPicker(props: ColorPickerProps) {
  const merged = mergeProps(
    {
      size: undefined as number | undefined,
      value: '#000000',
      key: '',
      width: 'auto',
      height: 'auto',
    },
    props
  );

  const effectiveWidth = createMemo(() => (merged.size ? `${merged.size}px` : merged.width));
  const effectiveHeight = createMemo(() => (merged.size ? `${merged.size}px` : merged.height));

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    props.onValueChange?.(target.value);
  };

  const handleChange = (event: Event) => {
    props.onChange?.(event);
  };

  const handleMouseDown = (event: MouseEvent) => {
    props.onColorClick?.({
      input: event.target,
      button: event.button,
      value: merged.value,
      key: merged.key,
    });
  };

  return (
    <input
      class={styles.colorPicker}
      style={{
        '--inputWidth': effectiveWidth(),
        '--inputHeight': effectiveHeight(),
      }}
      type="color"
      value={merged.value}
      onInput={handleInput}
      onChange={handleChange}
      onMouseDown={handleMouseDown}
    />
  );
}
