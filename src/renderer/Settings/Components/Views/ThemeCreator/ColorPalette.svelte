<script lang="ts">
  import { Flex, Text, InputColor } from "Common";
  import { PALETTE_TEXT } from "Const";

  import PopupColorMenu from "./PopupColorMenu.svelte";

  interface ColorPaletteProps {
    creatorTheme?: Themes.Theme;
  }

  let { creatorTheme = $bindable() }: ColorPaletteProps = $props();

  let key = $state("");
  let color = $state("");
  let isOpen = $state(false);
  let cornerX = $state(0);
  let x = $state(0);
  let y = $state(0);

  const paletteKeys = Object.keys(creatorTheme.palette);

  function onMouseUpHandler(event: { input: EventTarget | null; button: number; value: string; key: string }) {
    if (event.button === 2) {
      const bounds = (event.input as HTMLElement).getBoundingClientRect();

      color = event.value;
      key = event.key;
      isOpen = true;
      cornerX = bounds.x + bounds.width / 2;
      x = bounds.x - 68;
      y = bounds.y + bounds.height + 2;
    }
  }
</script>

<div>
  {#each paletteKeys as paletteKey (paletteKey)}
    <Flex>
      <InputColor
        size={24}
        key={paletteKey}
        bind:value={creatorTheme.palette[paletteKey]}
        onColorClick={onMouseUpHandler}
      />
      <Flex width="10px" />
      <Text>{PALETTE_TEXT[paletteKey]}</Text>
    </Flex>
    <Flex height="6px" />
  {/each}

  <PopupColorMenu bind:color bind:key bind:isOpen bind:cornerX bind:x bind:y />
</div>
