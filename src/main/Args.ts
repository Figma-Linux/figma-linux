const pjson = require('./../../package.json');

export default () => {
    const argv = process.argv;

    let withoutFrame = true;

    if (argv.indexOf('-v') != -1) {
        console.log(typeof pjson.version === 'string' ? pjson.version : '0.0.4' );
        process.exit(0);
    }

    if (argv.indexOf('-h') != -1) {
        const help = `
figma-linux

Unofficial desktop application for linux. This application based on the Electron.js.

use:
    figma-linux [options]

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
        withoutFrame
    };
}
