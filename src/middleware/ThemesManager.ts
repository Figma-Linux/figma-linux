import { DEFAULT_THEME, DEFAULT_PALETTE, SELECTORS_TO_IGNORE, PROPS_WITH_COLOR, SVG_MAP } from "Const";
import { getColorsMap, variablesColorsMap } from "Utils/Common";

export class ThemesManager {
  private currentTheme: Themes.Theme;

  constructor() {
    this.currentTheme = DEFAULT_THEME;

    // TODO: rewrite events
    // app.on("themes-change", theme => this.changePalette(theme));
    // app.on("set-default-theme", () => this.changePalette(DEFAULT_THEME));
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
      document.documentElement.style.setProperty(`--${key}`, (this.currentTheme.palette as any)[key]);
    }
  }

  init(): void {
    const figmaCoreStylesheet = this.getCoreStylesheet();

    if (!figmaCoreStylesheet) {
      return;
    }

    const colorsMap = getColorsMap(this.currentTheme.palette);

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
              cssRule.style[colorProp] = `var(--${variablesColorsMap[colorValue]})`;
            }
          });
        }
      }
    }

    setTimeout(() => {
      const svgs = Array.from(document.getElementsByTagName("svg"));

      for (const svg of svgs) {
        for (const svgColor of Object.keys(SVG_MAP)) {
          const regexp = new RegExp(svgColor, "gi");

          if (regexp.test(svg.innerHTML)) {
            svg.innerHTML = svg.innerHTML.replace(regexp, SVG_MAP[svgColor]);
          }
        }
      }
    }, 300);
  }
}

export const themes = new ThemesManager();
