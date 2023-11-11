<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { getColorPallet } from "Utils/Render";

  import { Text, Label, Flex, FlexItem, Rotate } from "Common";
  import { PrimaryButton, ButtonTool } from "Common/Buttons";
  import {
    Burger,
    Hand,
    Component,
    Download,
    Pencil2,
    RadioNormal,
    RadioChecked,
    Delete,
  } from "Common/Icons";

  export let canEdit = false;
  export let canDelete = false;
  export let currentThemeId: string;
  export let theme: Themes.Theme;

  let radio: ConstructorOfATypedSvelteComponent;
  $: radio = currentThemeId === theme.id ? RadioChecked : RadioNormal;

  const dispatch = createEventDispatcher();
</script>

<div>
  <div
    class="themeview_item_tumbl"
    on:mouseup={() => dispatch("applyTheme", { themeId: theme.id })}
    style={getColorPallet(theme).join(";")}
  >
    <div class="themeview_item_tumbl_top" />
    <div class="themeview_item_tumbl_toolpanel">
      <div>
        <Burger color="var(--text)" />
        <Hand color="var(--text)" />
      </div>
      <div>
        <Component color="var(--textComponent)" />
      </div>
      <div>
        <PrimaryButton width="30px" height="16px" padding="0" />
      </div>
    </div>
    <div class="themeview_item_tumbl_body">
      <div class="themeview_item_tumbl_body_left">
        <div class="themeview_item_tumbl_body_left_text1" />
        <div class="themeview_item_tumbl_body_left_text2" />
      </div>
      <div class="themeview_item_tumbl_body_center" />
      <div class="themeview_item_tumbl_body_right" />
    </div>
  </div>
  <Flex
    padding="14px"
    lborder="1px solid var(--borders)"
    rborder="1px solid var(--borders)"
    bborder="1px solid var(--borders)"
    bradius="0 0 6px 6px"
  >
    <FlexItem grow={2}>
      <Flex der="column">
        <Label padding="0">{theme.name}</Label>
        <Text whiteSpace="wrap">{theme.author}</Text>
      </Flex>
    </FlexItem>
    <FlexItem grow={1}>
      <Flex alignItems="center" justifyContent="end" height="100%">
        {#if canEdit}
          <ButtonTool
            normalBgColor="tarsparent"
            on:buttonClick={() => dispatch("editTheme", { themeId: theme.id })}
          >
            <Pencil2 color="var(--text)" size="16" />
          </ButtonTool>
        {/if}
        <Flex width="10px" />
        <ButtonTool
          normalBgColor="tarsparent"
          on:buttonClick={() => dispatch("useColorPalette", { themeId: theme.id })}
        >
          <Rotate deg={-90}>
            <Download color="var(--text)" size="16" />
          </Rotate>
        </ButtonTool>
        <Flex width="10px" />
        <ButtonTool
          normalBgColor="tarsparent"
          on:buttonClick={() => dispatch("applyTheme", { themeId: theme.id })}
        >
          <svelte:component this={radio} color="var(--text)" />
        </ButtonTool>
        {#if canDelete}
          <Flex width="20px" />
          <ButtonTool
            normalBgColor="tarsparent"
            on:buttonClick={() => dispatch("deleteTheme", { themeId: theme.id })}
          >
            <Delete color="var(--text)" size="18" />
          </ButtonTool>
        {/if}
      </Flex>
    </FlexItem>
  </Flex>
</div>

<style>
  .themeview_item_tumbl {
    flex-direction: column;
    height: 159px;
    border: 1px solid var(--borders);
    border-radius: 6px 6px 0 0;
  }
  .themeview_item_tumbl:hover {
    cursor: pointer;
  }
  .themeview_item_tumbl_top {
    height: 8px;
    background-color: var(--bg-header);
    border-radius: 6px 6px 0 0;
  }
  .themeview_item_tumbl_toolpanel {
    display: grid;
    grid-template-columns: 60px 1fr 60px;
    height: 24px;
    align-items: center;
    background-color: var(--bg-toolbar);
  }
  .themeview_item_tumbl_toolpanel > div {
    display: flex;
    align-items: flex-end;
  }
  .themeview_item_tumbl_toolpanel > div:nth-child(1) {
    padding-left: 6px;
  }
  .themeview_item_tumbl_toolpanel > div:nth-child(2) {
    justify-content: center;
  }
  .themeview_item_tumbl_body {
    display: grid;
    grid-template-columns: 60px 1fr 60px;
    height: 127px;
  }
  .themeview_item_tumbl_body_left {
    padding-left: 8px;
    padding-top: 10px;
    background-color: var(--bg-panel);
    border-right: 1px solid var(--borders);
  }
  .themeview_item_tumbl_body_left_text1 {
    width: 40px;
    height: 4px;
    background-color: var(--text);
  }
  .themeview_item_tumbl_body_left_text2 {
    margin-top: 6px;
    width: 28px;
    height: 4px;
    background-color: var(--text);
  }
  .themeview_item_tumbl_body_center {
    background-color: var(--borders);
  }
  .themeview_item_tumbl_body_right {
    border-left: 1px solid var(--borders);
    background-color: var(--bg-panel);
  }
</style>
