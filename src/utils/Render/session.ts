import * as E from 'electron';
import * as url from 'url';

import { HOMEPAGE } from 'Const';

export function session() {
    const filters: E.OnBeforeSendHeadersFilter = {
        urls: [
            '*://static.figma.com/*',
            '*://s3-alpha-sig.figma.com/*'
        ]
    };

    E.remote.session.defaultSession.webRequest.onBeforeSendHeaders(filters, (details, callback) => {
        details.requestHeaders['credentials'] = 'same-origin';
        details.requestHeaders['redirect'] = 'follow';
        details.requestHeaders['referrer'] = 'no-referrer';
        details.requestHeaders['Referer'] = `${details.requestHeaders['Referer']}/no-referrer`;

        console.log(`${details.id} | ${details.url}`, details.requestHeaders);
        callback({ requestHeaders: details.requestHeaders });
    });
}
