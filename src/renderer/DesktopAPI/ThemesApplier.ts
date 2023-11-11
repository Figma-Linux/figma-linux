import * as E from "electron";
import { DEFAULT_THEME, SELECTORS_TO_IGNORE, PROPS_WITH_COLOR, CHROME_GPU } from "Const";
import { getColorsMap, variablesColorsMap } from "Utils/Common";

export class ThemesApplier {
  private currentTheme: Themes.Theme;
  private targetElements: Set<HTMLElement | CSSStyleRule> = new Set();

  constructor() {
    this.currentTheme = structuredClone(DEFAULT_THEME);

    E.ipcRenderer.invoke("themesIsDisabled").then((disabled) => {
      if (disabled) {
        return;
      }

      this.registerEvents();
    });
  }

  private registerEvents() {
    E.ipcRenderer.on("loadCurrentTheme", (_, theme) => {
      this.changePalette(theme);
    });
  }
  public registerEventsForPreview() {
    E.ipcRenderer.on("getThemeCreatorPalette", (_, palette: Themes.Palette) => {
      this.applyPalette(palette);
    });
  }

  private changePalette(theme: Themes.Theme) {
    this.currentTheme = theme;

    this.setThemeVariables();
  }

  private getCoreStylesheet(): Themes.CSSRuleListCustom {
    const css: any = document.styleSheets;
    let coreStylesheet;

    Object.keys(css).forEach((key) => {
      const cssFileUrl = css[key].href;

      if (cssFileUrl && cssFileUrl.includes("figma_app")) {
        coreStylesheet = css[key].cssRules;
      }
    });

    return coreStylesheet;
  }
  private isRuleIgnored(selector: string): boolean {
    let isMatch = false;

    SELECTORS_TO_IGNORE.forEach((query) => {
      if (selector.includes(query)) {
        isMatch = true;
      }
    });

    return isMatch;
  }

  private setThemeVariables() {
    for (const el of this.targetElements) {
      this.applyPalette(this.currentTheme.palette, el);
    }
  }
  private applyPalette(palette: Themes.Palette, el: HTMLElement | CSSStyleRule = document.body) {
    const keys = Object.keys(palette);

    for (const key of keys) {
      const value = palette[key];
      el.style.setProperty(`--${key}`, value);

      if (key === "bg-header-control") {
        el.style.setProperty("--color-bg-toolbar-secondary", value);
        // el.style.setProperty("--bg-overlay-active", value);
        el.style.setProperty("--color-bg-toolbar-tertiary", value);
      }
      if (key === "bg-toolbar-active") {
        el.style.setProperty("--bg-primary-btn", value);
        el.style.setProperty("--color-bg-brand", value);
        // el.style.setProperty("--bg-overlay-active", value);
        el.style.setProperty("--color-border-toolbar-selected", value);
        el.style.setProperty("--color-bg-toolbar-selected", value);
        el.style.setProperty("--color-border-selected", value);
        el.style.setProperty("--color-bg-menu-selected", value);
        el.style.setProperty("--color-bg-menu-selected-hover", value);
        el.style.setProperty("--color-bg-menu-selected-pressed", value);
      }
      if (key === "fg-overlay") {
        el.style.setProperty("--color-icon-menu", value);
      }
      if (key === "bg-toolbar-hover") {
        el.style.setProperty("--color-bg-toolbar-hover", value);
      }
      if (key === "fg-tab-hover") {
        el.style.setProperty("--color-text-toolbar-hover", value);
      }
      if (key === "fg-overlay") {
        el.style.setProperty("--fg-overlay", value);
        el.style.setProperty("--fg-overlay-right", value);
      }
      if (key === "fg-toolbar") {
        el.style.setProperty("--color-icon-toolbar", value);
        el.style.setProperty("--color-text-toolbar-secondary", value);
      }
      if (key === "fg-toolbar-hover") {
        el.style.setProperty("--color-icon-toolbar-hover", value);
      }
      if (key === "fg-toolbar-active") {
        el.style.setProperty("--fg-overlay-active", value);
        el.style.setProperty("--color-text-menu-hover", value);
        el.style.setProperty("--color-icon-toolbar-onselected", value);
        el.style.setProperty("--color-text-onbrand", value);
        // el.style.setProperty("--color-icon-toolbar", value);
        el.style.setProperty("--color-icon-toolbar-tertiary", value);
        el.style.setProperty("--color-icon-toolbar-hover", value);
      }
      if (key === "text-disabled") {
        el.style.setProperty("--fg-overlay-secondary", value);
        el.style.setProperty("--fg-toolbar-placeholder", value);
        el.style.setProperty("--color-icon-disabled", value);
      }
      if (key === "borders") {
        el.style.setProperty("--fg-overlay-sep", value);
        el.style.setProperty("--color-border-toolbar", value);
      }
      if (key === "text") {
        el.style.setProperty("--color-icon", value);
        el.style.setProperty("--color-icon-brand", value);
        el.style.setProperty("--color-icon-secondary", value);
        el.style.setProperty("--color-icon-tertiary", value);
      }
      if (key === "text-active") {
        el.style.setProperty("--color-icon-hover", value);
        el.style.setProperty("--color-text-secondary-hover", value);
        el.style.setProperty("--color-text-hover", value);
        el.style.setProperty("--color-icon-onselected", value);
      }
      if (key === "bg-panel-hover") {
        el.style.setProperty("--color-bg-pressed", value);
        el.style.setProperty("--color-bg-tertiary", value);
      }
      if (key === "fg-component") {
        el.style.setProperty("--color-icon-component", value);
        el.style.setProperty("--color-text-component", value);
      }
      if (key === "fg-component-disabled") {
        el.style.setProperty("--color-icon-component-secondary", value);
        el.style.setProperty("--color-text-component-secondary", value);
        el.style.setProperty("--color-icon-component-tertiary", value);
        el.style.setProperty("--color-text-component-tertiary", value);
      }
      if (key === "bg-beta-label") {
        el.style.setProperty("--color-bg-info", value);
      }
    }

    el.style.setProperty("background-color", "var(--bg-panel)");

    el.style.setProperty("--color-bg", "var(--bg-panel)");
    el.style.setProperty("--color-bg-toolbar", "var(--bg-toolbar)");
    el.style.setProperty("--color-bg-selected", "var(--bg-panel)");
    el.style.setProperty("--color-text", "var(--text)");
    el.style.setProperty("--color-text-secondary", "var(--text)");
    el.style.setProperty("--color-border", "var(--borders)");
    el.style.setProperty("--color-border-menu", "var(--borders)");
    el.style.setProperty("--color-conditionalborder", "var(--borders)");
    el.style.setProperty("--color-border-tooltip", "var(--borders)");
    el.style.setProperty("--color-text-disabled", "var(--text-disabled)");
    el.style.setProperty("--color-bg-selected-secondary", "var(--bg-panel)");
    el.style.setProperty("--color-bg-selected", "var(--bg-panel-hover)");
    el.style.setProperty("--color-text-toolbar", "var(--text)");
    el.style.setProperty("--color-bg-hover", "var(--bg-panel-hover)");
    el.style.setProperty("--color-bg-secondary", "var(--bg-panel-hover)");
    el.style.setProperty("--color-bg-tooltip", "var(--bg-overlay)");
    el.style.setProperty("--ui2-button-color-bg-disabled", "var(--borders)");
  }

