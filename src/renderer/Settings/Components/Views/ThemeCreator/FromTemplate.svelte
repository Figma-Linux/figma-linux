<script lang="ts">
  import { Grid } from "Common";
  import { creatorsThemes, themes } from "../../../store";

  import ThemeItem from "./ThemeItem.svelte";

  export let creatorTheme: Themes.Theme;

  function onApplyTemplate(event: CustomEvent<SvelteEvents.ApplyTheme>) {
    const themeId = event.detail.themeId;

    creatorTheme = structuredClone(
      [...$themes, ...$creatorsThemes].find((theme) => theme.id === themeId),
    );
  }
</script>

<Grid columns="repeat(auto-fit, minmax(200px, 1fr))" gap="2vmin" padding="0 12px 0 0">
  {#each [...$creatorsThemes, ...$themes] as theme (theme.id)}
    <ThemeItem bind:theme on:applyTemplate={onApplyTemplate} />
  {/each}
</Grid>
