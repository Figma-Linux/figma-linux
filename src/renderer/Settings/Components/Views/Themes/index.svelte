<script lang="ts">
  import { ipcRenderer } from "electron";
  import { createEventDispatcher } from "svelte";
  import { themes, creatorsThemes, creatorTheme, settings } from "../../../store";
  import { DropDown, Flex, Grid } from "Common";

  import ThemeItem from "./ThemeItem.svelte";

  const dispatch = createEventDispatcher();

  function onApplyTheme(event: CustomEvent<SvelteEvents.ApplyTheme>) {
    const themeId = event.detail.themeId;
    const theme: Themes.Theme = structuredClone(
      [...$themes, ...$creatorsThemes].find((theme) => theme.id === themeId),
    );

    ipcRenderer.send("changeTheme", theme);
    $settings.theme.currentTheme = themeId;
  }
  function onEditTheme(event: CustomEvent<SvelteEvents.ApplyTheme>) {
    const themeId = event.detail.themeId;

    const theme: Themes.Theme = structuredClone(
      $creatorsThemes.find((theme) => theme.id === themeId),
    );

    creatorTheme.setEditTheme(theme);

    dispatch("setSettingsTabViewIndex", { index: 2 });
  }
  function onUseColorPalette(event: CustomEvent<SvelteEvents.ApplyTheme>) {
    const themeId = event.detail.themeId;
    const theme: Themes.Theme = structuredClone(
      [...$themes, ...$creatorsThemes].find((theme) => theme.id === themeId),
    );

    creatorTheme.setPaletteTheme(theme);

    dispatch("setSettingsTabViewIndex", { index: 2 });
  }
</script>

<div>
  <DropDown title="ThemeCreator's themes" isEmpty={$creatorsThemes.length === 0} open={false}>
    <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="2vmin" padding="12px 0 0 0">
      {#if $creatorsThemes.length > 0}
        {#each $creatorsThemes as theme (theme.id)}
          <ThemeItem
            on:editTheme={onEditTheme}
            on:useColorPalette={onUseColorPalette}
            on:applyTheme={onApplyTheme}
            {theme}
            canEdit
            bind:currentThemeId={$settings.theme.currentTheme}
          />
        {/each}
        {#if $creatorsThemes.length < 6}
          {#each Array(6 - $creatorsThemes.length) as _, i (i)}
            <themeFake />
          {/each}
        {/if}
      {/if}
    </Grid>
  </DropDown>
  <Flex height="20px" />
  <DropDown title="Repository themes" isEmpty={$themes.length === 0} open={true}>
    <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="2vmin" padding="12px 0 0 0">
      {#if $themes.length > 0}
        {#each $themes as theme (theme.id)}
          <ThemeItem
            on:useColorPalette={onUseColorPalette}
            on:applyTheme={onApplyTheme}
            {theme}
            bind:currentThemeId={$settings.theme.currentTheme}
          />
        {/each}
        {#if $themes.length < 6}
          {#each Array(6 - $themes.length) as _, i (i)}
            <themeFake />
          {/each}
        {/if}
      {/if}
    </Grid>
  </DropDown>
</div>

<style>
  div {
    padding: 32px 32px 8px 32px;
  }
  themeFake {
    display: block;
  }
</style>
