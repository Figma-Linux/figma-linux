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
  }
}

interface CSSStyleDeclaration {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any;
}
