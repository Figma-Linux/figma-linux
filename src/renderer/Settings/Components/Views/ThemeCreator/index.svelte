<script lang="ts">
  import { Text, Label, Flex, Grid, ZoomView, HeaderModal } from "Common";
  import { InputText, InputRange } from "Common/Input";
  import { getColorPallet } from "Utils/Render";
  import { creatorTheme, modalBounds } from "../../../store";

  import Preview from "./Preview.svelte";
  import ColorPalette from "./ColorPalette.svelte";

  $: zoomViewHeight = $modalBounds.height - 238;

  let textValue = "";
  let zoom = 1;
</script>

<div>
  <Grid columns="1fr 2vmin 35vmin">
    <Flex der="column">
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
        <Flex der="column" alignItems="center" justifyContent="center">
          <Text padding="8px 0 0 0">{Math.floor(zoom * 100)}%</Text>
        </Flex>
      </Flex>
    </Flex>
    <Flex />
    <Flex der="column" justifyItems="stretch" width="-webkit-fill-available">
      <Label>Color Palette</Label>
      <colorPaletteDiv style={`height: ${zoomViewHeight + 90}px; overflow: auto;`}>
        <ColorPalette bind:creatorTheme={$creatorTheme} />
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
</style>
