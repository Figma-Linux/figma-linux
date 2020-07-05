declare namespace Themes {
  interface CSSRuleListCustom extends CSSRuleList, IterableIterator<CSSStyleRule> {}

  interface ColorsMap {
    [property: string]: string;
  }

  interface Palette {
    panel: string;
    panelRowOnHover: string;
    panelRowActive: string;
    panelRowChildActive: string;
    panelDivider: string;
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
  }
}

interface CSSStyleDeclaration {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any;
}
