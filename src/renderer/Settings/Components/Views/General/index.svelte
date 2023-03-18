<script lang="ts">
  import { ipcRenderer } from "electron";
  import { InputRange, CheckBox, InputText, ListBox } from "Common/Input";
  import { Text, Label, Flex, FlexItem, Line } from "Common";
  import { ButtonTool, SecondaryButton } from "Common/Buttons";
  import { TOPPANELHEIGHT } from "Const";
  import { Folder } from "Common/Icons";
  import { settings, modalBounds } from "../../../store";

  import DirectoryListItem from "./DirectoryListItem.svelte";

  export let zIndex: number;

  let items: Types.TabItem[] = [];
  $: items = $settings.app.fontDirs.map((dir) => ({
    id: dir,
    text: dir,
    item: DirectoryListItem,
  }));

  async function onChangeExportPath(event: CustomEvent) {
    const directory = await ipcRenderer.invoke("selectExportDirectory");

    if (!directory) {
      return;
    }

    $settings.app.exportDir = directory;
  }
  function onItemRemoveClick(item: Types.TabItem) {
    $settings.app.fontDirs = items.filter((dir) => dir.id !== item.id).map((item) => item.id);
  }
  async function onAddDirectory(event: CustomEvent) {
    const directory = await ipcRenderer.invoke("selectExportDirectory");

    if (!directory) {
      return;
    }

    $settings.app.fontDirs.push(directory);
    $settings.app.fontDirs = $settings.app.fontDirs;
  }
  function onClearList(event: CustomEvent) {
    $settings.app.fontDirs = [];
  }

  let bodyHeight: number;
  $: {
    if ($modalBounds) {
      bodyHeight = $modalBounds.height - 94;
    }
  }

  $: {
    ipcRenderer.invoke("updateFigmaUiScale", $settings.ui.scaleFigmaUI);
  }
  $: {
    ipcRenderer.invoke("updatePanelScale", $settings.ui.scalePanel);
    $settings.app.panelHeight = Math.floor(TOPPANELHEIGHT * $settings.ui.scalePanel);
  }
</script>

<div style={`z-index: ${zIndex}; height: ${bodyHeight}px;`}>
  <Flex>
    <Flex der="column" width="-webkit-fill-available">
      <Label>Scale UI</Label>
      <InputRange bind:value={$settings.ui.scaleFigmaUI} min={0.5} max={1.5} step={0.05} />
      <Flex der="column" alignItems="center" justifyContent="center">
        <Text padding="8px 0 0 0">{Math.floor($settings.ui.scaleFigmaUI * 100)}%</Text>
      </Flex>
    </Flex>
    <Flex width="120px" />
    <Flex der="column" width="-webkit-fill-available">
      <Label>Scale Tabs</Label>
      <InputRange bind:value={$settings.ui.scalePanel} min={0.5} max={1.5} step={0.05} />
      <Flex der="column" alignItems="center" justifyContent="center">
        <Text padding="8px 0 0 0">{Math.floor($settings.ui.scalePanel * 100)}%</Text>
      </Flex>
    </Flex>
  </Flex>

  <Flex height="50px" />
  <Line />
  <Flex height="40px" />

  <Flex>
    <Flex der="column" width="-webkit-fill-available">
      <Label>Main settings</Label>
      <CheckBox bind:checked={$settings.app.saveLastOpenedTabs} text="Save the last opened tabs" />
      <CheckBox bind:checked={$settings.app.enableColorSpaceSrgb} text="Enable color space sRGB" />
      <CheckBox bind:checked={$settings.app.visibleNewProjectBtn} text="Show new project button" />
      <CheckBox bind:checked={$settings.app.useZenity} text="Use Zenity for Dialogs" />
      <CheckBox
        bind:checked={$settings.app.useOldPreviewer}
        text="Use old Previewer in ThemeCreator"
      />
      <CheckBox bind:checked={$settings.app.disableThemes} text="Disable themes" />
    </Flex>
    <Flex width="120px" />
    <Flex der="column" width="-webkit-fill-available">
      <Label>Export files to</Label>
      <Flex>
        <FlexItem grow={1}>
          <InputText bind:value={$settings.app.exportDir}>
            <ButtonTool normalBgColor="tarsparent" on:buttonClick={onChangeExportPath}>
              <Folder color="var(--text)" size="18" />
            </ButtonTool>
          </InputText>
        </FlexItem>
        <Flex width="20px" />
        <SecondaryButton on:buttonClick={onChangeExportPath}>Change</SecondaryButton>
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
        <FlexItem grow={1} />
        <SecondaryButton on:buttonClick={onClearList}>Clear list</SecondaryButton>
        <Flex width="10px" />
        <SecondaryButton on:buttonClick={onAddDirectory}>Add directory</SecondaryButton>
      </Flex>
    </Flex>
    <!-- <Flex width="120px" /> -->
    <!-- <Flex der="column" width="-webkit-fill-available"> -->
    <!-- TODO: -->
    <!-- <Label>UI font</Label> -->
    <!-- <InputText bind:value={textValue} /> -->
    <!-- </Flex> -->
  </Flex>
</div>

<style>
  div {
    position: absolute;
    background-color: var(--bg-panel);
    width: -webkit-fill-available;
    padding: 32px 32px 8px 32px;
    user-select: none;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
