declare namespace Themes {
  interface CSSRuleListCustom extends CSSRuleList, IterableIterator<CSSStyleRule> {}

  interface ColorsMap {
    [property: string]: string;
  }

  interface Theme {
    name: string;
    author: string;
    id: string;
    url?: string;
    palette: Palette;
  }

  interface Palette {
    "bg-toolbar": string;
    "bg-primary-btn": string;
    "bg-toolbar-hover": string;
    "bg-toolbar-active": string;
    "fg-toolbar": string;
    "fg-toolbar-hover": string;
    "fg-toolbar-active": string;
    "fg-toolbar-disabled": string;
    "fg-toolbar-filename": string;
    "fg-toolbar-foldername": string;
    "fg-toolbar-chevron": string;
    "fg-toolbar-unsavedicon": string;
    "fg-toolbar-login-button": string;
    "fg-toolbar-login-button-border": string;
    "fg-toolbar-login-button-active": string;
    "fg-toolbar-placeholder": string;
    "bg-overlay": string;
    "bg-overlay-active": string;
    "bg-overlay-outline": string;
    "bg-overlay-inner-outline": string;
    "fg-overlay": string;
    "fg-overlay-active": string;
    "fg-overlay-secondary": string;
    "fg-overlay-sep": string;
    "fg-overlay-right": string;
    "bg-tab": string;
    "bg-tab-hover": string;
    "bg-tab-active": string;
    "bg-tab-text": string;
    "bg-tab-text-hover": string;
    "bg-tab-text-active": string;
    "bg-header": string;
    "bg-header-text": string;
    "bg-header-control": string;
    "bg-header-control-hover": string;
    "bg-header-control-active": string;
    "bg-header-control-text": string;
    "bg-header-control-text-hover": string;
    "bg-header-control-text-active": string;

    panel: string;
    panelRowOnHover: string;
    panelRowActive: string;
    panelRowChildActive: string;
    panelDivider: string;
    panelDividerBoxShadowTop: string;
    panelDividerBoxShadowRight: string;
    text: string;
    textCode: string;
    textActive: string;
    textDisabled: string;
    textDisabledRowActive: string;
    textComponent: string;
    textComponentDisabled: string;
    textComponentDisabledRowActive: string;
    toolbarBg: string;
    inputFocus: string;
    iconButtonHover: string;
    titleBorder: string;
    titleBorderBoxShadow: string;
    black1: string;
    black2: string;
    black3: string;
    black4: string;
    black5: string;
    black6: string;
    black7: string;
    black8: string;
    black9: string;
    white1: string;
    white2: string;
    white3: string;
    white4: string;
    white5: string;
    white6: string;
    white7: string;
    windowClose: string;
    betaLabel: string;
    [index: string]: string;
  }
}

interface CSSStyleDeclaration {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any;
}
