declare namespace Store {
  interface CreatorThemeStore {
    state: "new" | "edit";
    previewMaskVisible: boolean;
    zoom: number;
    theme: Themes.Theme;
  }

  interface InputErrors {
    themeNameError: string;
    authorNameError: string;
  }
}
