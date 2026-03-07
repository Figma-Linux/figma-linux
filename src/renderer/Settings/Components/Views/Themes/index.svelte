<script lang="ts">
  import { themes, creatorsThemes, creatorTheme, settings, modalBounds } from "../../../store";
  import { DropDown, Flex, Grid } from "Common";
  import { themeApp } from "Common/Store/Themes";
  import { DEFAULT_THEME } from "Const";

  import ThemeItem from "./ThemeItem.svelte";

  interface ThemesProps {
    zIndex: number;
    onsetSettingsTabViewIndex?: (detail: { index: number }) => void;
  }

  let { zIndex, onsetSettingsTabViewIndex }: ThemesProps = $props();

  const api = window.settingsAPI;

  let isCreatorThemesEmpty = $derived($creatorsThemes.length === 0);
  let isThemesEmpty = $derived($themes.length === 0);

  function onApplyTheme(themeId: string) {
    const theme: Themes.Theme = structuredClone(
      [...$themes, ...$creatorsThemes].find((theme) => theme.id === themeId),
    );

    api.changeTheme(theme);
    $settings.theme.currentTheme = themeId;
  }
  function onDeleteTheme(themeId: string) {
    api.themeCreatorRemoveTheme(themeId);

    if (themeId === $themeApp.id) {
      onApplyTheme(DEFAULT_THEME.id);
    }
  }
  function onEditTheme(themeId: string) {
    const theme: Themes.Theme = structuredClone(
      $creatorsThemes.find((theme) => theme.id === themeId),
    );

    creatorTheme.setEditTheme(theme);

    onsetSettingsTabViewIndex?.({ index: 2 });
  }
  function onUseColorPalette(themeId: string) {
    const theme: Themes.Theme = structuredClone(
      [...$themes, ...$creatorsThemes].find((theme) => theme.id === themeId),
    );

    creatorTheme.setPaletteTheme(theme);

    onsetSettingsTabViewIndex?.({ index: 2 });
  }

  let zoomViewHeight = $derived($modalBounds ? $modalBounds.height - 94 : 0);
</script>

<div style={`z-index: ${zIndex}; height: ${zoomViewHeight}px;`}>
  <DropDown
    title="ThemeCreator's themes"
    bind:isEmpty={isCreatorThemesEmpty}
    bind:open={$settings.app.creatorsThemesDropdownOpen}
  >
    <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="2vmin" padding="12px 0 0 0">
      {#if $creatorsThemes.length > 0}
        {#each $creatorsThemes as theme (theme.id)}
          <ThemeItem
            ondeleteTheme={() => onDeleteTheme(theme.id)}
            oneditTheme={() => onEditTheme(theme.id)}
            onuseColorPalette={() => onUseColorPalette(theme.id)}
            onapplyTheme={() => onApplyTheme(theme.id)}
            {theme}
            canDelete
            canEdit
            bind:currentThemeId={$settings.theme.currentTheme}
          />
        {/each}
        {#if $creatorsThemes.length < 6}
          {#each Array(6 - $creatorsThemes.length) as _, i (i)}
            <themeFake></themeFake>
          {/each}
        {/if}
      {/if}
    </Grid>
  </DropDown>
  <Flex height="20px" />
  <DropDown
    title="Repository themes"
    bind:isEmpty={isThemesEmpty}
    bind:open={$settings.app.themeDropdownOpen}
  >
    <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="2vmin" padding="12px 0 0 0">
      {#if $themes.length > 0}
        {#each $themes as theme (theme.id)}
          <ThemeItem
            onuseColorPalette={() => onUseColorPalette(theme.id)}
            onapplyTheme={() => onApplyTheme(theme.id)}
            {theme}
            bind:currentThemeId={$settings.theme.currentTheme}
          />
        {/each}
        {#if $themes.length < 6}
          {#each Array(6 - $themes.length) as _, i (i)}
            <themeFake></themeFake>
          {/each}
        {/if}
      {/if}
    </Grid>
  </DropDown>
</div>

<style>
  div {
    position: absolute;
    width: -webkit-fill-available;
    background-color: var(--bg-panel);
    overflow: auto;
    padding: 32px 32px 8px 32px;
    user-select: none;
  }
  themeFake {
    display: block;
  }
</style>
