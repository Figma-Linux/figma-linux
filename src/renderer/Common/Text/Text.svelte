<script lang="ts">
  import type { Snippet } from "svelte";

  interface TextProps {
    width?: string;
    padding?: string;
    whiteSpace?: string;
    overflow?: string;
    textOverflow?: string;
    size?: string;
    color?: string;
    disabledColor?: string;
    disabled?: boolean;
    children?: Snippet;
  }

  let {
    width = "auto",
    padding = "auto",
    whiteSpace = "nowrap",
    overflow = "auto",
    textOverflow = "auto",
    size = "auto",
    color = "var(--text)",
    disabledColor = "var(--text-disabled)",
    disabled = false,
    children,
  }: TextProps = $props();

  let effectiveColor = $derived(disabled ? disabledColor : color);
</script>

<span
  style={`
    --size: ${size};
    --width: ${width};
    --color: ${effectiveColor};
    --padding: ${padding};
    --overflow: ${overflow};
    --whiteSpace: ${whiteSpace};
    --textOverflow: ${textOverflow};
  `}
>
  {@render children?.()}
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
