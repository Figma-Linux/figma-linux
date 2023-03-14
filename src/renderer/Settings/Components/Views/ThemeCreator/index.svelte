<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "path";
  import { Text, Label, Flex, Grid, ZoomView } from "Common";
  import { InputText, InputRange } from "Common/Input";
  import { getColorPallet } from "Utils/Render";
  import { creatorTheme, modalBounds } from "../../../store";

  import Preview from "./Preview.svelte";
  import ColorPalette from "./ColorPalette.svelte";

  $: zoomViewHeight = $modalBounds.height - 238;

  let zoom = 1;
  let webview: any;

  onMount(() => {
    webview.addEventListener("dom-ready", () => {
      webview.openDevTools();
      setTimeout(() => {
        webview.send("getThemeCreatorPalette", $creatorTheme.theme.palette);

        creatorTheme.subscribe((store) => {
          if (!webview) {
            return;
          }
          webview.send("getThemeCreatorPalette", store.theme.palette);
        });
      }, 1000);
    });
  });
</script>

<div>
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
        <ZoomView bind:zoom height={`${zoomViewHeight}px`}>
          <iframeView>
            <webview
              bind:this={webview}
              preload={`file://${resolve(
                process.cwd(),
                "dist/renderer",
                "themePreviewPreload.js",
              )}`}
              style={`
                ${getColorPallet($creatorTheme.theme).join(";")};
                width: 1099px;
                height: 609px;
              `}
              title="Figma recent files"
              src="https://www.figma.com/files/recent"
            />
            <!-- <webview
              preload={`file://${resolve(process.cwd(), "dist/renderer", "themePreviewPreload.js")}`}
              style={`
                ${getColorPallet($creatorTheme.theme).join(";")};
                width: 1099px;
                height: 609px;
              `}
              title="Figma recent files"
              src="https://www.figma.com/files/recent"
            />
            <webview
              preload={`file://${resolve(process.cwd(), "dist/renderer", "themePreviewPreload.js")}`}
              style={`
                ${getColorPallet($creatorTheme.theme).join(";")};
                width: 1099px;
                height: 609px;
              `}
              title="Figma recent files"
              src="https://www.figma.com/files/recent"
            />
            <webview
              preload={`file://${resolve(process.cwd(), "dist/renderer", "themePreviewPreload.js")}`}
              style={`
                ${getColorPallet($creatorTheme.theme).join(";")};
                width: 1099px;
                height: 609px;
              `}
              title="Figma recent files"
              src="https://www.figma.com/files/recent"
            /> -->
          </iframeView>
          <!-- <div style={getColorPallet($creatorTheme.theme).join(";")}>
            <Preview />
          </div> -->
        </ZoomView>
        <Flex height="10px" />
        <InputRange bind:value={zoom} min={0.2} max={1.5} step={0.05} />
        <Flex der="column" alignItems="center" justifyContent="center">
          <Text padding="8px 0 0 0">{Math.floor(zoom * 100)}%</Text>
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
    padding: 32px 32px 8px 32px;
  }
  colorPaletteDiv {
    display: block;
  }
  iframeView {
    display: grid;
    grid-template-columns: auto auto;
    gap: 2vmin;
  }
</style>
