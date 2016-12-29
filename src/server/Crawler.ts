import * as LibPath from "path";
import LibUrlJoin = require("url-join");
import * as LibAsyncFile from "async-file";

let ROOT_DIR = LibPath.join(LibPath.dirname(__filename), "..", "..");

import Log from "../lib/log/Log";
import SourceObject from "../model/config/source";
import HttpPromise from "../lib/http/Http";

class Crawler {
    private sourceConf: SourceObject;
    private sourceMasterUrl: string;
    private masterFilePath: string;

    private libHttp: HttpPromise;

    constructor() {
        Log.log("[Crawler] Starting ...");
        this.sourceConf = require(LibPath.join(ROOT_DIR, "config", "source.json"));
        this.sourceMasterUrl = LibUrlJoin("https://", this.sourceConf.originHost, this.sourceConf.masterUri);
        this.masterFilePath = LibPath.join(ROOT_DIR, "database", "origin", "master.js");

        this.libHttp = new HttpPromise();
    }

    public async run() {
        let file: string = await this.downloadMasterFile();
        let json: any = await this.parseMasterFile(file);
    }

    public async downloadMasterFile(): Promise<string> {
        Log.log("[Crawler] Processing downloadMasterFile ...");
        try {
            Log.log(`[Crawler] Downloading from ${this.sourceMasterUrl} ...`);
            let buffer: Buffer = await this.libHttp.download(this.sourceMasterUrl);
            if (buffer.length <= 0) {
                return Promise.reject(new Error(`Empty response data from ${this.sourceMasterUrl}!`));
            }
            let file: string = buffer.toString();
            Log.log(`[Crawler] Downloaded file size ${file.length} ...`);

            await LibAsyncFile.writeFile(this.masterFilePath, file);
            return Promise.resolve(file);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    public async parseMasterFile(file: string): Promise<any> {
        Log.log("[Crawler] Processing parseMasterFile ...");
        //TODO
    }

}

export default Crawler;