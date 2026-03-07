import { createMemo, Show } from 'solid-js';
import { getColorPallet } from 'Utils/Render';
import { Text, Label } from 'Shared/components/ui/text';
import { Flex, FlexItem, Rotate } from 'Shared/components/ui/containers';
import { PrimaryButton, ButtonTool } from 'Shared/components/ui/buttons';
import {
  Burger,
  Hand,
  Component,
  Download,
  Pencil2,
  RadioNormal,
  RadioChecked,
  Delete,
} from 'Shared/components/icons';
import styles from './ThemeItem.module.css';

interface ThemeItemProps {
  canEdit?: boolean;
  canDelete?: boolean;
  currentThemeId?: string;
  theme: Themes.Theme;
  onApplyTheme?: () => void;
  onDeleteTheme?: () => void;
  onEditTheme?: () => void;
  onUseColorPalette?: () => void;
}

export function ThemeItem(props: ThemeItemProps) {
  const isSelected = createMemo(() => props.currentThemeId === props.theme.id);
  const paletteStyle = createMemo(() => getColorPallet(props.theme).join(';'));

  return (
    <div>
      <div
        class={styles.themeviewItemTumbl}
        onMouseUp={props.onApplyTheme}
        style={paletteStyle()}
      >
        <div class={styles.themeviewItemTumblTop} />
        <div class={styles.themeviewItemTumblToolpanel}>
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
        <div class={styles.themeviewItemTumblBody}>
          <div class={styles.themeviewItemTumblBodyLeft}>
            <div class={styles.themeviewItemTumblBodyLeftText1} />
            <div class={styles.themeviewItemTumblBodyLeftText2} />
          </div>
          <div class={styles.themeviewItemTumblBodyCenter} />
          <div class={styles.themeviewItemTumblBodyRight} />
        </div>
      </div>
      <Flex
        padding="14px"
        borderLeft="1px solid var(--borders)"
        borderRight="1px solid var(--borders)"
        borderBottom="1px solid var(--borders)"
        borderRadius="0 0 6px 6px"
      >
        <FlexItem grow={2}>
          <Flex direction="column">
            <Label padding="0">{props.theme.name}</Label>
            <Text>{props.theme.author}</Text>
          </Flex>
        </FlexItem>
        <FlexItem grow={1}>
          <Flex alignItems="center" justifyContent="end" height="100%">
            <Show when={props.canEdit}>
              <ButtonTool normalBgColor="transparent" onClick={props.onEditTheme}>
                <Pencil2 color="var(--text)" size="16" />
              </ButtonTool>
            </Show>
            <Flex width="10px" />
            <ButtonTool normalBgColor="transparent" onClick={props.onUseColorPalette}>
              <Rotate deg={-90}>
                <Download color="var(--text)" size="16" />
              </Rotate>
            </ButtonTool>
            <Flex width="10px" />
            <ButtonTool normalBgColor="transparent" onClick={props.onApplyTheme}>
              {isSelected() ? (
                <RadioChecked color="var(--text)" />
              ) : (
                <RadioNormal color="var(--text)" />
              )}
            </ButtonTool>
            <Show when={props.canDelete}>
              <Flex width="20px" />
              <ButtonTool normalBgColor="transparent" onClick={props.onDeleteTheme}>
                <Delete color="var(--text)" size="18" />
              </ButtonTool>
            </Show>
          </Flex>
        </FlexItem>
      </Flex>
    </div>
  );
}
