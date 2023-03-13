<script lang="ts">
  export let width = "auto";
  export let padding = "auto";
  export let whiteSpace = "nowrap";
  export let overflow = "auto";
  export let textOverflow = "auto";
  export let size = "auto";
  export let color = "var(--text)";
  export let disabledColor = "var(--text-disabled)";

  export let disabled: boolean | undefined = false;

  if (typeof disabled === "boolean" && disabled) {
    color = disabledColor;
  }
</script>

<span
  style={`
    --size: ${size};
    --width: ${width};
    --color: ${color};
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
    color: var(--color);
    width: var(--width);
    padding: var(--padding);
    overflow: var(--overflow);
    white-space: var(--whiteSpace);
    text-overflow: var(--textOverflow);
    font-size: var(--size);
  }
</style>
