<script lang="ts">
  import { Grid } from "Common";
  import { creatorsThemes, themes } from "../../../store";

  import ThemeItem from "./ThemeItem.svelte";

  function onApplyTemplate(event: CustomEvent<SvelteEvents.ApplyTheme>) {
    console.log("onApplyTemplate, themeId: ", event.detail.themeId);
  }
</script>

<Grid columns="repeat(auto-fit, minmax(200px, 1fr))" gap="3%">
  {#each $creatorsThemes as theme (theme.id)}
    <ThemeItem bind:theme on:applyTemplate={onApplyTemplate} />
  {/each}
  {#each $themes as theme (theme.id)}
    <ThemeItem bind:theme on:applyTemplate={onApplyTemplate} />
  {/each}
</Grid>
