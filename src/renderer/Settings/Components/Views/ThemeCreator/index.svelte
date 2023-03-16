<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "path";
  import { Text, Label, Flex, Grid, ZoomView, ButtonTool } from "Common";
  import { RadioNormal, RadioChecked } from "Common/Icons";
  import { InputText, InputRange } from "Common/Input";
  import { getColorPallet } from "Utils/Render";
  import {
    creatorTheme,
    modalBounds,
    settings,
    themeNameError,
    themeAuthorError,
  } from "../../../store";
  import { validateThemeName, validateThemeAuthor } from "../../../validators";

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

  let previewer: HTMLDivElement;
  let maskBounds = { width: 0, height: 0 };

  let webviews: any[] = [];

  onMount(() => {
    webviews.forEach((webview, index) => {
      webview.addEventListener("dom-ready", () => {
        if (previewer) {
          const width = previewer.getBoundingClientRect().width;
          const height = previewer.getBoundingClientRect().height;
          maskBounds = {
            width,
            height,
          };
        }

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

  $: isValidName = $themeNameError === "";
  $: isValidAuthor = $themeAuthorError === "";
</script>

<div style={`z-index: ${zIndex}; height: ${bodyHeight}px;`}>
  <Grid columns="1fr 2vmin 35vmin">
    <Flex der="column">
      <Flex>
        <Flex der="column" width="-webkit-fill-available">
          <Label>Enter name of new theme</Label>
          <InputText
            bind:value={$creatorTheme.theme.name}
            validator={validateThemeName}
            placeholder="Theme name"
            bind:isValidValue={isValidName}
          />
          <Flex height="20px">
            <Text size="12px" color="var(--bg-window-close)">{$themeNameError}</Text>
          </Flex>
        </Flex>
        <Flex width="120px" />
        <Flex der="column" width="-webkit-fill-available">
          <Label>Enter your name as author</Label>
          <InputText
            bind:value={$creatorTheme.theme.author}
            validator={validateThemeAuthor}
            placeholder="Author name"
            bind:isValidValue={isValidAuthor}
          />
          <Flex height="20px">
            <Text size="12px" color="var(--bg-window-close)">{$themeAuthorError}</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex der="column">
        <ZoomView
          minZoom={0.2}
          maxZoom={1.5}
          bind:maskBounds
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
          <iframeView
            style={`
              ${getColorPallet($creatorTheme.theme).join(";")};
              z-index: ${$settings.app.useOldPreviewer ? 2 : 0};
              display: ${$settings.app.useOldPreviewer ? "block" : "none"};
              user-select: ${$settings.app.useOldPreviewer ? "all" : "none"};
            `}
          >
            <Preview />
          </iframeView>
          <iframeView
            bind:this={previewer}
            style={`
              z-index: ${$settings.app.useOldPreviewer ? 0 : 2};
              display: ${$settings.app.useOldPreviewer ? "none" : "grid"};
              user-select: ${$settings.app.useOldPreviewer ? "none" : "all"};
            `}
          >
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
    position: absolute;
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
