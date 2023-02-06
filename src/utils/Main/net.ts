import * as fs from "fs";
import { net, ClientRequestConstructorOptions } from "electron";

export const request = (options: ClientRequestConstructorOptions): Promise<Request.Responce> =>
  new Promise((resolve, reject) => {
    const responce: Request.Responce = {
      url: options.url,
      data: "",
    };

    net
      .request(options)
      .on("response", (res) => {
        res.on("error", (error: Error) => reject(error));
        res.on("data", (chunk) => (responce.data += chunk.toString()));
        res.on("end", () => resolve(responce));
      })
      .on("error", (error: Error) => reject(error))
      .end();
  });

export async function downloadFile(url: string, savePath: string): Promise<void> {
  return new Promise((res, rej) => {
    net
      .request(url)
      .on("response", (response) => {
        const buffers: Uint8Array[] = [];
        let length = 0;

        const onData = (chunk: Buffer) => {
          buffers.push(chunk);
          length += chunk.length;
        };
        const onEnd = async () => {
          const buffer = Buffer.concat(buffers);

          await fs.promises.writeFile(savePath, buffer).catch((error) => {
            rej(error);
          });

          res();
        };

        response.on("error", rej);
        response.on("data", onData);
        response.on("end", onEnd);
      })
      .end();
  });
}
