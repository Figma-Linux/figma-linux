const parseArgs = require('electron-args');
const pjson = require('./../../package.json');

const cli = parseArgs(`
    figma-linux

    Usage
        $ figma-linux [options]

    Options
        -h  show help
        -v  show version
        -n  launch app without frame [Default: false]
`, {
    alias: {
        h: 'help'
    },
    default: {
        n: false
    }
});
const argv = cli.flags;


module.exports = function(app) {
    console.log(cli.flags);
    console.log(cli.input);
    console.log(cli.input[0]);

    console.log(typeof pjson.version === 'string' ? pjson.version : 'I don\'t know' );
    if (argv.v) {
        console.log(typeof pjson.version === 'string' ? pjson.version : 'I don\'t know' );
        process.exit(0);
    }
    
} 

