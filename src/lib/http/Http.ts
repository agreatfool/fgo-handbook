import * as LibUrl from "url";
import * as LibHttp from "http";
import * as LibHttps from "https";

class HttpPromise {

    public download(url: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            let lib = this.getHttpLibViaProtocol(url);
            lib.get(url, (response) => {
                const statusCode = response.statusCode;

                if (statusCode !== 200) {
                    return reject(new Error(`Request Failed.\nStatus Code: ${statusCode}.`));
                }

                let rawData = [];
                response.on("data", (chunk) => rawData.push(chunk));
                response.on("end", () => resolve(Buffer.concat(rawData)));
                response.on("error", (err) => reject(err));
            });
        });
    }

    private getHttpLibViaProtocol(url: string): any {
        let parsed = LibUrl.parse(url);
        if (parsed.protocol === "http") {
            return LibHttp;
        } else {
            return LibHttps;
        }
    }

}

export default HttpPromise;