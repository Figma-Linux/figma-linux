import * as E from "electron";

export const Request = (url: string): Promise<Request.Responce> =>
  new Promise((resolve, reject) => {
    const responce: Request.Responce = {
      url,
      data: "",
    };

    E.net
      .request(url)
      .on("response", res => {
        res.on("error", (error: Error) => reject(error));
        res.on("data", chunk => (responce.data += chunk.toString()));
        res.on("end", () => resolve(responce));
      })
      .on("error", (error: Error) => reject(error))
      .end();
  });
