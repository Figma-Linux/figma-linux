import { For, createMemo, Show } from 'solid-js';
import { DropDown, Flex, Grid } from 'Shared/components/ui/containers';
import { themeStore } from 'Shared/stores';
import { DEFAULT_THEME } from 'Const';
import {
  themesStore,
  creatorsThemesStore,
  creatorThemeStore,
  settingsStore,
  modalBoundsStore,
} from '../../../stores';
import { ThemeItem } from './ThemeItem';
import styles from './ThemesView.module.css';

interface ThemesViewProps {
  zIndex: number;
  onSetTabViewIndex?: (detail: { index: number }) => void;
}

export function ThemesView(props: ThemesViewProps) {
  const api = window.settingsAPI;

  const isCreatorThemesEmpty = createMemo(() => creatorsThemesStore.get().length === 0);
  const isThemesEmpty = createMemo(() => themesStore.get().length === 0);

  const onApplyTheme = (themeId: string) => {
    const allThemes = [...themesStore.get(), ...creatorsThemesStore.get()];
    const theme: Themes.Theme = structuredClone(allThemes.find((t) => t.id === themeId));

    api.changeTheme(theme);
    settingsStore.update((s) => {
      s.theme.currentTheme = themeId;
    });
  };

  const onDeleteTheme = (themeId: string) => {
    api.themeCreatorRemoveTheme(themeId);

    const currentTheme = themeStore.get();
    if (currentTheme && themeId === currentTheme.id) {
      onApplyTheme(DEFAULT_THEME.id);
    }
  };

  const onEditTheme = (themeId: string) => {
    const theme: Themes.Theme = structuredClone(
      creatorsThemesStore.get().find((t) => t.id === themeId)
    );

    creatorThemeStore.setEditTheme(theme);
    props.onSetTabViewIndex?.({ index: 2 });
  };

  const onUseColorPalette = (themeId: string) => {
    const allThemes = [...themesStore.get(), ...creatorsThemesStore.get()];
    const theme: Themes.Theme = structuredClone(allThemes.find((t) => t.id === themeId));

    creatorThemeStore.setPaletteTheme(theme);
    props.onSetTabViewIndex?.({ index: 2 });
  };

  const zoomViewHeight = createMemo(() => {
    const bounds = modalBoundsStore.get();
    return bounds ? bounds.height - 94 : 0;
  });

  return (
    <div class={styles.container} style={{ 'z-index': props.zIndex, height: `${zoomViewHeight()}px` }}>
      <DropDown
        title="ThemeCreator's themes"
        isEmpty={isCreatorThemesEmpty()}
        open={settingsStore.get().app.creatorsThemesDropdownOpen}
        onOpenChange={(open) =>
          settingsStore.update((s) => {
            s.app.creatorsThemesDropdownOpen = open;
          })
        }
      >
        <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="2vmin" padding="12px 0 0 0">
          <Show when={creatorsThemesStore.get().length > 0}>
            <For each={creatorsThemesStore.get()}>
              {(theme) => (
                <ThemeItem
                  onDeleteTheme={() => onDeleteTheme(theme.id)}
                  onEditTheme={() => onEditTheme(theme.id)}
                  onUseColorPalette={() => onUseColorPalette(theme.id)}
                  onApplyTheme={() => onApplyTheme(theme.id)}
                  theme={theme}
                  canDelete
                  canEdit
                  currentThemeId={settingsStore.get().theme.currentTheme}
                />
              )}
            </For>
            <Show when={creatorsThemesStore.get().length < 6}>
              <For each={Array(6 - creatorsThemesStore.get().length)}>
                {() => <div class={styles.themeFake} />}
              </For>
            </Show>
          </Show>
        </Grid>
      </DropDown>
      <Flex height="20px" />
      <DropDown
        title="Repository themes"
        isEmpty={isThemesEmpty()}
        open={settingsStore.get().app.themeDropdownOpen}
        onOpenChange={(open) =>
          settingsStore.update((s) => {
            s.app.themeDropdownOpen = open;
          })
        }
      >
        <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="2vmin" padding="12px 0 0 0">
          <Show when={themesStore.get().length > 0}>
            <For each={themesStore.get()}>
              {(theme) => (
                <ThemeItem
                  onUseColorPalette={() => onUseColorPalette(theme.id)}
                  onApplyTheme={() => onApplyTheme(theme.id)}
                  theme={theme}
                  currentThemeId={settingsStore.get().theme.currentTheme}
                />
              )}
            </For>
            <Show when={themesStore.get().length < 6}>
              <For each={Array(6 - themesStore.get().length)}>
                {() => <div class={styles.themeFake} />}
              </For>
            </Show>
          </Show>
        </Grid>
      </DropDown>
    </div>
  );
}
