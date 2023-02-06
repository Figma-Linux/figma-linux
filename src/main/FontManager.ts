import { promises } from "fs";
import { getFonts } from "figma-linux-rust-binding";
import type { Fonts } from "figma-linux-rust-binding";

export default class FontManager {
  public getFonts = async (dirs: Array<string>): Promise<Fonts.IFonts> => {
    return getFonts(dirs);
  };

  public getFontFile = async (path: string): Promise<Buffer> => {
    return promises.readFile(path);
  };
}
