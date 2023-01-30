// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("./../../package.json");

export default (): { figmaUrl: string } => {
  const argv = process.argv;

  let figmaUrl = "";

  if (argv.indexOf("-v") != -1) {
    console.log(typeof version === "string" ? version : "0.1.0");
    process.exit(0);
  }

  const urlIndex = argv.findIndex((i) => /^(figma:\/\/|https?:\/\/w{0,3}?\.?figma\.com)/.test(i));
  if (urlIndex !== -1) {
    figmaUrl = argv[urlIndex];
  }

  if (argv.indexOf("-h") != -1) {
    const help = `
figma-linux

Unofficial desktop application for linux. This application based on the Electron.js.

use:
    figma-linux [options] [APP_URL_TO_PROJECT]

    OPTIONS:
        -h      this reference.
        -v      show version of application.
        `;

    console.log(help);
    process.exit(0);
  }

  return {
    figmaUrl,
  };
};
