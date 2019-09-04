import * as E from 'electron';

import { handleCommandItemClick } from 'Utils/Main';


E.app.on('handle-page-command', (item, window) => handleCommandItemClick(item, window));

E.app.on('log', data => {
    console.log('log: ', data);
});
