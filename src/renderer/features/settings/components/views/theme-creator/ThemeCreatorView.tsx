import { createMemo, createSignal, onMount } from 'solid-js';
import { Text, Label } from 'Shared/components/ui/text';
import { Flex, Grid, ZoomView } from 'Shared/components/ui/containers';
import { ButtonTool } from 'Shared/components/ui/buttons';
import { RadioNormal, RadioChecked } from 'Shared/components/icons';
import { TextInput, Range } from 'Shared/components/ui/inputs';
import { getColorPallet } from 'Utils/Render';
import {
  settingsStore,
  creatorThemeStore,
  modalBoundsStore,
  inputErrorsStore,
} from '../../../stores';
import { validateThemeName, validateThemeAuthor } from '../../../validators';
import { ColorPalette } from './ColorPalette';
import styles from './ThemeCreatorView.module.css';

interface ThemeCreatorViewProps {
  zIndex: number;
  onSetTabViewIndex?: (detail: { index: number }) => void;
}

export function ThemeCreatorView(props: ThemeCreatorViewProps) {
  const [maskBounds, setMaskBounds] = createSignal({ width: 0, height: 0 });

  const zoomViewHeight = createMemo(() => {
    const bounds = modalBoundsStore.get();
    return bounds ? bounds.height - 238 : 0;
  });

  const bodyHeight = createMemo(() => {
    const bounds = modalBoundsStore.get();
    return bounds ? bounds.height - 94 : 0;
  });

  const isValidName = createMemo(() => inputErrorsStore.themeNameError.get() === '');
  const isValidAuthor = createMemo(() => inputErrorsStore.themeAuthorError.get() === '');

  const handleZoomChange = (zoom: number) => {
    creatorThemeStore.update((s) => {
      s.zoom = zoom;
    });
  };

  const handleMaskActiveChange = (active: boolean) => {
    creatorThemeStore.update((s) => {
      s.previewMaskVisible = active;
    });
  };

  return (
    <div class={styles.container} style={{ 'z-index': props.zIndex, height: `${bodyHeight()}px` }}>
      <Grid columns="1fr 2vmin 35vmin">
        <Flex direction="column">
          <Flex>
            <Flex direction="column" width="-webkit-fill-available">
              <Label>Enter name of new theme</Label>
              <TextInput
                value={creatorThemeStore.get().theme.name}
                onValueChange={(value) =>
                  creatorThemeStore.update((s) => {
                    s.theme.name = value;
                  })
                }
                validator={validateThemeName}
                placeholder="Theme name"
                isValid={isValidName()}
              />
              <Flex height="20px">
                <Text size="12px" color="var(--bg-window-close)">
                  {inputErrorsStore.themeNameError.get()}
                </Text>
              </Flex>
            </Flex>
            <Flex width="120px" />
            <Flex direction="column" width="-webkit-fill-available">
              <Label>Enter your name as author</Label>
              <TextInput
                value={creatorThemeStore.get().theme.author}
                onValueChange={(value) =>
                  creatorThemeStore.update((s) => {
                    s.theme.author = value;
                  })
                }
                validator={validateThemeAuthor}
                placeholder="Author name"
                isValid={isValidAuthor()}
              />
              <Flex height="20px">
                <Text size="12px" color="var(--bg-window-close)">
                  {inputErrorsStore.themeAuthorError.get()}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex direction="column">
            <ZoomView
              minZoom={0.2}
              maxZoom={1.5}
              maskBounds={maskBounds()}
              zoom={creatorThemeStore.get().zoom}
              isMaskActive={creatorThemeStore.get().previewMaskVisible}
              onZoomChange={handleZoomChange}
              onMaskActiveChange={handleMaskActiveChange}
              height={`${zoomViewHeight()}px`}
              toolBar={
                <div class={styles.toolBarElem}>
                  <ButtonTool
                    normalBgColor="transparent"
                    onClick={() => creatorThemeStore.togglePreviewVisible()}
                  >
                    {creatorThemeStore.get().previewMaskVisible ? (
                      <RadioChecked color="var(--text)" size="14" />
                    ) : (
                      <RadioNormal color="var(--text)" size="14" />
                    )}
                  </ButtonTool>
                </div>
              }
            >
              <div
                class={styles.iframeView}
                style={getColorPallet(creatorThemeStore.get().theme).join(';')}
              >
                <div class={styles.previewPlaceholder}>
                  <Text>Theme Preview</Text>
                  <Text size="12px">Adjust colors using the palette on the right</Text>
                </div>
              </div>
            </ZoomView>
            <Flex height="10px" />
            <Range
              value={creatorThemeStore.get().zoom}
              min={0.2}
              max={1.5}
              step={0.05}
              onValueChange={handleZoomChange}
            />
            <Flex direction="column" alignItems="center" justifyContent="center">
              <Text padding="8px 0 0 0">
                {Math.floor(creatorThemeStore.get().zoom * 100)}%
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex />
        <Flex direction="column" justifyItems="stretch" width="-webkit-fill-available">
          <Label>Color Palette</Label>
          <div
            class={styles.colorPaletteDiv}
            style={{ height: `${zoomViewHeight() + 90}px`, overflow: 'auto' }}
          >
            <ColorPalette />
          </div>
        </Flex>
      </Grid>
    </div>
  );
}
