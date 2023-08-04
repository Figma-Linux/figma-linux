import { spawnSync } from "node:child_process";
import { readFile } from "fs/promises";
import { statSync } from "fs";
import { logger } from "Main/Logger";
import TTF from "./TTF";
import TTC from "./TTC";

export default class FontManager {
  private fontList: Fonts.IFonts = {};

  public getFonts = async (dirs: Array<string>): Promise<Fonts.IFonts> => {
    await Promise.all([this.loadTTF(dirs), this.loadTTC(dirs)]);

    return this.fontList;
  };

  public getFontFile = async (path: string): Promise<Buffer> => {
    return readFile(path);
  };

  private async loadTTF(dirs: Array<string>) {
    let files: string[] = [];

    await Promise.all(
      dirs.map((dir) => this.find(dir, "*.?tf").then((a) => (files = [...files, ...a]))),
    );

    for (const path of files) {
      try {
        const ttf = new TTF(await readFile(path));

        this.fontList[path] = [ttf.getData()];
      } catch (error) {
        logger.error(`skip font: ${path}, error: `, error.message);
      }
    }
  }
  private async loadTTC(dirs: Array<string>) {
    let files: string[] = [];

    await Promise.all(
      dirs.map((dir) => this.find(dir, "*.ttc").then((a) => (files = [...files, ...a]))),
    );

    for (const path of files) {
      try {
        const ttc = new TTC(await readFile(path));

        this.fontList[path] = ttc.getData();
      } catch (error) {
        logger.error(`skip font: ${path}, error: `, error.message);
      }
    }
  }

  private find = async (path: string, wilecard: string) => {
    return new Promise<string[]>((resolve) => {
      try {
        statSync(path);
      } catch (error) {
        resolve([]);
        return;
      }

      const find = spawnSync("find", [path, "-type", "f", "-name", wilecard]);

      resolve(
        find.stdout
          .toString()
          .split("\n")
          .filter((s) => !!s),
      );
    });
  };
}
