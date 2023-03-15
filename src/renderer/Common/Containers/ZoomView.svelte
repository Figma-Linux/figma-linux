<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  export let zoom: number;
  export let width = "auto";
  export let height = "auto";
  export let isMaskActive = true;

  let div: HTMLDivElement;
  let mask: HTMLDivElement;
  let area: HTMLDivElement;
  let pos = { top: 0, left: 0, x: 0, y: 0 };
  let isMoving = false;

  function aboveArea(event: MouseEvent) {
    if (
      div &&
      mask &&
      (mask.isEqualNode(event.target as Node) || div.isEqualNode(event.target as Node))
    ) {
      return true;
    }
    return false;
  }

  function mouseUpHandler(event: MouseEvent) {
    if (aboveArea(event)) {
      area.style.cursor = "grab";
      isMoving = false;

      return;
    }

    area.style.cursor = "default";
  }
  function mouseLeaveHandler(event: MouseEvent) {
    area.style.cursor = "default";
    isMoving = false;
  }
  function mouseDownHandler(event: MouseEvent) {
    if (aboveArea(event)) {
      isMoving = true;

      area.style.cursor = "grabbing";

      pos = {
        left: area.scrollLeft,
        top: area.scrollTop,
        x: event.clientX,
        y: event.clientY,
      };

      return;
    }

    area.style.cursor = "default";
  }
  function mouseMoveHandler(event: MouseEvent) {
    if (aboveArea(event)) {
      if (!isMoving) {
        area.style.cursor = "grab";
        return;
      }

      const dx = event.clientX - pos.x;
      const dy = event.clientY - pos.y;

      area.scrollTop = pos.top - dy;
      area.scrollLeft = pos.left - dx;

      return;
    }

    area.style.cursor = "default";
  }

  function keydownHandler(event: KeyboardEvent) {
    if (event.code === "ControlLeft") {
      isMaskActive = !isMaskActive;
    }
  }

  onMount(() => {
    document.addEventListener("keydown", keydownHandler);
  });
  onDestroy(() => {
    document.removeEventListener("keydown", keydownHandler);
  });
</script>

<zoomArea
  bind:this={area}
  on:mousedown={mouseDownHandler}
  on:mouseup={mouseUpHandler}
  on:mousemove={mouseMoveHandler}
  on:mouseleave={mouseLeaveHandler}
  style={`
    width: ${width};
    height: ${height};
  `}
>
  <div
    bind:this={div}
    style={`
      zoom: ${zoom};
    `}
  >
    <slot />
    <maskZoomArea bind:this={mask} style={`z-index: ${isMaskActive ? 1 : -1}`} />
  </div>
  <zoomAreaToolBarWrap>
    <zoomAreaToolBar>
      <slot name="toolBar" />
    </zoomAreaToolBar>
  </zoomAreaToolBarWrap>
</zoomArea>

<style>
  zoomArea {
    position: relative;
    overflow: auto;
    border: 1px solid var(--borders);
  }

  div {
    position: relative;
    width: fit-content;
  }
  zoomAreaToolBarWrap {
    position: absolute;
    z-index: 2;
    top: 0px;
    left: 0px;
  }
  zoomAreaToolBar {
    display: flex;
    position: fixed;
    padding: 6px;
    border-radius: 3px;
  }
  maskZoomArea {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    right: 100%;
    bottom: 100%;
    background-color: rgba(255, 255, 255, 0);
  }
</style>
