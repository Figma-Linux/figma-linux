declare namespace SvelteEvents {
  interface Empty {}

  interface ApplyTheme {
    themeId: string;
  }
  interface SetSettingsTabViewIndex {
    index: number;
  }
}
