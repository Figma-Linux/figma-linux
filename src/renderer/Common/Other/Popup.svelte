<script lang="ts">
  export let width = "auto";
  export let height = "auto";
  export let padding = "8px 0";
  export let margin = "0";
  export let border = "0";
  export let bradius = "2px";
  export let bgColor = "var(--bg-overlay)";

  export let isOpen = false;
  export let x = 0;
  export let y = 0;

  let corner: HTMLDivElement;
  let button: HTMLDivElement;
  let popupBody: HTMLDivElement;
  let cornerX = 0;

  function clickInside(node: HTMLDivElement) {
    const handleClick = (event: Event) => {
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
    const handleClick = (event: Event) => {
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
/>
<div use:clickInside bind:this={button}>
  <slot name="popupButon" />
</div>

<popupBody
  use:clickOutside
  bind:this={popupBody}
  style={`
    opacity: ${isOpen ? 1 : 0};
    user-select: ${isOpen ? "all" : "none"};
    z-index: ${isOpen ? "9999" : "-9999"};
    left: ${x}px;
    top: ${y + 4}px;
    --width: ${width};
    --height: ${height};
    --padding: ${padding};
    --margin: ${margin};
    --border: ${border};
    --bradius: ${bradius};
    --bgColor: ${bgColor};
  `}
>
  <slot name="popupBody" />
</popupBody>

<style>
  popupBody {
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
  }

  corner {
    position: fixed;
    width: 9px;
    height: 9px;
    transform: rotate(45deg);
    z-index: 9999;
    background-color: var(--bg-overlay);
    box-shadow: 0px 10px 16px rgba(0, 0, 0, 0.35), 0px 2px 5px rgba(0, 0, 0, 0.35),
      inset 0px 0.5px 0px rgba(255, 255, 255, 0.08), inset 0px 0px 0.5px rgba(255, 255, 255, 0.35),
      0px 2px 14px rgba(0, 0, 0, 0.15), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.2);
    border: var(--border);
    clip-path: polygon(0px 8px, 8px 0px, 0px 0px);
  }
</style>
