import * as path from "path";
import { app } from "Utils/Common";

export const themesDirectory = path.resolve(app.getPath("userData"), "Themes");

export const variablesColorsMap: Themes.ColorsMap = {
  "rgb(255, 255, 255)": "panel",
  "rgb(252, 252, 252)": "panel",
  "rgb(248, 248, 248)": "panelRowOnHover",
  "rgb(240, 240, 240)": "panelRowOnHover",
  "rgb(241, 249, 255)": "panelRowChildActive",
  "rgb(237, 245, 250)": "panelRowChildActive",
  "rgb(229, 229, 229)": "panelDivider",
  "rgb(229, 229, 229) 1px 0px 0px 0px": `panelDividerBoxShadowTop`,
  "rgb(229, 229, 229) 0px 1px 0px 0px": `panelDividerBoxShadowRight`,
  "rgb(239, 239, 239)": "panelDivider",
  "rgb(217, 217, 217)": "panelDivider",
  "rgb(212, 212, 212)": "panelDivider",
  "rgb(218, 235, 247)": "panelRowActive",
  "rgb(191, 186, 252)": "textComponentDisabledRowActive",
  "rgb(180, 180, 250)": "textComponentDisabledRowActive",
  "rgb(179, 179, 179)": "textDisabled",
  "rgb(166, 172, 175)": "textDisabledRowActive",
  "rgb(123, 97, 255)": "textComponent",
  "rgb(68, 68, 68)": "textCode",
  "rgb(51, 51, 51)": "text",
  "rgb(44, 44, 44)": "toolbarBg",
  "rgb(5, 5, 5)": "textActive",
  "rgb(0, 0, 0)": "textActive",
  "rgba(0, 0, 0, 0.06)": "iconButtonHover",
  "rgba(0, 0, 0, 0.1)": "inputFocus",
  "rgba(0, 0, 0, 0.15)": "black1",
  "rgba(0, 0, 0, 0.2)": "black2",
  "rgba(0, 0, 0, 0.3)": "black3",
  "rgba(0, 0, 0, 0.4)": "black4",
  "rgba(0, 0, 0, 0.6)": "black5",
  "rgba(0, 0, 0, 0.5)": "black6",
  "rgba(0, 0, 0, 0.75)": "black7",
  "rgba(0, 0, 0, 0.8)": "textActive",
  "rgba(0, 0, 0, 0.9)": "black8",
  "rgba(0, 0, 0, 0.95)": "black9",
  "rgba(44, 44, 44, 0.8)": "toolbarBg",
  "rgba(51, 51, 51, 0.3)": "textDisabled",
  "rgba(123, 97, 255, 0.4)": "textComponentDisabled",
  "rgba(255, 255, 255, 0)": "white1",
  "rgba(255, 255, 255, 0.2)": "white2",
  "rgba(255, 255, 255, 0.4)": "white3",
  "rgba(255, 255, 255, 0.05)": "white4",
  "rgba(255, 255, 255, 0.5)": "white5",
  "rgba(255, 255, 255, 0.8)": "white6",
  "rgba(255, 255, 255, 0.95)": "white7",
  "rgb(24, 160, 251)": "titleBorder",
  "rgb(24, 160, 251) 0px 0px 0px 1px inset": `titleBorderBoxShadow`,
};

export const getColorsMap = (palette: Themes.Palette, currentPalette?: Themes.ColorsMap): Themes.ColorsMap => {
  const defaultColorsMap: Themes.ColorsMap = {
    "rgb(255, 255, 255)": palette.panel,
    "rgb(252, 252, 252)": palette.panel,
    "rgb(248, 248, 248)": palette.panelRowOnHover,
    "rgb(240, 240, 240)": palette.panelRowOnHover,
    "rgb(241, 249, 255)": palette.panelRowChildActive,
    "rgb(237, 245, 250)": palette.panelRowChildActive,
    "rgb(229, 229, 229)": palette.panelDivider,
    "rgb(229, 229, 229) 1px 0px 0px 0px": `${palette.panelDivider} 1px 0px 0px 0px`,
    "rgb(229, 229, 229) 0px 1px 0px 0px": `${palette.panelDivider} 0px 1px 0px 0px`,
    "rgb(239, 239, 239)": palette.panelDivider,
    "rgb(217, 217, 217)": palette.panelDivider,
    "rgb(212, 212, 212)": palette.panelDivider,
    "rgb(218, 235, 247)": palette.panelRowActive,
    "rgb(191, 186, 252)": palette.textComponentDisabledRowActive,
    "rgb(180, 180, 250)": palette.textComponentDisabledRowActive,
    "rgb(179, 179, 179)": palette.textDisabled,
    "rgb(166, 172, 175)": palette.textDisabledRowActive,
    "rgb(123, 97, 255)": palette.textComponent,
    "rgb(68, 68, 68)": palette.textCode,
    "rgb(51, 51, 51)": palette.text,
    "rgb(44, 44, 44)": palette.toolbarBg,
    "rgb(5, 5, 5)": palette.textActive,
    "rgb(0, 0, 0)": palette.textActive,
    "rgba(0, 0, 0, 0.06)": palette.iconButtonHover,
    "rgba(0, 0, 0, 0.1)": palette.inputFocus,
    "rgba(0, 0, 0, 0.15)": palette.black1,
    "rgba(0, 0, 0, 0.2)": palette.black2,
    "rgba(0, 0, 0, 0.3)": palette.black3,
    "rgba(0, 0, 0, 0.4)": palette.black4,
    "rgba(0, 0, 0, 0.6)": palette.black5,
    "rgba(0, 0, 0, 0.5)": palette.black6,
    "rgba(0, 0, 0, 0.75)": palette.black7,
    "rgba(0, 0, 0, 0.8)": palette.textActive,
    "rgba(0, 0, 0, 0.9)": palette.black8,
    "rgba(0, 0, 0, 0.95)": palette.black9,
    "rgba(44, 44, 44, 0.8)": palette.toolbarBg,
    "rgba(51, 51, 51, 0.3)": palette.textDisabled,
    "rgba(123, 97, 255, 0.4)": palette.textComponentDisabled,
    "rgba(255, 255, 255, 0)": palette.white1,
    "rgba(255, 255, 255, 0.2)": palette.white2,
    "rgba(255, 255, 255, 0.4)": palette.white3,
    "rgba(255, 255, 255, 0.05)": palette.white4,
    "rgba(255, 255, 255, 0.5)": palette.white5,
    "rgba(255, 255, 255, 0.8)": palette.white6,
    "rgba(255, 255, 255, 0.95)": palette.white7,
    "rgb(24, 160, 251)": palette.titleBorder,
    "rgb(24, 160, 251) 0px 0px 0px 1px inset": `${palette.titleBorder} 0px 0px 0px 1px inset`,
  };

  if (currentPalette) {
    const updatedColorsMap: Themes.ColorsMap = {};
    const keys = Object.keys(currentPalette);

    for (const key of keys) {
      updatedColorsMap[currentPalette[key]] = defaultColorsMap[key];
    }

    return updatedColorsMap;
  }

  return defaultColorsMap;
};
