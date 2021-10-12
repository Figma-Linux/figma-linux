import * as fs from "fs";
import { Fonts, getFonts } from "figma-linux-rust-binding";

class Fonts {
  public static getFonts = async (dirs: Array<string>): Promise<Fonts.IFonts> => {
    return getFonts(dirs);
  };

  public static getFontFile = async (path: string): Promise<Buffer> => {
    return fs.promises.readFile(path);
  };
}

export default Fonts;