  public init() {
    this.targetElements.add(document.body);

    const figmaCoreStylesheet = this.getCoreStylesheet();
    if (location.href.match(CHROME_GPU)) {
      const newStyles = document.createElement("style");
      newStyles.innerText = "html { background-color: cadetblue; }";

      document.head.appendChild(newStyles);
    }

    if (!figmaCoreStylesheet) {
      return;
    }

    const colorsMap = getColorsMap(this.currentTheme.palette);
    const additionStyleRules: string[] = [
      "#react-page { background-color: var(--bg-panel); }",
      `span[class*="action_option--shortcut"] { color: var(--fg-overlay); }`,
      `div[class*="file_browser_page_view"] { background-color: var(--bg-panel) !important; }`,
      `input[class*="sidebar_search--searchInput"]::placeholder { color: var(--text-active); }`,
    ];

    this.setThemeVariables();

    for (const cssRule of figmaCoreStylesheet) {
      if (cssRule.selectorText != undefined && this.isRuleIgnored(cssRule.selectorText) === false) {
        if (
          (cssRule.style != undefined && cssRule.style.color != "") ||
          cssRule.style.backgroundColor != "" ||
          cssRule.style.fill != "" ||
          cssRule.style.stroke != "" ||
          cssRule.style.boxShadow != "" ||
          cssRule.style.borderBottomColor != "" ||
          cssRule.style.borderRightColor != "" ||
          cssRule.style.borderTopColor != "" ||
          cssRule.style.borderLeftColor != ""
        ) {
          PROPS_WITH_COLOR.forEach((colorProp) => {
            const colorValue = cssRule.style[colorProp];

            if (colorValue != "" && Object.prototype.hasOwnProperty.call(colorsMap, colorValue)) {
              cssRule.style[colorProp] = `${variablesColorsMap[colorValue]}`;
            }
          });
        }

        if (
          /option_button--toggled|segmented_control--segmentSelected/.test(cssRule.selectorText)
        ) {
          cssRule.style["background-color"] = `var(--bg-panel-hover)`;
        }

        if (/searchIcon/.test(cssRule.selectorText)) {
          cssRule.style["fill"] = `var(--fg-toolbar)`;
        }
        if (/base_upgrade_section--content/.test(cssRule.selectorText)) {
          cssRule.style["background-color"] = `var(--borders)`;
        }
        if (/tool_bar--toolBarRightSide|pages_panel--pageRowSelected/.test(cssRule.selectorText)) {
          cssRule.style["fill"] = `var(--text-active)`;
          cssRule.style["background-color"] = `var(--bg-panel-hover)`;
        }
        if (
          /community_hub_link--communityArrow|new_file_creation_topbar--plusIcon|timer_view--plusIcon|delightful_toolbar--verticalButton/.test(
            cssRule.selectorText,
          )
        ) {
          cssRule.style["fill"] = `var(--text-active)`;
        }
        if (
          /new_file_creation_topbar--importIcon|close_button--closeX|new_file_creation_topbar--plusIcon|new_file_creation_topbar--importIcon|option_button--_optionButton|raw_components--_iconButton|object_row--layerIcon|segmented_control--icon/.test(
            cssRule.selectorText,
          )
        ) {
          cssRule.style["color"] = `var(--text-active)`;
          cssRule.style["fill"] = `var(--text-active)`;
        }
        if (
          /search--searchInput__OLD|public-DraftEditorPlaceholder-root|css_builder_color--colorTextSecondary/.test(
            cssRule.selectorText,
          )
        ) {
          cssRule.style["color"] = `var(--text)`;
        }
        if (
          /optionDisabled|formatted_expanding_textarea--placeholder|expanding_textarea--expandingTextarea--*::placeholder/.test(
            cssRule.selectorText,
          )
        ) {
          additionStyleRules.push(`${cssRule.selectorText} { color: var(--text-disabled); }`);
        }
        if (/filename_view--pageTitle/.test(cssRule.selectorText)) {
          cssRule.style["color"] = `var(--fg-header)`;
        }
        if (/starter_kit_ui--option/.test(cssRule.selectorText)) {
          cssRule.style["color"] = `black`;
        }
        if (/.navbar--workspaceSubtitle/.test(cssRule.selectorText)) {
          additionStyleRules.push(`${cssRule.selectorText} { color: var(--fg-header); }`);
        }
        if (/upgrade_section--icon/.test(cssRule.selectorText)) {
          additionStyleRules.push(
            `span[class*="upgrade_section--icon"] > svg > path { fill: var(--text); }`,
          );
        }
        if (
          /user_view--devTokenNew|community_hub_banner--bannerIcon|full_width_page--closeMenu/.test(
            cssRule.selectorText,
          )
        ) {
          additionStyleRules.push(
            `${cssRule.selectorText} svg path { fill: var(--text) !important; }`,
          );
        }
        if (/basic_form--textInput/.test(cssRule.selectorText)) {
          cssRule.style["backgroundColor"] = `var(--bg-panel)`;
        }
        if (
          /step_breadcrumb--stepTitle|account_switcher--dropdownButtonContent|time_display--timeDisplay|.ai_modal--input.+placeholder|colorTextTertiary|css_builder_backgroundColor--colorBgPressed/.test(
            cssRule.selectorText,
          )
        ) {
          cssRule.style["color"] = `var(--text-active)`;
        }
        if (/toolbar_view--shareButton|basic_form--primaryBtn/.test(cssRule.selectorText)) {
          cssRule.style["color"] = `var(--fg-toolbar-active)`;
        }
        if (/time_display--timeInput/.test(cssRule.selectorText)) {
          additionStyleRules.push(`input${cssRule.selectorText} { color: var(--text-disabled) }`);
        }
        if (/.data-preferred-theme=.{3,20}\s?navbar--navbarContainer/.test(cssRule.selectorText)) {
          this.targetElements.add(cssRule);
          this.applyPalette(this.currentTheme.palette, cssRule);
        }
        if (
          /dlt_submenu--chevronButtonIcon|dlt_hoverable_icon--chevron|delightful_toolbar--connectorIcon/.test(
            cssRule.selectorText,
          )
        ) {
          additionStyleRules.push(
            `${cssRule.selectorText} > svg > path { fill: var(--text-active); }`,
          );
        }
        if (
          /file_browser_layout--fileBrowserPageViewContainer|browse_templates_modal/.test(
            cssRule.selectorText,
          )
        ) {
          additionStyleRules.push(
            `${cssRule.selectorText}::-webkit-scrollbar { width: 8px; height: 8px; background: transparent; }`,
          );
          additionStyleRules.push(
            `${cssRule.selectorText}::-webkit-scrollbar-corner { display: none; }`,
          );
          additionStyleRules.push(
            `${cssRule.selectorText}::-webkit-scrollbar-thumb { background: var(--color-scrollbar, rgba(179, 179, 179, 0.5)); border-radius: 10px; }`,
          );
        }
        additionStyleRules.push(
          `button[class*=css_builder--colorBgPressed] { color: var(--fg-toolbar-active); }`,
        );
        additionStyleRules.push(`input { color: var(--text-active); }`);
      }
    }

    if (additionStyleRules.length) {
      const newStyles = document.createElement("style");
      newStyles.innerText = additionStyleRules.join("\n");

      document.head.appendChild(newStyles);
    }
  }
}

export const themes = new ThemesApplier();
