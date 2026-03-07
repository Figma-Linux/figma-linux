<script lang="ts">
  import type { Snippet } from "svelte";

  interface PopupProps {
    width?: string;
    height?: string;
    padding?: string;
    margin?: string;
    border?: string;
    bradius?: string;
    bgColor?: string;
    isOpen?: boolean;
    x?: number;
    y?: number;
    cornerX?: number;
    popupButton?: Snippet;
    popupBody?: Snippet;
  }

  let {
    width = "auto",
    height = "auto",
    padding = "8px 0",
    margin = "0",
    border = "0",
    bradius = "2px",
    bgColor = "var(--bg-overlay)",
    isOpen = $bindable(false),
    x = $bindable(0),
    y = $bindable(0),
    cornerX = $bindable(0),
    popupButton,
    popupBody: popupBodySnippet,
  }: PopupProps = $props();

  let corner: HTMLDivElement;
  let button: HTMLDivElement;
  let popupBody: HTMLDivElement;

  function clickInside(node: HTMLDivElement) {
    const handleClick = (event: MouseEvent) => {
      if (node && node.contains(event.target as Node)) {
        const btnBounds = node.getBoundingClientRect();
        const bodyBounds = popupBody.getBoundingClientRect();
        isOpen = !isOpen;
        x = btnBounds.x - bodyBounds.width / 2;
        y = btnBounds.y + btnBounds.height;
        cornerX = btnBounds.x + btnBounds.width / 2;
      }
    };

    document.addEventListener("click", handleClick, true);

    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  }
  function clickOutside(node: HTMLDivElement) {
    const handleClick = (event: MouseEvent) => {
      if (
        node &&
        !(node.contains(event.target as Node) || button.contains(event.target as Node)) &&
        !event.defaultPrevented
      ) {
        isOpen = false;
      }
    };

    document.addEventListener("click", handleClick, true);

    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  }
</script>

<corner
  style={`
    opacity: ${isOpen ? 1 : 0};
    user-select: ${isOpen ? "all" : "none"};
    z-index: ${isOpen ? "9999" : "-9999"};
    left: ${cornerX - 4}px;
    top: ${y}px;
  `}
  bind:this={corner}
></corner>
<div use:clickInside bind:this={button}>
  {@render popupButton?.()}
</div>

<popupBodyElem
  use:clickOutside
  bind:this={popupBody}
  style={`
    opacity: ${isOpen ? 1 : 0};
    user-select: ${isOpen ? "all" : "none"};
    z-index: ${isOpen ? "9998" : "-9999"};
    left: ${x}px;
    top: ${y + 3}px;
    --width: ${width};
    --height: ${height};
    --padding: ${padding};
    --margin: ${margin};
    --border: ${border};
    --bradius: ${bradius};
    --bgColor: ${bgColor};
  `}
>
  {@render popupBodySnippet?.()}
</popupBodyElem>

<style>
  popupBodyElem {
    display: block;
    position: fixed;
    z-index: 9998;
    width: var(--width);
    height: var(--height);
    padding: var(--padding);
    margin: var(--margin);
    border: var(--border);
    border-radius: var(--bradius);
    background-color: var(--bgColor);
    box-shadow: 0px 10px 16px rgb(0 0 0 / 35%), 0px 2px 5px rgb(0 0 0 / 35%),
      inset 0px 0.5px 0px rgb(0 0 0 / 8%), inset 0px 0px 0.5px rgb(0 0 0 / 35%),
      0px 2px 14px rgb(0 0 0 / 15%), 0px 0px 0px 0.5px rgb(0 0 0 / 20%);
  }

  corner {
    position: fixed;
    width: 9px;
    height: 9px;
    transform: rotate(45deg);
    z-index: 9999;
    background-color: var(--bg-overlay);
    box-shadow: 0px 10px 16px rgb(0 0 0 / 35%), 0px 2px 5px rgb(0 0 0 / 35%),
      inset 0px 0.5px 0px rgb(0 0 0 / 8%), inset 0px 0px 0.5px rgb(0 0 0 / 35%),
      0px 2px 14px rgb(0 0 0 / 15%), 0px 0px 0px 0.5px rgb(0 0 0 / 20%);
    border: var(--border);
    clip-path: polygon(0px 8px, 8px 0px, 0px 0px);
  }
</style>
