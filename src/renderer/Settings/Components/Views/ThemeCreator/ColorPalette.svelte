<script lang="ts">
  import { Flex, Text, InputColor } from "Common";
  import { PALETTE_TEXT } from "Const";

  export let theme: Themes.Theme;

  const paletteKeys = Object.keys(theme.palette);
</script>

<div>
  {#each paletteKeys as key (key)}
    <Flex>
      <InputColor size={24} bind:value={theme.palette[key]} />
      <Flex width="10px" />
      <Text>{PALETTE_TEXT[key]}</Text>
    </Flex>
    <Flex height="6px" />
  {/each}
</div>
