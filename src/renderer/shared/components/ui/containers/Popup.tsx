import { JSX, createSignal, onMount, onCleanup, mergeProps } from 'solid-js';
import styles from './Popup.module.css';

interface PopupProps {
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  border?: string;
  borderRadius?: string;
  bgColor?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  button: JSX.Element;
  children: JSX.Element;
}

export function Popup(props: PopupProps) {
  const merged = mergeProps(
    {
      width: 'auto',
      height: 'auto',
      padding: '8px 0',
      margin: '0',
      border: '0',
      borderRadius: '2px',
      bgColor: 'var(--bg-overlay)',
      isOpen: false,
    },
    props
  );

  let cornerRef: HTMLDivElement | undefined;
  let buttonRef: HTMLDivElement | undefined;
  let popupBodyRef: HTMLDivElement | undefined;

  const [isOpen, setIsOpen] = createSignal(merged.isOpen);
  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);
  const [cornerX, setCornerX] = createSignal(0);

  const handleButtonClick = (event: MouseEvent) => {
    if (buttonRef && buttonRef.contains(event.target as Node) && popupBodyRef) {
      const btnBounds = buttonRef.getBoundingClientRect();
      const bodyBounds = popupBodyRef.getBoundingClientRect();

      const newOpen = !isOpen();
      setIsOpen(newOpen);
      setX(btnBounds.x - bodyBounds.width / 2);
      setY(btnBounds.y + btnBounds.height);
      setCornerX(btnBounds.x + btnBounds.width / 2);

      props.onOpenChange?.(newOpen);
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      popupBodyRef &&
      buttonRef &&
      !(popupBodyRef.contains(event.target as Node) || buttonRef.contains(event.target as Node)) &&
      !event.defaultPrevented
    ) {
      setIsOpen(false);
      props.onOpenChange?.(false);
    }
  };

  onMount(() => {
    document.addEventListener('click', handleOutsideClick, true);
  });

  onCleanup(() => {
    document.removeEventListener('click', handleOutsideClick, true);
  });

  return (
    <>
      <div
        ref={cornerRef}
        class={styles.corner}
        style={{
          opacity: isOpen() ? 1 : 0,
          'user-select': isOpen() ? 'all' : 'none',
          'z-index': isOpen() ? 9999 : -9999,
          left: `${cornerX() - 4}px`,
          top: `${y()}px`,
        }}
      />
      <div ref={buttonRef} onClick={handleButtonClick}>
        {props.button}
      </div>
      <div
        ref={popupBodyRef}
        class={styles.popupBody}
        style={{
          opacity: isOpen() ? 1 : 0,
          'user-select': isOpen() ? 'all' : 'none',
          'z-index': isOpen() ? 9998 : -9999,
          left: `${x()}px`,
          top: `${y() + 3}px`,
          '--width': merged.width,
          '--height': merged.height,
          '--padding': merged.padding,
          '--margin': merged.margin,
          '--border': merged.border,
          '--bradius': merged.borderRadius,
          '--bgColor': merged.bgColor,
        }}
      >
        {props.children}
      </div>
    </>
  );
}
