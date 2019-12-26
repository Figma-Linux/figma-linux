import * as Settings from "electron-settings";
import { Fonts } from "figma-linux-rust-binding";

let fonts: any = null;
if (!Boolean(Settings.get("app.disabledFonts"))) {
  fonts = require("figma-linux-rust-binding").getFonts;
}

class Fonts {
  public static getFonts = (dirs: Array<string>): Promise<Fonts.IFonts> =>
    new Promise((resolve, reject) => {
      if (fonts) {
        console.info("local fonts support is enabled");
        fonts(dirs, (err: Error, fonts: Fonts.IFonts) => {
          if (err) reject(err);

          resolve(fonts);
        });
      } else {
        console.info("local fonts support is disabled");
        reject(new Error("The Native module is disabled in the app settings"));
      }
    });
}

export default Fonts;
