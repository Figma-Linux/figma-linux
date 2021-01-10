import { Fonts, getFonts } from "figma-linux-rust-binding";

class Fonts {
  public static getFonts = (dirs: Array<string>): Promise<Fonts.IFonts> =>
    new Promise((resolve, reject) => {
      getFonts(dirs, (err: Error, fonts: Fonts.IFonts) => {
        if (err) reject(err);

        resolve(fonts);
      });
    });
}

export default Fonts;
