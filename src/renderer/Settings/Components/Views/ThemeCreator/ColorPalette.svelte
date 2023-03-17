<script lang="ts">
  import { Flex, Text, InputColor } from "Common";
  import { PALETTE_TEXT } from "Const";

  import PopupColorMenu from "./PopupColorMenu.svelte";

  export let creatorTheme: Themes.Theme;

  let key = "";
  let color = "";
  let isOpen = false;
  let cornerX = 0;
  let x = 0;
  let y = 0;

  const paletteKeys = Object.keys(creatorTheme.palette);

  function onMouseUpHandler(event: CustomEvent<SvelteEvents.InputColorClick>) {
    if (event.detail.button === 2) {
      const bounds = event.detail.input.getBoundingClientRect();

      color = event.detail.value;
      key = event.detail.key;
      isOpen = true;
      cornerX = bounds.x + bounds.width / 2;
      x = bounds.x - 68;
      y = bounds.y + bounds.height + 2;
    }
  }
</script>

<div>
  {#each paletteKeys as key (key)}
    <Flex>
      <InputColor
        size={24}
        {key}
        bind:value={creatorTheme.palette[key]}
        on:mouseClick={onMouseUpHandler}
      />
      <Flex width="10px" />
      <Text>{PALETTE_TEXT[key]}</Text>
    </Flex>
    <Flex height="6px" />
  {/each}

  <PopupColorMenu bind:color bind:key bind:isOpen bind:cornerX bind:x bind:y />
</div>
