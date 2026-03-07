import { ParentProps, createSignal, createEffect, onMount, onCleanup, mergeProps } from 'solid-js';
import styles from './DropDown.module.css';

interface DropDownProps extends ParentProps {
  title: string;
  isEmpty?: boolean;
  open?: boolean;
  duration?: number;
  onOpenChange?: (open: boolean) => void;
}

export function DropDown(props: DropDownProps) {
  const merged = mergeProps(
    {
      isEmpty: false,
      open: false,
      duration: 400,
    },
    props
  );

  let contentRef: HTMLDivElement | undefined;
  const [height, setHeight] = createSignal(0);
  const [bodyHeight, setBodyHeight] = createSignal(0);
  const [isOpen, setIsOpen] = createSignal(merged.open);

  const calcHeight = () => {
    if (!contentRef) return;

    const bounds = contentRef.getBoundingClientRect();
    const newHeight = merged.isEmpty ? 0 : bounds.height;
    setHeight(newHeight);

    if (isOpen()) {
      setBodyHeight(newHeight);
    }
  };

  const handleChange = (event: Event) => {
    const elem = event.target as HTMLInputElement;
    calcHeight();

    if (elem.checked) {
      setIsOpen(true);
      setBodyHeight(height());
    } else {
      setIsOpen(false);
      setBodyHeight(0);
    }

    props.onOpenChange?.(elem.checked);
  };

  onMount(() => {
    calcHeight();
    window.addEventListener('resize', calcHeight);
  });

  onCleanup(() => {
    window.removeEventListener('resize', calcHeight);
  });

  createEffect(() => {
    if (props.open !== undefined) {
      setIsOpen(props.open);
      if (props.open) {
        calcHeight();
        setBodyHeight(height());
      } else {
        setBodyHeight(0);
      }
    }
  });

  return (
    <div class={styles.container}>
      <label class={styles.label}>
        <input
          type="checkbox"
          class={styles.input}
          checked={isOpen()}
          onChange={handleChange}
          onFocusIn={handleChange}
        />
        <span class={`${styles.span} ${isOpen() ? styles.spanOpen : ''}`}>{props.title}</span>
      </label>
      <div
        class={styles.block}
        style={{
          height: `${bodyHeight()}px`,
          'transition-duration': `${merged.duration}ms`,
        }}
      >
        <div ref={contentRef} class={styles.blockContent}>
          {props.children}
        </div>
      </div>
    </div>
  );
}
