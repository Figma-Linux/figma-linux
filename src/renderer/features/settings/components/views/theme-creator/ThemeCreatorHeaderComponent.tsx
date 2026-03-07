import { Flex } from 'Shared/components/ui/containers';
import { Button } from 'Shared/components/ui/buttons';
import { Menu, Reset, Plus, Download, Save2 } from 'Shared/components/icons';
import { Popup } from 'Shared/components/ui/containers';
import { creatorThemeStore, themesStore, creatorsThemesStore } from '../../../stores';
import { validateThemeName, validateThemeAuthor } from '../../../validators';
import styles from './ThemeCreatorHeaderComponent.module.css';

export function ThemeCreatorHeaderComponent() {
  const api = window.settingsAPI;

  const onReset = () => {
    creatorThemeStore.reset();
  };

  const onResetTemplate = () => {
    const themeId = creatorThemeStore.get().loadedTemplateId;
    if (!themeId) return;

    const allThemes = [...themesStore.get(), ...creatorsThemesStore.get()];
    const theme = allThemes.find((t) => t.id === themeId);

    if (theme) {
      creatorThemeStore.setPaletteTheme(structuredClone(theme));
    }
  };

  const onAddToThemes = () => {
    const state = creatorThemeStore.get();
    if (!validateThemeName(state.theme.name)) return;
    if (!validateThemeAuthor(state.theme.author)) return;

    api.themeCreatorAddTheme(state.theme);
    creatorThemeStore.reset();
  };

  const onExport = () => {
    const state = creatorThemeStore.get();
    if (!validateThemeName(state.theme.name)) return;
    if (!validateThemeAuthor(state.theme.author)) return;

    api.themeCreatorExportTheme(state.theme.id);
  };

  return (
    <Flex>
      <Button size={32} round={3} margin="0 4px" hoverBgColor="var(--borders)" onClick={onReset}>
        <Reset color="var(--text)" size="16" />
      </Button>
      <Button size={32} round={3} margin="0 4px" hoverBgColor="var(--borders)" onClick={onAddToThemes}>
        <Plus color="var(--text)" size="16" />
      </Button>
      <Button size={32} round={3} margin="0 4px" hoverBgColor="var(--borders)" onClick={onExport}>
        <Download color="var(--text)" size="16" />
      </Button>
      <Flex width="10px" />
    </Flex>
  );
}
