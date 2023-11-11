<script lang="ts">
  export let grow = 0;
  export let flex = 0;
</script>

<div
  style={`
    flex: ${flex};
    flex-grow: ${grow};
  `}
>
  <slot />
</div>
