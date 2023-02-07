<script lang="ts">
  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";
  import { ButtonTabClose } from "Common/Buttons";
  import { Close } from "Icons";

  export let items: Types.TabFront[] = [];
  const flipDurationMs = 150;
  const constrainAxisY = true;
  const cursorStartDrag = "default";
  const cursorDragging = "default";
  const cursorDrop = "default";
  const cursorHover = "default";

  export let onClickTitle = (event: MouseEvent, id: number) => {};
  export let onClickClose = (event: MouseEvent, id: number) => {};
  export let onDndConsider = (event: any) => {};
  export let onDndFinalize = (event: any) => {};
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
      {false && 'panel-tab__active'}"
      animate:flip={{ duration: flipDurationMs }}
    >
      <div class="text" on:mouseup={(e) => onClickTitle(e, item.id)}>
        <span>
          {item.title}
        </span>
      </div>
      <ButtonTabClose onClick={(e) => onClickClose(e, item.id)}>
        <Close size="12" />
      </ButtonTabClose>
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
    font-size: var(--font-title-size);
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
