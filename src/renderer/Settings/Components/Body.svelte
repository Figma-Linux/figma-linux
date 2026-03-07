<script lang="ts">
  import { onMount } from "svelte";
  import { HeaderModal, Button, CloseModal, FlexItem } from "Common";
  import { TabView, TabViewHeaderItem } from "Common/TabView";
  import { General } from "./Views/General";
  import { Themes, ThemesHeaderComponent } from "./Views/Themes";
  import { ThemeCreator, ThemeCreatorHeaderComponent } from "./Views/ThemeCreator";
  import { modalBounds } from "../store";

  interface BodyProps {
    oncloseSettings?: (event: MouseEvent | CustomEvent) => void;
  }

  let { oncloseSettings }: BodyProps = $props();

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

  let currentItem = $state(items[0]);
  let currentId = $state(items[0].id);

  function onTabItemClick(item: Types.SetingsTabItem) {
    currentItem = item;
  }
  function onSetTabViewIndex(detail: { index: number }) {
    currentItem = items[detail.index];
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

  $effect(() => {
    window.addEventListener("resize", getModalBounds);
    return () => window.removeEventListener("resize", getModalBounds);
  });
</script>

<div bind:this={modal}>
  <HeaderModal bgColor="var(--bg-panel)">
    <FlexItem grow={1}>
      <TabView {items} bind:currentId initItemId={"general"} onItemClick={onTabItemClick} />
    </FlexItem>
    {#if currentItem.headerComponent}
      {@const HeaderComponent = currentItem.headerComponent}
      <HeaderComponent />
    {/if}
    <Button
      size={32}
      round={3}
      onClick={oncloseSettings}
      hoverBgColor="var(--borders)"
    >
      <CloseModal color="var(--text)" />
    </Button>
  </HeaderModal>
  <settingsBody>
    {#each items as item (item.id)}
      {@const BodyComponent = item.bodyComponent}
      <BodyComponent
        zIndex={item.id === currentItem.id ? 2 : 0}
        onsetSettingsTabViewIndex={onSetTabViewIndex}
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
