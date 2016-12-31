import * as LibRequest from "request";

class HttpPromise {

    public download(url: string): Promise<Buffer> {
        let size =  0;
        return new Promise((resolve, reject) => {
            LibRequest.get(url, { gzip: true }, (err, response, body) => {
                if (err) {
                    return reject(err);
                }
                return resolve(body);
            });
        });
    }

}

export default HttpPromise;