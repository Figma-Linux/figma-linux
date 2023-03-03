<script lang="ts">
  import { InputRange, CheckBox, InputText, ListBox } from "Common/Input";
  import { Text, Label, Flex, FlexGrow, Line } from "Common";
  import { ButtonTool, SecondaryButton } from "Common/Buttons";
  import { Folder } from "Common/Icons";

  import { settings } from "../../../store";
  import DirectoryListItem from "./DirectoryListItem.svelte";

  let figmaUiSclae = 100;
  let tabsUiSclae = 100;
  let saveOpenedTabs = false;
  let enableColorSpaceSrgb = false;
  let visibleNewProjectBtn = false;
  let useZenity = false;
  let disableThemes = false;
  let exportDirectory = "";
  let items: Types.TabItem[] = [];

  settings.subscribe((options) => {
    if (!options) {
      return;
    }

    figmaUiSclae = options.ui.scaleFigmaUI * 100;
    tabsUiSclae = options.ui.scalePanel * 100;
    saveOpenedTabs = options.app.saveLastOpenedTabs;
    enableColorSpaceSrgb = options.app.enableColorSpaceSrgb;
    visibleNewProjectBtn = options.app.visibleNewProjectBtn;
    useZenity = options.app.useZenity;
    disableThemes = options.app.disableThemes;
    exportDirectory = options.app.exportDir;
    items = options.app.fontDirs.map((dir) => ({
      id: dir,
      text: dir,
      item: DirectoryListItem,
    }));
  });

  function onChangeExportPath(event: MouseEvent) {
    console.log("onChangeExportPath");
  }
  function onItemRemoveClick(item: Types.TabItem) {
    console.log("onItemRemoveClick, item: ", item);
  }
  function onAddDirectory(event: MouseEvent) {
    console.log("onAddDirectory");
  }
  function onClearList(event: MouseEvent) {
    console.log("onClearList");
  }
</script>

<div>
  <Flex>
    <Flex der="column" width="-webkit-fill-available">
      <Label>Scale UI</Label>
      <InputRange bind:value={figmaUiSclae} min={50} max={150} step={5} />
      <Flex der="column" align="center">
        <Text padding="8px 0 0 0">{figmaUiSclae}%</Text>
      </Flex>
    </Flex>
    <Flex width="120px" />
    <Flex der="column" width="-webkit-fill-available">
      <Label>Scale Tabs</Label>
      <InputRange bind:value={tabsUiSclae} min={50} max={150} step={5} />
      <Flex der="column" align="center">
        <Text padding="8px 0 0 0">{tabsUiSclae}%</Text>
      </Flex>
    </Flex>
  </Flex>

  <Flex height="50px" />
  <Line />
  <Flex height="40px" />

  <Flex>
    <Flex der="column" width="-webkit-fill-available">
      <Label>Main settings</Label>
      <CheckBox bind:checked={saveOpenedTabs} text="Save the last opened tabs" />
      <CheckBox bind:checked={enableColorSpaceSrgb} text="Enable color space sRGB" />
      <CheckBox bind:checked={visibleNewProjectBtn} text="Show new project button" />
      <CheckBox bind:checked={useZenity} text="Use Zenity for Dialogs" />
      <CheckBox bind:checked={disableThemes} text="Disable themes" />
    </Flex>
    <Flex width="120px" />
    <Flex der="column" width="-webkit-fill-available">
      <Label>Export files to</Label>
      <Flex>
        <FlexGrow grow={1}>
          <InputText bind:value={exportDirectory}>
            <ButtonTool normalBgColor="tarsparent" on:mouseup={onChangeExportPath}>
              <Folder size="20" />
            </ButtonTool>
          </InputText>
        </FlexGrow>
        <Flex width="20px" />
        <SecondaryButton on:mouseup={onChangeExportPath}>Change</SecondaryButton>
      </Flex>
    </Flex>
  </Flex>

  <Flex height="50px" />
  <Line />
  <Flex height="40px" />

  <Flex>
    <Flex der="column" width="-webkit-fill-available">
      <Label>Font directories</Label>
      <ListBox {items} {onItemRemoveClick} height="160px" />
      <Flex height="10px" />
      <Flex>
        <FlexGrow grow={1} />
        <SecondaryButton on:mouseup={onClearList}>Clear list</SecondaryButton>
        <Flex width="10px" />
        <SecondaryButton on:mouseup={onAddDirectory}>Add directory</SecondaryButton>
      </Flex>
    </Flex>
    <Flex width="120px" />
    <Flex der="column" width="-webkit-fill-available">
      <!-- TODO: -->
      <!-- <Label>UI font</Label> -->
      <!-- <InputText bind:value={textValue} /> -->
    </Flex>
  </Flex>
</div>

<style>
  div {
    padding: 32px 32px 8px 32px;
  }
</style>
