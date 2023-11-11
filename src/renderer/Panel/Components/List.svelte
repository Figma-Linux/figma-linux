<script lang="ts">
  import { flip } from "svelte/animate";
  import { dndzone } from "../../svelte-dnd-action";
  import { ButtonTool } from "Common/Buttons";
  import { Loader, Close } from "Icons";
  import { Spiner } from "Common";
  import { CHROME_GPU, NEW_FILE_TAB_TITLE } from "Const";

  export let currentTabId: number | undefined;
  export let items: Types.TabFront[] = [];
  const loadingItems: Dict<boolean> = {};
  const flipDurationMs = 150;
  const constrainAxisY = true;
  const cursorStartDrag = "default";
  const cursorDragging = "default";
  const cursorDrop = "default";
  const cursorHover = "default";
  const normalBgColor = "transparent";
  const hoverBgColor = "transparent";

  export let onClickTitle = (event: MouseEvent, id: number) => {};
  export let onClickClose = (event: CustomEvent, id: number) => {};
  export let onDndConsider = (event: any) => {};
  export let onDndFinalize = (event: any) => {};

  function onHover(e: CustomEvent<MouseEvent>, itemId: number) {
    loadingItems[itemId] = false;
  }
  function onLeave(e: CustomEvent<MouseEvent>, itemId: number) {
    loadingItems[itemId] = true;
  }

  $: for (const item of items) {
    loadingItems[item.id] = true;
  }
</script>

<section
  use:dndzone={{
    items,
    flipDurationMs,
    constrainAxisY,
    cursorStartDrag,
    cursorDragging,
    cursorDrop,
    cursorHover,
  }}
  on:consider={onDndConsider}
  on:finalize={onDndFinalize}
>
  {#each items as item (item.id)}
    <div
      class="panel-tab
      {currentTabId === item.id ? 'panel-tab__active' : ''}"
      animate:flip={{ duration: flipDurationMs }}
    >
      <div class="text" on:mouseup={(e) => onClickTitle(e, item.id)}>
        <span>
          {item.title}
        </span>
      </div>
      <!-- Why the Figma send setUsingMicrophone: true after setUsingMicrophone: false ?????  -->
      <!-- And this doesn't work correctly -->
      <!-- {#if item.isInVoiceCall}
        <ButtonTool padding="0 4px" {normalBgColor} {hoverBgColor}>
          {#if item.isUsingMicrophone}
            <UnMuted />
          {:else}
            <Muted />
          {/if}
        </ButtonTool>
      {/if} -->
      <ButtonTool
        padding="0 7px"
        {normalBgColor}
        {hoverBgColor}
        on:buttonClick={(e) => onClickClose(e, item.id)}
        on:mouseenter={(e) => onHover(e, item.id)}
        on:mouseleave={(e) => onLeave(e, item.id)}
      >
        {#if item.loading && loadingItems[item.id] && item.title !== CHROME_GPU && item.title !== NEW_FILE_TAB_TITLE}
          <Spiner spin={true}>
            <Loader size="14" />
          </Spiner>
        {:else}
          <Close size="14" />
        {/if}
      </ButtonTool>
    </div>
  {/each}
</section>

<style>
  section:focus-visible {
    outline: none !important;
  }
  section {
    display: flex;
    outline: none !important;
  }
  .text:focus-visible {
    outline: none !important;
  }
  .text {
    display: flex;
    min-width: 60px;
    max-width: 200px;
    align-items: center;
    user-select: none;
    padding: 0 0 0 12px;
    color: var(--fg-tab);
    font-size: var(--text-size-tab);
    outline: none !important;
  }
  span {
    display: inline;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .panel-tab:focus-visible {
    outline: none !important;
  }
  .panel-tab {
    display: flex;
    align-items: stretch;
    margin: 0 0 0 2px;
    border-radius: 3px 3px 0 0px;
    background-color: var(--bg-tab);
    transition: all 0.08s ease;
    outline: none !important;
    -webkit-app-region: no-drag;
  }
  .panel-tab:hover {
    background-color: var(--bg-tab-hover);
  }
  .panel-tab__active {
    background-color: var(--bg-tab-hover);
  }
  .panel-tab:hover span {
    color: var(--fg-tab-hover);
  }
  .panel-tab__active span {
    color: var(--fg-tab-hover);
  }
</style>
