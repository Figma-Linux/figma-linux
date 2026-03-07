<script lang="ts">
  import { onMount } from "svelte";
  import { Text, Label, Flex, Grid, ZoomView, ButtonTool } from "Common";

  // Get the theme preview preload path from the settingsAPI (async)
  let preloadPath = $state('');

  onMount(async () => {
    if (window.settingsAPI) {
      preloadPath = await window.settingsAPI.getThemePreviewPreloadPath();
    }
  });
  import { RadioNormal, RadioChecked } from "Common/Icons";
  import { InputText, InputRange } from "Common/Input";
  import { getColorPallet } from "Utils/Render";
  import {
    settings,
    creatorTheme,
    modalBounds,
    themeNameError,
    themeAuthorError,
  } from "../../../store";
  import { validateThemeName, validateThemeAuthor } from "../../../validators";

  import Preview from "./Preview.svelte";
  import ColorPalette from "./ColorPalette.svelte";
  import Tutorial from "./Tutorial.svelte";

  interface ThemeCreatorProps {
    zIndex: number;
    onsetSettingsTabViewIndex?: (detail: { index: number }) => void;
  }

  let { zIndex, onsetSettingsTabViewIndex }: ThemeCreatorProps = $props();

  let zoomViewHeight = $derived($modalBounds ? $modalBounds.height - 238 : 0);
  let bodyHeight = $derived($modalBounds ? $modalBounds.height - 94 : 0);

  let previewer: HTMLDivElement;
  let maskBounds = $state({ width: 0, height: 0 });

  let webviews: any[] = $state([]);

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

  let isValidName = $derived($themeNameError === "");
  let isValidAuthor = $derived($themeAuthorError === "");
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
          {#snippet toolBar()}
            <toolBarElem>
              <ButtonTool
                normalBgColor="tarsparent"
                onClick={creatorTheme.togglePreviewVisible}
              >
                {#if $creatorTheme.previewMaskVisible}
                  <RadioChecked color="var(--text)" size="14" />
                {:else}
                  <RadioNormal color="var(--text)" size="14" />
                {/if}
              </ButtonTool>
            </toolBarElem>
          {/snippet}
          {#snippet children()}
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
                preload={preloadPath}
                style={`
                    user-select: none;
                    width: 1099px;
                    height: 609px;
                  `}
                title="Figma recent files"
                src="https://www.figma.com/files/recent"
              ></webview>
              <webview
                bind:this={webviews[1]}
                preload={preloadPath}
                style={`
                    user-select: none;
                    width: 1099px;
                    height: 609px;
                  `}
                title="Figma recent files"
                src="https://www.figma.com/files/recent"
              ></webview>
              <webview
                bind:this={webviews[2]}
                preload={preloadPath}
                style={`
                    user-select: none;
                    width: 1099px;
                    height: 609px;
                  `}
                title="Figma recent files"
                src="https://www.figma.com/files/recent"
              ></webview>
              <webview
                bind:this={webviews[3]}
                preload={preloadPath}
                style={`
                    user-select: none;
                    width: 1099px;
                    height: 609px;
                  `}
                title="Figma recent files"
                src="https://www.figma.com/files/recent"
              ></webview>
            </iframeView>
          {/snippet}
          {#snippet layout_1()}
            <Tutorial />
          {/snippet}
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
  toolBarElem {
    display: flex;
    background-color: var(--bg-panel);
    border: 1px solid var(--borders);
    padding: 6px;
    border-radius: 3px;
  }
</style>
