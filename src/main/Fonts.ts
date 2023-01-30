import { promises } from "fs";
import { getFonts } from "figma-linux-rust-binding";
import type { Fonts } from "figma-linux-rust-binding";

export class FontsManager {
  public static getFonts = async (dirs: Array<string>): Promise<Fonts.IFonts> => {
    return getFonts(dirs);
  };

  public static getFontFile = async (path: string): Promise<Buffer> => {
    return promises.readFile(path);
  };
}
