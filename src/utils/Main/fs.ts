import * as fs from "fs";

export async function mkdirIfNotExists(path: string) {
  fs.mkdir(path, (error) => {
    if (error && error.code !== "EEXIST") {
      throw error;
    }
  });
}

export async function access(path: string): Promise<boolean> {
  try {
    await fs.promises.access(path);
    return true;
  } catch (error) {
    return false;
  }
}

export function accessSync(path: string): boolean {
  try {
    fs.accessSync(path);

    return true;
  } catch (error) {
    return false;
  }
}

export async function mkPath(path: string) {
  return fs.promises.mkdir(path, { recursive: true });
}
