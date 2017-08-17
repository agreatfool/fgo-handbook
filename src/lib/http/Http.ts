import * as LibFs from "fs";
import {Stats} from "fs";
import {IncomingMessage} from "http";

import * as LibAsyncFile from "async-file";
import * as LibRequest from "request";

class HttpPromise {

    public get(url: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            LibRequest.get(url, {gzip: true}, (err, response, body) => {
                if (err) {
                    return reject(err);
                }
                return resolve(body);
            });
        });
    }

    public head(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            LibRequest.head(url, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            });
        });
    }

    public download(url: string, path: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            LibRequest(url)
                .pipe(LibFs.createWriteStream(path))
                .on("close", () => {
                    return resolve(true);
                })
                .on("error", (err) => {
                    return reject(err);
                });
        });
    }

    public async downloadWithCheck(url: string, path: string): Promise<boolean> {

        try {

            // get head info from url
            let headResponse: IncomingMessage = await this.head(url);
            if (headResponse.statusCode != 200) {
                return Promise.resolve(false); // do nothing with 404
            }

            // check file exists
            let fileSizeFromServer = parseInt(headResponse.headers["content-length"] as string);
            if (fileSizeFromServer <= 0) {
                return Promise.resolve(false);
            }
            let exists = await LibAsyncFile.exists(path);
            if (!exists) { // file not found, go on downloading
                await this.download(url, path);
            } else {
                let stats: Stats = await LibAsyncFile.stat(path);
                if (!stats.isFile() || stats.size !== fileSizeFromServer) {
                    await this.download(url, path);
                }
            }

            return Promise.resolve(true);

        } catch (e) {
            return Promise.reject(e);
        }

    }

}

export default HttpPromise;