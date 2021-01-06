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
    /**
     * text color
     */
    text: string;
    /**
     * active text color
     */
    "text-active": string;
    /**
     * disabled text color
     */
    "text-disabled": string;
    /**
     * bg color of panels and a page bg
     */
    "bg-panel": string;
    /**
     * tool bar bg color
     */
    "bg-toolbar": string;
    /**
     * tool bar item bg color on hover
     */
    "bg-toolbar-hover": string;
    /**
     * share button, selected tool bar item, other selections color
     */
    "bg-toolbar-active": string;
    /**
     * tool bar icons color
     */
    "fg-toolbar": string;
    /**
     * tool bar icons color on hover
     */
    "fg-toolbar-hover": string;
    /**
     * tool bar active icon color
     */
    "fg-toolbar-active": string;
    /**
     * tool bar disabled icon color
     */
    "fg-toolbar-disabled": string;
    /**
     * tool bar name of project text color
     */
    "fg-toolbar-filename": string;
    /**
     * tool bar name of folder project text color
     */
    "fg-toolbar-foldername": string;
    /**
     * tool bar chevron color
     */
    "fg-toolbar-chevron": string;
    /**
     * unsaved icon color
     */
    "fg-toolbar-unsavedicon": string;
    /**
     * tool bar login button color
     */
    "fg-toolbar-login-button": string;
    /**
     * tool bar login button border color
     */
    "fg-toolbar-login-button-border": string;
    /**
     * tool bar active login button color
     */
    "fg-toolbar-login-button-active": string;
    /**
     * tool bar search input placeholder color
     */
    "fg-toolbar-placeholder": string;
    /**
     * tool bar item dropdown menu bg color
     */
    "bg-overlay": string;
    /**
     * tool bar item dropdown menu outline shadow color
     */
    "bg-overlay-outline": string;
    /**
     * tool bar item dropdown menu border color
     */
    "bg-overlay-inner-outline": string;
    "bg-tab": string;
    "bg-tab-hover": string;
    "bg-tab-active": string;
    "fg-tab": string;
    "fg-tab-hover": string;
    "fg-tab-active": string;
    "bg-header": string;
    "fg-header": string;
    "bg-header-control": string;
    "bg-header-control-hover": string;
    "bg-header-control-active": string;
    "fg-header-control": string;
    "fg-header-control-hover": string;
    "fg-header-control-active": string;
    "panel-divider": string;
    "fg-component": string;
    "fg-component-disabled": string;
    "fg-component-disabled-row-active": string;
    borders: string;
    "bg-window-close": string;
    "bg-beta-label": string;
    [index: string]: string;
  }
}

interface CSSStyleDeclaration {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any;
}
