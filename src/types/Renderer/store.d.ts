declare namespace Store {
  interface CreatorThemeStore {
    state: "new" | "edit";
    previewMaskVisible: boolean;
    theme: Themes.Theme;
  }
}
