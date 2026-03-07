import { ParentProps, JSX, createSignal, onMount, onCleanup, mergeProps } from 'solid-js';
import styles from './ZoomView.module.css';

interface MaskBounds {
  width: number;
  height: number;
}

interface ZoomViewProps extends ParentProps {
  zoom: number;
  minZoom: number;
  maxZoom: number;
  width?: string;
  height?: string;
  isMaskActive?: boolean;
  maskBounds?: MaskBounds;
  onZoomChange?: (zoom: number) => void;
  onMaskActiveChange?: (active: boolean) => void;
  toolBar?: JSX.Element;
  layout?: JSX.Element;
}

export function ZoomView(props: ZoomViewProps) {
  const merged = mergeProps(
    {
      width: 'auto',
      height: 'auto',
      isMaskActive: true,
      maskBounds: { width: 0, height: 0 },
    },
    props
  );

  let divRef: HTMLDivElement | undefined;
  let maskRef: HTMLDivElement | undefined;
  let areaRef: HTMLDivElement | undefined;

  const [pos, setPos] = createSignal({ top: 0, left: 0, x: 0, y: 0 });
  const [isMoving, setIsMoving] = createSignal(false);

  const aboveArea = (event: MouseEvent): boolean => {
    if (
      divRef &&
      maskRef &&
      (maskRef.isEqualNode(event.target as Node) || divRef.isEqualNode(event.target as Node))
    ) {
      return true;
    }
    return false;
  };

  const mouseUpHandler = (event: MouseEvent) => {
    if (!areaRef) return;
    if (aboveArea(event)) {
      areaRef.style.cursor = 'grab';
      setIsMoving(false);
      return;
    }
    areaRef.style.cursor = 'default';
  };

  const mouseLeaveHandler = () => {
    if (!areaRef) return;
    areaRef.style.cursor = 'default';
    setIsMoving(false);
  };

  const mouseDownHandler = (event: MouseEvent) => {
    if (!areaRef) return;
    if (aboveArea(event)) {
      setIsMoving(true);
      areaRef.style.cursor = 'grabbing';

      setPos({
        left: areaRef.scrollLeft,
        top: areaRef.scrollTop,
        x: event.clientX,
        y: event.clientY,
      });
      return;
    }
    areaRef.style.cursor = 'default';
  };

  const mouseMoveHandler = (event: MouseEvent) => {
    if (!areaRef) return;
    if (aboveArea(event)) {
      if (!isMoving()) {
        areaRef.style.cursor = 'grab';
        return;
      }

      const dx = event.clientX - pos().x;
      const dy = event.clientY - pos().y;

      areaRef.scrollTop = pos().top - dy;
      areaRef.scrollLeft = pos().left - dx;
      return;
    }
    areaRef.style.cursor = 'default';
  };

  const mouseWheelHandler = (event: WheelEvent) => {
    event.preventDefault();

    let newZoom = props.zoom;
    if (event.deltaY > 0) {
      newZoom = props.zoom <= props.minZoom ? props.zoom : props.zoom - 0.05;
    } else {
      newZoom = props.zoom >= props.maxZoom ? props.zoom : props.zoom + 0.05;
    }

    props.onZoomChange?.(newZoom);
  };

  const keydownHandler = (event: KeyboardEvent) => {
    if (event.code === 'AltLeft') {
      props.onMaskActiveChange?.(!merged.isMaskActive);
    }
  };

  onMount(() => {
    document.addEventListener('keydown', keydownHandler);
  });

  onCleanup(() => {
    document.removeEventListener('keydown', keydownHandler);
  });

  return (
    <div
      ref={areaRef}
      class={styles.zoomArea}
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
      onMouseMove={mouseMoveHandler}
      onMouseLeave={mouseLeaveHandler}
      onWheel={mouseWheelHandler}
      style={{
        width: merged.width,
        height: merged.height,
      }}
    >
      <div ref={divRef} class={styles.content} style={{ zoom: props.zoom }}>
        {props.children}
        <div
          ref={maskRef}
          class={styles.mask}
          style={{
            'z-index': merged.isMaskActive ? 100 : -1,
            width: `${merged.maskBounds.width}px`,
            height: `${merged.maskBounds.height}px`,
          }}
        />
      </div>
      <div class={styles.toolBarWrap}>
        <div class={styles.toolBar}>{props.toolBar}</div>
      </div>
      {props.layout}
    </div>
  );
}
