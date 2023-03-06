<script lang="ts">
  import { themes, creatorsThemes } from "../../../store";
  import { DropDown, Flex, Grid } from "Common";

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
    <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="2vmin">
      {#each $themes as theme (theme.id)}
        <ThemeItem on:applyTheme={applyTheme} {theme} currentThemeId="" />
      {/each}
    </Grid>
  </DropDown>
</div>

<style>
  div {
    padding: 32px 32px 8px 32px;
  }
</style>
