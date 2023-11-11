const hexReg = /^#[a-fA-F0-9]{3,6}$/;
const rgbReg = /(\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})/;

export const isHex = (color: string) => hexReg.test(color);
export const isRgb = (color: string) => rgbReg.test(color);

export const isValidColor = (color: string) => isHex(color) || isRgb(color);

export const HexToRgb = (hex: string) => {
  if (!isHex(hex)) {
    return hex;
  }

  let r, g, b;

  if (hex.length == 4) {
    r = Number("0x" + hex[1] + hex[1]);
    g = Number("0x" + hex[2] + hex[2]);
    b = Number("0x" + hex[3] + hex[3]);
  } else if (hex.length == 7) {
    r = Number("0x" + hex[1] + hex[2]);
    g = Number("0x" + hex[3] + hex[4]);
    b = Number("0x" + hex[5] + hex[6]);
  }

  return `rgb(${r}, ${g}, ${b})`;
};
export const RgbToHex = (rgb: string) => {
  if (!isRgb(rgb)) {
    return rgb;
  }

  const [_, r, g, b] = rgb.match(rgbReg);

  const red = (+r).toString(16).padStart(2, "0");
  const green = (+g).toString(16).padStart(2, "0");
  const blue = (+b).toString(16).padStart(2, "0");

  return `#${red}${green}${blue}`;
};
