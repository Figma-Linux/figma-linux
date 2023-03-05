<script lang="ts">
  import { creatorsThemes, themes } from "../../../store";

  import ThemeItem from "./ThemeItem.svelte";

  function onApplyTemplate(event: CustomEvent<SvelteEvents.ApplyTheme>) {
    console.log("onApplyTemplate, themeId: ", event.detail.themeId);
  }
</script>

<div>
  {#each $creatorsThemes as theme (theme.id)}
    <themeItem>
      <ThemeItem bind:theme on:applyTemplate={onApplyTemplate} />
    </themeItem>
  {/each}
  {#each $themes as theme (theme.id)}
    <themeItem>
      <ThemeItem bind:theme on:applyTemplate={onApplyTemplate} />
    </themeItem>
  {/each}
</div>

<style>
  div {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: stretch;
    align-content: baseline;
  }
  themeItem {
    display: block;
    flex: 1;
    min-width: 160px;
    max-width: 300px;
    height: auto;
  }
</style>
