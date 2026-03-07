import { For, createSignal } from 'solid-js';
import { Flex } from 'Shared/components/ui/containers';
import { Text } from 'Shared/components/ui/text';
import { ColorPicker } from 'Shared/components/ui/inputs';
import { PALETTE_TEXT } from 'Const';
import { creatorThemeStore } from '../../../stores';
import styles from './ColorPalette.module.css';

export function ColorPalette() {
  const paletteKeys = () => Object.keys(creatorThemeStore.get().theme.palette);

  const handleColorChange = (key: string, value: string) => {
    creatorThemeStore.setColor(key, value);
  };

  return (
    <div class={styles.container}>
      <For each={paletteKeys()}>
        {(paletteKey) => (
          <>
            <Flex>
              <ColorPicker
                size={24}
                key={paletteKey}
                value={(creatorThemeStore.get().theme.palette as any)[paletteKey]}
                onValueChange={(value) => handleColorChange(paletteKey, value)}
              />
              <Flex width="10px" />
              <Text>{(PALETTE_TEXT as any)[paletteKey] ?? paletteKey}</Text>
            </Flex>
            <Flex height="6px" />
          </>
        )}
      </For>
    </div>
  );
}
