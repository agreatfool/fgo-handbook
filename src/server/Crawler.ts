import * as LibPath from "path";
import LibUrlJoin = require("url-join");
import * as LibAsyncFile from "async-file";

let ROOT_DIR = LibPath.join(LibPath.dirname(__filename), "..", "..");

import Utility from "../lib/utility/Utility";
import Log from "../lib/log/Log";
import SourceObject from "../model/config/source";
import HttpPromise from "../lib/http/Http";

class Crawler {
    private _sourceConf: SourceObject;
    private _sourceMasterUrl: string;
    private _masterFilePath: string;
    private _masterJsonPath: string;

    private _utility: Utility;
    private _libHttp: HttpPromise;

    private _masterJson: any;
    private _masterPatternStart: number;
    private _masterPatternEnd: number;

    constructor() {
        Log.log("[Crawler] Starting ...");
        this._sourceConf = require(LibPath.join(ROOT_DIR, "config", "source.json"));
        this._sourceMasterUrl = LibUrlJoin("https://", this._sourceConf.originHost, this._sourceConf.masterUri);
        this._masterFilePath = LibPath.join(ROOT_DIR, "database", "origin", "master.js");
        this._masterJsonPath = LibPath.join(ROOT_DIR, "database", "origin", "master.json");

        this._utility = new Utility();
        this._libHttp = new HttpPromise();

        this._masterPatternStart = "var mstTxt = LZString.decompress(convert_formated_hex_to_string('".length + 1;
        this._masterPatternEnd = "'));".length;
    }

    public async run() {
        let file: string = await this.downloadMasterFile();
        let json: any = await this.parseMasterJson(file);
    }

    public async downloadMasterFile(): Promise<string> {
        Log.log("[Crawler] Processing downloadMasterFile ...");
        try {
            Log.log(`[Crawler] Downloading from ${this._sourceMasterUrl} ...`);
            let buffer: Buffer = await this._libHttp.download(this._sourceMasterUrl);
            if (buffer.length <= 0) {
                return Promise.reject(new Error(`Empty response data from ${this._sourceMasterUrl}!`));
            }
            let file: string = buffer.toString();
            Log.log(`[Crawler] Downloaded file size ${file.length} ...`);

            await LibAsyncFile.writeFile(this._masterFilePath, file);
            return Promise.resolve(file);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    public async parseMasterJson(file: string): Promise<any> {
        Log.log("[Crawler] Processing parseMasterJson ...");
        try {
            let splitFile: string[] = file.split("\n");
            let firstLine: string = splitFile[0];

            let result = firstLine.substring(this._masterPatternStart, firstLine.length - this._masterPatternEnd);

            let decompressed = this._utility.decompressFromHexStr(result);
            this._masterJson = JSON.parse(decompressed);

            await LibAsyncFile.writeFile(this._masterJsonPath, JSON.stringify(this._masterJson, null, "    "));
            Promise.resolve(this._masterJson);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    get masterJson(): any {
        return this._masterJson;
    }

}

export default Crawler;