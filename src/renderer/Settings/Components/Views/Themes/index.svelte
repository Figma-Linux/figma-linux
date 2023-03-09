<script lang="ts">
  import { ipcRenderer } from "electron";
  import { themes, creatorsThemes, settings } from "../../../store";
  import { DropDown, Flex, Grid } from "Common";

  import ThemeItem from "./ThemeItem.svelte";

  function applyTheme(event: CustomEvent<SvelteEvents.ApplyTheme>) {
    const themeId = event.detail.themeId;
    const theme: Themes.Theme = structuredClone(
      [...$themes, ...$creatorsThemes].find((theme) => theme.id === themeId),
    );

    ipcRenderer.send("changeTheme", theme);
    $settings.theme.currentTheme = themeId;
  }
</script>

<div>
  <DropDown title="ThemeCreator's themes" isEmpty={!$creatorsThemes.length} open={false}>
    <themeView>
      {#each $creatorsThemes as theme (theme.id)}
        <ThemeItem
          on:applyTheme={applyTheme}
          {theme}
          bind:currentThemeId={$settings.theme.currentTheme}
        />
      {/each}
    </themeView>
  </DropDown>
  <Flex height="20px" />
  <DropDown title="Repository themes" isEmpty={!$themes.length} open={true}>
    <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="2vmin" padding="12px 0 0 0">
      {#each $themes as theme (theme.id)}
        <ThemeItem
          on:applyTheme={applyTheme}
          {theme}
          bind:currentThemeId={$settings.theme.currentTheme}
        />
      {/each}
    </Grid>
  </DropDown>
</div>

<style>
  div {
    padding: 32px 32px 8px 32px;
  }
</style>
