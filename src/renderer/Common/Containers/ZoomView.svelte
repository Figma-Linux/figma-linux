<script lang="ts">
  export let zoom: number;
  export let width = "auto";
  export let height = "auto";

  let area: HTMLDivElement;
  let pos = { top: 0, left: 0, x: 0, y: 0 };
  let isMoving = false;

  function mouseUpHandler(event: MouseEvent) {
    area.style.cursor = "grab";
    isMoving = false;
  }
  function mouseDownHandler(event: MouseEvent) {
    area.style.cursor = "grabbing";
    isMoving = true;

    pos = {
      left: area.scrollLeft,
      top: area.scrollTop,
      x: event.clientX,
      y: event.clientY,
    };
  }
  function mouseMoveHandler(event: MouseEvent) {
    if (!isMoving) {
      return;
    }

    const dx = event.clientX - pos.x;
    const dy = event.clientY - pos.y;

    area.scrollTop = pos.top - dy;
    area.scrollLeft = pos.left - dx;
  }
</script>

<zoomArea
  bind:this={area}
  on:mousedown={mouseDownHandler}
  on:mouseup={mouseUpHandler}
  on:mousemove={mouseMoveHandler}
  on:mouseleave={mouseUpHandler}
  style={`
    width: ${width};
    height: ${height};
  `}
>
  <div
    style={`
      zoom: ${zoom};
    `}
  >
    <slot />
  </div>
</zoomArea>

<style>
  zoomArea {
    overflow: auto;
    border: 1px solid var(--borders);
  }
</style>
