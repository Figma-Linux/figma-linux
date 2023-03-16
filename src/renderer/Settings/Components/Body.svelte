<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import { HeaderModal, Button, CloseModal, FlexItem } from "Common";
  import { TabView, TabViewHeaderItem } from "Common/TabView";
  import { General } from "./Views/General";
  import { Themes, ThemesHeaderComponent } from "./Views/Themes";
  import { ThemeCreator, ThemeCreatorHeaderComponent } from "./Views/ThemeCreator";
  import { modalBounds } from "../store";

  const dispatch = createEventDispatcher();

  const items: Types.SetingsTabItem[] = [
    {
      id: "general",
      text: "General",
      itemArgs: {
        padding: "14px 10px",
      },
      item: TabViewHeaderItem,
      bodyComponent: General,
    },
    {
      id: "themes",
      text: "Themes",
      itemArgs: {
        padding: "14px 10px",
      },
      item: TabViewHeaderItem,
      bodyComponent: Themes,
      headerComponent: ThemesHeaderComponent,
    },
    {
      id: "themeCreator",
      text: "Theme Creator",
      itemArgs: {
        padding: "14px 10px",
      },
      item: TabViewHeaderItem,
      bodyComponent: ThemeCreator,
      headerComponent: ThemeCreatorHeaderComponent,
    },
  ];

  let currentItem = items[0];
  let currentId = currentItem.id;

  function onTabItemClick(item: Types.SetingsTabItem) {
    currentItem = item;
  }
  function onSetTabViewIndex(event: CustomEvent<SvelteEvents.SetSettingsTabViewIndex>) {
    currentItem = items[event.detail.index];
    currentId = currentItem.id;
  }

  let modal: HTMLElement;
  function getModalBounds() {
    if (!modal) {
      return;
    }
    modalBounds.set(modal.getBoundingClientRect());
  }
  onMount(getModalBounds);
  window.addEventListener("resize", getModalBounds);
</script>

<div bind:this={modal}>
  <HeaderModal bgColor="var(--bg-panel)">
    <FlexItem grow={1}>
      <TabView {items} bind:currentId initItemId={"general"} onItemClick={onTabItemClick} />
    </FlexItem>
    <svelte:component this={currentItem.headerComponent} />
    <Button
      size={32}
      round={3}
      on:buttonClick={() => dispatch("closeSettings")}
      hoverBgColor="var(--borders)"
    >
      <CloseModal color="var(--text)" />
    </Button>
  </HeaderModal>
  <settingsBody>
    {#each items as item (item.id)}
      <svelte:component
        this={item.bodyComponent}
        zIndex={item.id === currentItem.id ? 2 : 0}
        on:setSettingsTabViewIndex={onSetTabViewIndex}
      />
    {/each}
  </settingsBody>
</div>

<style>
  div {
    width: 90vw;
    height: 80vh;
    overflow: hidden;
    background: var(--bg-panel);
  }
  settingsBody {
    position: relative;
    display: block;
    scroll-behavior: smooth;
    height: calc(80vh - 46px);
  }
</style>
