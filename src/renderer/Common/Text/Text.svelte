<script lang="ts">
  export let width = "auto";
  export let padding = "auto";
  export let whiteSpace = "nowrap";
  export let overflow = "auto";
  export let textOverflow = "auto";
  export let size = "auto";
</script>

<span
  style={`
    --size: ${size};
    --width: ${width};
    --padding: ${padding};
    --overflow: ${overflow};
    --whiteSpace: ${whiteSpace};
    --textOverflow: ${textOverflow};
  `}
>
  <slot />
</span>

<style>
  span {
    color: var(--text);
    width: var(--width);
    padding: var(--padding);
    overflow: var(--overflow);
    white-space: var(--whiteSpace);
    text-overflow: var(--textOverflow);
    font-size: var(--size);
  }
</style>
