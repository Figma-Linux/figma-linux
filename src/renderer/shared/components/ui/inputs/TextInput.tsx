import { ParentProps, mergeProps, createSignal, createEffect } from 'solid-js';
import styles from './TextInput.module.css';

interface TextInputProps extends ParentProps {
  value?: string;
  width?: string;
  placeholder?: string;
  isValid?: boolean;
  validator?: (value: string) => boolean;
  onValueChange?: (value: string) => void;
  onChange?: (value: string) => void;
}

export function TextInput(props: TextInputProps) {
  const merged = mergeProps(
    {
      value: '',
      width: 'auto',
      placeholder: '',
      isValid: true,
      validator: () => true,
    },
    props
  );

  const [localValid, setLocalValid] = createSignal(merged.isValid);

  createEffect(() => {
    if (props.isValid !== undefined) {
      setLocalValid(props.isValid);
    }
  });

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    props.onValueChange?.(target.value);
  };

  const handleChange = () => {
    const valid = merged.validator(merged.value);
    setLocalValid(valid);
    props.onChange?.(merged.value);
  };

  const handleFocusOut = () => {
    const valid = merged.validator(merged.value);
    setLocalValid(valid);
    props.onChange?.(merged.value);
  };

  return (
    <div
      class={`${styles.container} ${!localValid() ? styles.inputError : ''}`}
      style={{ '--inputWidth': merged.width }}
    >
      {props.children}
      <input
        class={styles.input}
        type="text"
        value={merged.value}
        placeholder={merged.placeholder}
        onInput={handleInput}
        onChange={handleChange}
        onFocusOut={handleFocusOut}
      />
    </div>
  );
}
