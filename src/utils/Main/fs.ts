import * as fs from "fs";

export async function mkdirIfNotExists(path: string) {
  fs.mkdir(path, error => {
    if (error && error.code !== "EEXIST") {
      throw error;
    }
  });
}
