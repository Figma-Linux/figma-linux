declare namespace Store {
  interface CreatorThemeStore {
    state: "new" | "edit";
    theme: Themes.Theme;
  }
}
