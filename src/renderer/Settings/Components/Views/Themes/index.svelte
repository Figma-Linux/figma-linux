<script lang="ts">
  import { themes, creatorsThemes } from "../../../store";
  import { DropDown, Flex } from "Common";

  import ThemeItem from "./ThemeItem.svelte";

  function applyTheme(event: CustomEvent<SvelteEvents.ApplyTheme>) {
    console.log("applyTheme, themeId: ", event.detail.themeId);
  }
</script>

<div>
  <DropDown title="ThemeCreator's themes" isEmpty={!$creatorsThemes.length} open={false}>
    <themeView>
      {#each $creatorsThemes as theme (theme.id)}
        <ThemeItem on:applyTheme={applyTheme} {theme} currentThemeId="" />
      {/each}
    </themeView>
  </DropDown>
  <Flex height="20px" />
  <DropDown title="Repository themes" isEmpty={!$themes.length} open={true}>
    <themeView>
      {#each $themes as theme (theme.id)}
        <themeItem>
          <ThemeItem on:applyTheme={applyTheme} {theme} currentThemeId="" />
        </themeItem>
      {/each}
    </themeView>
  </DropDown>
  <Flex height="50px" />
</div>

<style>
  themeView {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: stretch;
    padding: 10px 0 0 0;
  }
  themeItem {
    display: block;
    flex: 1;
    min-width: 300px;
    max-width: 600px;
  }
  div {
    padding: 32px 32px 8px 32px;
  }
</style>
