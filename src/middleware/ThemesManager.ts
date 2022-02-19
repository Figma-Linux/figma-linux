import * as E from "electron";
import { DEFAULT_THEME, SELECTORS_TO_IGNORE, PROPS_WITH_COLOR } from "Const";
import { getColorsMap, variablesColorsMap } from "Utils/Common";

export class ThemesManager {
  private currentTheme: Themes.Theme;

  constructor() {
    this.currentTheme = DEFAULT_THEME;

    this.themeEvents();
  }

  private themeEvents() {
    E.ipcRenderer.on("themes-change", (_, theme) => {
      this.changePalette(theme);
    });
    E.ipcRenderer.on("set-default-theme", () => {
      this.changePalette(DEFAULT_THEME);
    });
  }

  private changePalette(theme: Themes.Theme) {
    this.currentTheme = theme;

    this.setThemeVariables();
  }

  private getCoreStylesheet(): Themes.CSSRuleListCustom {
    const css: any = document.styleSheets;
    let coreStylesheet;

    Object.keys(css).forEach(key => {
      const cssFileUrl = css[key].href;

      if (cssFileUrl && cssFileUrl.includes("figma_app")) {
        coreStylesheet = css[key].cssRules;
      }
    });

    return coreStylesheet;
  }
  private isRuleIgnored(selector: string): boolean {
    let isMatch = false;

    SELECTORS_TO_IGNORE.forEach(query => {
      if (selector.includes(query)) {
        isMatch = true;
      }
    });

    return isMatch;
  }

  private setThemeVariables() {
    const keys = Object.keys(this.currentTheme.palette);

    for (const key of keys) {
      const value = this.currentTheme.palette[key];
      document.body.style.setProperty(`--${key}`, value);

      if (key === "bg-toolbar-active") {
        document.body.style.setProperty("--bg-primary-btn", value);
        document.body.style.setProperty("--bg-overlay-active", value);
      }
      if (key === "fg-overlay") {
        document.body.style.setProperty("--fg-overlay", value);
        document.body.style.setProperty("--fg-overlay-right", value);
      }
      if (key === "fg-toolbar-active") {
        document.body.style.setProperty("--fg-overlay-active", value);
      }
      if (key === "fg-toolbar-active") {
        document.body.style.setProperty("--fg-overlay-active", value);
      }
      if (key === "text-disabled") {
        document.body.style.setProperty("--fg-overlay-secondary", value);
        document.body.style.setProperty("--fg-toolbar-placeholder", value);
      }
      if (key === "borders") {
        document.body.style.setProperty("--fg-overlay-sep", value);
      }
    }

    document.body.style.setProperty("background-color", "var(--gb-panel)");

    document.body.style.setProperty("--color-bg", "var(--bg-panel)");
    document.body.style.setProperty("--color-bg-selected", "var(--bg-panel)");
    document.body.style.setProperty("--color-text", "var(--text)");
    document.body.style.setProperty("--color-text-secondary", "var(--text)");
    document.body.style.setProperty("--color-border", "var(--borders)");
    document.body.style.setProperty("--color-text-disabled", "var(--text-disabled)");
  }

  init(): void {
    const figmaCoreStylesheet = this.getCoreStylesheet();

    if (!figmaCoreStylesheet) {
      return;
    }

    const colorsMap = getColorsMap(this.currentTheme.palette);
    const additionStyleRules: string[] = [
      "#react-page { background-color: var(--bg-panel); }",
      `span[class*="action_option--shortcut"] { color: var(--fg-overlay); }`,
      `div[class*="search--searchContainer"] input { background-color: var(--bg-panel) !important; }`,
      `div[class*="file_browser_page_view"] { background-color: var(--bg-panel) !important; }`,
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
          PROPS_WITH_COLOR.forEach(colorProp => {
            const colorValue = cssRule.style[colorProp];

            if (colorValue != "" && colorsMap.hasOwnProperty(colorValue)) {
              cssRule.style[colorProp] = `${variablesColorsMap[colorValue]}`;
            }
          });
        }

        if (/search--searchInput/.test(cssRule.selectorText)) {
          cssRule.style["backgroundColor"] = `var(--bg-panel)`;
          cssRule.style["color"] = `var(--text-active)`;
        }

        if (/searchIcon/.test(cssRule.selectorText)) {
          cssRule.style["fill"] = `var(--text-active)`;
        }
        if (/tool_bar--toolBarRightSide|pages_panel--pageRowSelected/.test(cssRule.selectorText)) {
          cssRule.style["fill"] = `var(--text-active)`;
        }
        if (/.svg-container/.test(cssRule.selectorText)) {
          additionStyleRules.push(`.svg-container path:not([fill="none"]) { fill: var(--text-active); }`);
        }
        if (/.text--_negText/.test(cssRule.selectorText)) {
          additionStyleRules.push(`${cssRule.selectorText} { color: var(--fg-header); }`);
        }
        if (/.navbar--workspaceSubtitle/.test(cssRule.selectorText)) {
          additionStyleRules.push(`${cssRule.selectorText} { color: var(--fg-header); }`);
        }
        if (/upgrade_section--icon/.test(cssRule.selectorText)) {
          additionStyleRules.push(`span[class*="upgrade_section--icon"] > svg > path { fill: var(--text); }`);
        }
        if (
          /user_view--devTokenNew|community_hub_banner--bannerIcon|full_width_page--closeMenu/.test(
            cssRule.selectorText,
          )
        ) {
          additionStyleRules.push(`${cssRule.selectorText} svg path { fill: var(--text) !important; }`);
        }
        if (/basic_form--textInput/.test(cssRule.selectorText)) {
          cssRule.style["backgroundColor"] = `var(--bg-panel)`;
        }
        if (
          /(search--searchContainer--.*:hover|search--expandingSearchBoxContainerFocused)/.test(cssRule.selectorText)
        ) {
          cssRule.style["backgroundColor"] = `var(--bg-header)`;
        }
        if (/step_breadcrumb--stepTitle/.test(cssRule.selectorText)) {
          cssRule.style["color"] = `var(--text-active)`;
        }
        if (/toolbar_view--shareButton|basic_form--primaryBtn/.test(cssRule.selectorText)) {
          cssRule.style["color"] = `var(--fg-toolbar-active)`;
        }
      }
    }

    if (additionStyleRules.length) {
      const newStyles = document.createElement("style");
      newStyles.innerText = additionStyleRules.join("\n");

      document.head.appendChild(newStyles);
    }
  }
}

export const themes = new ThemesManager();
