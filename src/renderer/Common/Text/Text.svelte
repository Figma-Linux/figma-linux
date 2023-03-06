<script lang="ts">
  export let width = "inherit";
  export let padding = "inherit";
  export let whiteSpace = "nowrap";
  export let overflow = "inherit";
  export let textOverflow = "inherit";
</script>

<span
  style={`
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
  }
</style>
