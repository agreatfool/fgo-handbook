import * as LibFs from "fs";

import * as LibRequest from "request";

class HttpPromise {

    public get(url: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            LibRequest.get(url, { gzip: true }, (err, response, body) => {
                if (err) {
                    return reject(err);
                }
                return resolve(body);
            });
        });
    }

    public download(url: string, path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            LibRequest(url).pipe(LibFs.createWriteStream(path))
                .on("close", () => {
                    resolve();
                })
                .on("error", (err) => {
                    reject(err);
                });
        });
    }

}

export default HttpPromise;