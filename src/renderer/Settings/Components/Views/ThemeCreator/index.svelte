<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "path";
  import { Text, Label, Flex, Grid, ZoomView, ButtonTool } from "Common";
  import { RadioNormal, RadioChecked } from "Common/Icons";
  import { InputText, InputRange } from "Common/Input";
  import { getColorPallet } from "Utils/Render";
  import { creatorTheme, modalBounds, settings } from "../../../store";

  import Preview from "./Preview.svelte";
  import ColorPalette from "./ColorPalette.svelte";

  export let zIndex: number;

  let zoomViewHeight: number;
  $: {
    if ($modalBounds) {
      zoomViewHeight = $modalBounds.height - 238;
    }
  }

  let bodyHeight: number;
  $: {
    if ($modalBounds) {
      bodyHeight = $modalBounds.height - 94;
    }
  }

  let webviews: any[] = [];

  onMount(() => {
    webviews.forEach((webview, index) => {
      webview.addEventListener("dom-ready", () => {
        setTimeout(() => {
          webview.send("getThemeCreatorPalette", $creatorTheme.theme.palette);

          creatorTheme.subscribe((store) => {
            if (webviews.length === 0 || !webviews[index]) {
              return;
            }
            webview.send("getThemeCreatorPalette", store.theme.palette);
            webview.send("changeZoomFactor", store.zoom);
          });
        }, 1000);
      });
    });
  });
</script>

<div style={`z-index: ${zIndex}; height: ${bodyHeight}px;`}>
  <Grid columns="1fr 2vmin 35vmin">
    <Flex der="column">
      <Flex>
        <Flex der="column" width="-webkit-fill-available">
          <Label>Enter name of new theme</Label>
          <InputText bind:value={$creatorTheme.theme.name} placeholder="Theme name" />
        </Flex>
        <Flex width="120px" />
        <Flex der="column" width="-webkit-fill-available">
          <Label>Enter your name as author</Label>
          <InputText bind:value={$creatorTheme.theme.author} placeholder="Author name" />
        </Flex>
      </Flex>
      <Flex height="20px" />
      <Flex der="column">
        <ZoomView
          minZoom={0.2}
          maxZoom={1.5}
          bind:zoom={$creatorTheme.zoom}
          bind:isMaskActive={$creatorTheme.previewMaskVisible}
          height={`${zoomViewHeight}px`}
        >
          <toolBar slot="toolBar">
            <ButtonTool
              normalBgColor="tarsparent"
              on:buttonClick={creatorTheme.togglePreviewVisible}
            >
              {#if $creatorTheme.previewMaskVisible}
                <RadioChecked size="14" />
              {:else}
                <RadioNormal size="14" />
              {/if}
            </ButtonTool>
          </toolBar>
          {#if $settings.app.useOldPreviewer}
            <iframeView style={getColorPallet($creatorTheme.theme).join(";")}>
              <Preview />
            </iframeView>
          {:else}
            <iframeView>
              <webview
                bind:this={webviews[0]}
                preload={`file://${resolve(
                  process.cwd(),
                  "dist/renderer",
                  "themePreviewPreload.js",
                )}`}
                style={`
                  user-select: none;
                  width: 1099px;
                  height: 609px;
                `}
                title="Figma recent files"
                src="https://www.figma.com/files/recent"
              />
              <webview
                bind:this={webviews[1]}
                preload={`file://${resolve(
                  process.cwd(),
                  "dist/renderer",
                  "themePreviewPreload.js",
                )}`}
                style={`
                  user-select: none;
                  width: 1099px;
                  height: 609px;
                `}
                title="Figma recent files"
                src="https://www.figma.com/files/recent"
              />
              <webview
                bind:this={webviews[2]}
                preload={`file://${resolve(
                  process.cwd(),
                  "dist/renderer",
                  "themePreviewPreload.js",
                )}`}
                style={`
                  user-select: none;
                  width: 1099px;
                  height: 609px;
                `}
                title="Figma recent files"
                src="https://www.figma.com/files/recent"
              />
              <webview
                bind:this={webviews[3]}
                preload={`file://${resolve(
                  process.cwd(),
                  "dist/renderer",
                  "themePreviewPreload.js",
                )}`}
                style={`
                  user-select: none;
                  width: 1099px;
                  height: 609px;
                `}
                title="Figma recent files"
                src="https://www.figma.com/files/recent"
              />
            </iframeView>
          {/if}
        </ZoomView>
        <Flex height="10px" />
        <InputRange bind:value={$creatorTheme.zoom} min={0.2} max={1.5} step={0.05} />
        <Flex der="column" alignItems="center" justifyContent="center">
          <Text padding="8px 0 0 0">{Math.floor($creatorTheme.zoom * 100)}%</Text>
        </Flex>
      </Flex>
    </Flex>
    <Flex />
    <Flex der="column" justifyItems="stretch" width="-webkit-fill-available">
      <Label>Color Palette</Label>
      <colorPaletteDiv style={`height: ${zoomViewHeight + 90}px; overflow: auto;`}>
        <ColorPalette bind:creatorTheme={$creatorTheme.theme} />
      </colorPaletteDiv>
    </Flex>
  </Grid>
</div>

<style>
  div {
    position: absolute;
    background-color: var(--bg-panel);
    width: -webkit-fill-available;
    padding: 32px 32px 8px 32px;
    user-select: none;
  }
  colorPaletteDiv {
    display: block;
  }
  iframeView {
    display: grid;
    grid-template-columns: auto auto;
    gap: 2vmin;
    padding: 20px;
  }
  toolBar {
    display: flex;
    background-color: var(--bg-panel);
    padding: 6px;
    border-radius: 3px;
  }
</style>
