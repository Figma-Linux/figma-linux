<script lang="ts">
  export let width: string | undefined = undefined;
  export let height: string | undefined = undefined;
  export let type: "H" | "V" = "H";

  switch (type) {
    case "H": {
      width = width || "100%";
      break;
    }
    case "V": {
      height = height || "100%";
      break;
    }
  }
</script>

<div
  style={`
    --width: ${width};
    --height: ${height};
  `}
>
  <slot />
</div>

<style>
  div {
    border: 1px solid var(--borders);
    width: var(--width);
    height: var(--height);
  }
</style>
