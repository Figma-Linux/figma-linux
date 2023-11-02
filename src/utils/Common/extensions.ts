export const ALLOW_EXT_FILES = /^(.+\.(html|js|ts)|manifest.json)$/;
export const ALLOW_CODE_FILES = /^(.+\.(js|ts))$/;
export const ALLOW_UI_FILES = /^(.+\.html)$/;

export function sanitizeFileName(input: string): string {
  const illegalRe = /[\/\?<>\\:\*\|":]/g;
  const controlRe = /[\x00-\x1f\x80-\x9f]/g;
  const reservedRe = /^\.+$/;
  const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
  const windowsTrailingRe = /[\. ]+$/;

  return input
    .replace(illegalRe, "")
    .replace(controlRe, "")
    .replace(reservedRe, "")
    .replace(windowsReservedRe, "")
    .replace(windowsTrailingRe, "");
}
