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

    public downloadWithCheck(url: string, path: string): Promise<boolean> {
        let fileSizeFromServer = 0;

        return new Promise((resolve, reject) => {
            this.head(url).then((response) => {
                if (response.statusCode != 200) {
                    return resolve(false); // do nothing with 404
                }
                return Promise.resolve(response);
            }).then((response) => {
                fileSizeFromServer = (response as IncomingMessage).headers["content-length"];
                if (fileSizeFromServer <= 0) {
                    return resolve(false);
                }
                return LibAsyncFile.exists(path);
            }).then((exists) => {
                if (!exists) {
                    return Promise.resolve('goOnDownload');
                } else {
                    return LibAsyncFile.stat(path);
                }
            }).then((stats) => {
                if (typeof stats === 'string' && stats === 'goOnDownload') {
                    // file not found, go on downloading
                    return this.download(url, path);
                } else if ((stats as Stats).isFile() && (stats as Stats).size == fileSizeFromServer) {
                    // already downloaded, size is correct
                    return resolve(true);
                } else {
                    return this.download(url, path);
                }
            }).then((downloadResult) => {
                return resolve(downloadResult);
            }).catch((err) => {
                return reject(err);
            });
        });
    }

}

export default HttpPromise;