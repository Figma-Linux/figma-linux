<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { getColorPallet } from "Utils/Render";

  import { Text, Label } from "Common";
  import { PrimaryButton, TertiaryButton } from "Common/Buttons";
  import { Burger, Hand, Component } from "Common/Icons";

  export let currentThemeId: string;
  export let theme: Themes.Theme;

  const dispatch = createEventDispatcher();
</script>

<div>
  <div class="themeview_item_tumbl" style={getColorPallet(theme).join(";")}>
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
  <div class="themeview_item_tumbl_panel">
    <div>
      <Label padding="0">{theme.name}</Label>
      <Text whiteSpace="wrap">{theme.author}</Text>
    </div>
    <TertiaryButton
      padding="0 10px"
      on:mouseup={() => dispatch("applyTheme", { themeId: theme.id })}
    >
      {currentThemeId === theme.id ? "Applied" : "Apply"}
    </TertiaryButton>
  </div>
</div>

<style>
  .themeview_item_tumbl {
    flex-direction: column;
    height: 159px;
    border: 1px solid var(--borders);
    border-radius: 6px 6px 0 0;
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
  .themeview_item_tumbl_panel {
    display: flex;
    justify-content: space-between;
    padding: 14px;
    border-radius: 0 0 6px 6px;
    border-left: 1px solid var(--borders);
    border-right: 1px solid var(--borders);
    border-bottom: 1px solid var(--borders);
  }
  .themeview_item_tumbl_panel > div {
    display: flex;
  }
  .themeview_item_tumbl_panel > div:nth-child(1) {
    flex-direction: column;
  }
  .themeview_item_tumbl_panel > div:nth-child(2) {
    align-self: center;
  }
</style>
