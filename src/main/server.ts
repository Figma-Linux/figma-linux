import * as fs from 'fs';
import * as Http from 'http';
import * as Path from 'path';

import { RESOURCESDIR, HOMEPAGE } from 'Const';

class Server {
    private server: Http.Server;
    private port: number;

    constructor(port: number) {
        this.port = port;
    }

    public start() {
        this.server = Http.createServer(this.requestHandler);

        this.server.listen(this.port, (error: Error) => {
            if (error) {
                console.error(error);
                return;
            }

            // console.log(`Server is running on localhost:12531`);
        });
    }

    private async requestHandler(request: Http.IncomingMessage, response: Http.ServerResponse) {
        console.log('request: ', request.url);
        const parsedPath = Path.parse(request.url);
        const filePath = `${RESOURCESDIR}/${parsedPath.base}`;
        let fileStat: fs.Stats;

        if (!parsedPath.dir.startsWith('/figbuild')) {
            response.writeHead(302, {
                'Location': `${HOMEPAGE}${request.url}`
            });
            response.end();
            return;
        }

        try {
            fileStat = await fs.promises.stat(filePath)
        } catch(error) {
            console.error(error);
            response.writeHead(404);
            response.end();
            return;
        }

        response.writeHead(200, {
            // 'Content-Type': '',
            'Content-Length': fileStat.size
        });

        fs
            .createReadStream(filePath)
            .pipe(response);

        return;
    }
}

export default new Server(12531);
