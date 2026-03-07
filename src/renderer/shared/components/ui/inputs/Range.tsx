import { mergeProps } from 'solid-js';
import styles from './Range.module.css';

interface RangeProps {
  value?: number;
  readonly?: boolean;
  max?: number;
  min?: number;
  step?: number;
  width?: string;
  thumbSize?: string;
  trackSize?: string;
  onValueChange?: (value: number) => void;
  onChange?: (event: Event) => void;
}

export function Range(props: RangeProps) {
  const merged = mergeProps(
    {
      value: 0,
      readonly: false,
      max: 100,
      min: 0,
      step: 1,
      width: 'auto',
      thumbSize: '16px',
      trackSize: '2px',
    },
    props
  );

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    props.onValueChange?.(Number(target.value));
  };

  const handleChange = (event: Event) => {
    props.onChange?.(event);
  };

  return (
    <input
      class={styles.range}
      style={{
        '--inputWidth': merged.width,
        '--thumbSize': merged.thumbSize,
        '--trackSize': merged.trackSize,
      }}
      type="range"
      readonly={merged.readonly}
      min={merged.min}
      max={merged.max}
      step={merged.step}
      value={merged.value}
      onInput={handleInput}
      onChange={handleChange}
    />
  );
}
