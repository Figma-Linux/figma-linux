const pjson = require('./../../package.json');

export default () => {
    const argv = process.argv;

    let withoutFrame = true;
    let figmaUrl = '';

    if (argv.indexOf('-v') != -1) {
        console.log(typeof pjson.version === 'string' ? pjson.version : '0.1.0' );
        process.exit(0);
    }

    const urlIndex = argv.findIndex(i => /^figma:\/\//.test(i));
    if (urlIndex !== -1) {
        figmaUrl = argv[urlIndex];
    }

    if (argv.indexOf('-h') != -1) {
        const help = `
figma-linux

Unofficial desktop application for linux. This application based on the Electron.js.

use:
    figma-linux [options] [APP_URL_TO_PROJECT]

    OPTIONS:
        -h      this reference.
        -f      launch app without window frame.
        -v      show version of application.
        `;

        console.log(help);
        process.exit(0);
    }

    if (argv.indexOf('-f') != -1) {
        withoutFrame = false;
    }

    return {
        withoutFrame,
        figmaUrl
    };
}
