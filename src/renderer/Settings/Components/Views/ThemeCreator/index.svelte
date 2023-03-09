<script lang="ts">
  import { Text, Label, Flex, ZoomView, HeaderModal } from "Common";
  import { TabView, TabViewHeaderItem } from "Common/TabView";
  import { InputText, InputRange } from "Common/Input";
  import { getColorPallet } from "Utils/Render";
  import { creatorTheme, modalBounds } from "../../../store";

  import Preview from "./Preview.svelte";
  import ColorPalette from "./ColorPalette.svelte";
  import FromTemplate from "./FromTemplate.svelte";

  $: zoomViewHeight = $modalBounds.height - 236;

  let textValue = "";
  let zoom = 1;

  const items: Types.SetingsTabItem[] = [
    {
      id: "ColorPalette",
      text: "Color palette",
      item: TabViewHeaderItem,
      itemArgs: {
        padding: "14px 10px",
      },
      bodyComponent: ColorPalette,
    },
    {
      id: "FromTemplate",
      text: "From a template",
      item: TabViewHeaderItem,
      itemArgs: {
        padding: "14px 10px",
      },
      bodyComponent: FromTemplate,
    },
  ];
  let currentItem = items[0];

  function onTabItemClick(item: Types.SetingsTabItem) {
    currentItem = item;
  }
</script>

<div>
  <Flex>
    <Flex der="column" width="65%">
      <Flex height="12px" />
      <Flex>
        <Flex der="column" width="-webkit-fill-available">
          <Label>Enter name of new theme</Label>
          <InputText bind:value={textValue} placeholder="Theme name" />
        </Flex>
        <Flex width="120px" />
        <Flex der="column" width="-webkit-fill-available">
          <Label>Enter your name as author</Label>
          <InputText bind:value={textValue} placeholder="Author name" />
        </Flex>
      </Flex>
      <Flex height="20px" />
      <Flex der="column">
        <ZoomView bind:zoom height={`${zoomViewHeight}px`}>
          <div style={getColorPallet($creatorTheme).join(";")}>
            <Preview />
          </div>
        </ZoomView>
        <Flex height="10px" />
        <InputRange bind:value={zoom} min={0.2} max={1.5} step={0.05} />
        <Flex der="column" align="center">
          <Text padding="8px 0 0 0">{Math.floor(zoom * 100)}%</Text>
        </Flex>
      </Flex>
    </Flex>
    <Flex width="120px" />
    <Flex der="column" justifyItems="stretch" width="-webkit-fill-available">
      <HeaderModal bgColor="var(--bg-panel)">
        <TabView {items} initItemId={"ColorPalette"} onItemClick={onTabItemClick} />
      </HeaderModal>
      <tabBody style={`height: ${zoomViewHeight + 100}px; overflow: auto;`}>
        <svelte:component this={currentItem.bodyComponent} bind:creatorTheme={$creatorTheme} />
      </tabBody>
    </Flex>
  </Flex>
</div>

<style>
  div {
    padding: 16px 32px 8px 32px;
  }
  tabBody {
    padding: 12px 0 0 0;
    display: block;
  }
</style>
