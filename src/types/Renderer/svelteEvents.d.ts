declare namespace SvelteEvents {
  interface Empty {}

  interface ApplyTheme {
    themeId: string;
  }
  interface SetSettingsTabViewIndex {
    index: number;
  }
  interface InputColorClick {
    input: HTMLInputElement;
    button: number;
    value: string;
    key: string;
  }
}
