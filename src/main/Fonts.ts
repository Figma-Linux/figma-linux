import { storage } from "./Storage";
import { logger } from "./Logger";
import { Fonts } from "figma-linux-rust-binding";

let fonts: any = null;
if (!storage.get().app.disabledFonts) {
  fonts = require("figma-linux-rust-binding").getFonts;
}

class Fonts {
  public static getFonts = (dirs: Array<string>): Promise<Fonts.IFonts> =>
    new Promise((resolve, reject) => {
      if (fonts) {
        logger.info("local fonts support is enabled");
        fonts(dirs, (err: Error, fonts: Fonts.IFonts) => {
          if (err) reject(err);

          resolve(fonts);
        });
      } else {
        logger.info("local fonts support is disabled");
        reject(new Error("The Native module is disabled in the app settings"));
      }
    });
}

export default Fonts;
