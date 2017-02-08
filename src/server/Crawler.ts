import * as LibPath from "path";
import * as LibAsyncFile from "async-file";

import Config from "../lib/config/Config";
import Utility from "../lib/utility/Utility";
import Log from "../lib/log/Log";
import SourceConfig from "../model/config/SourceConfig";
import HttpPromise from "../lib/http/Http";
import Const from "../lib/const/Const";

export default class Crawler {

    private _sourceConf: SourceConfig;
    private _sourceMasterUrl: string;
    private _masterFilePath: string;
    private _masterJsonPath: string;

    private _libHttp: HttpPromise;

    private _masterJson: any;
    private _masterPatternStart: number;
    private _masterPatternEnd: number;

    constructor() {
        Log.instance.info("[Crawler] Starting ...");
        this._sourceConf = require(LibPath.join(Const.PATH_CONFIG, "source.json"));
        this._sourceMasterUrl = `${this._sourceConf.protocol}://${this._sourceConf.originHost}/${this._sourceConf.baseUri}/${this._sourceConf.masterJsonUri}`;

        this._libHttp = new HttpPromise();

        this._masterPatternStart = "var mstTxt = LZString.decompress(convert_formated_hex_to_string('".length + 1;
        this._masterPatternEnd = "'));".length;
    }

    public async run(): Promise<any> {
        let file: string;
        let json: any;

        try {
            let appVer = await Config.instance.loadConfig(Const.CONF_APP, "version");
            this._masterFilePath = LibPath.join(Const.PATH_DATABASE, appVer, "origin", "master.js");
            this._masterJsonPath = LibPath.join(Const.PATH_DATABASE, appVer, "origin", "master.json");

            file = await this.downloadMasterFile();
            json = await this.parseMasterJson(file)
        } catch (err) {
            return Promise.reject(err);
        }

        return Promise.resolve(json);
    }

    public async downloadMasterFile(): Promise<string> {
        Log.instance.info("[Crawler] Processing downloadMasterFile ...");
        try {
            Log.instance.info(`[Crawler] Downloading from ${this._sourceMasterUrl} ...`);
            let buffer: Buffer = await this._libHttp.get(this._sourceMasterUrl);
            //noinspection TypeScriptUnresolvedVariable
            if (buffer.length <= 0) {
                return Promise.reject(new Error(`[Crawler] downloadMasterFile: Empty response data from ${this._sourceMasterUrl}!`));
            }
            let file: string = buffer.toString();
            Log.instance.info(`[Crawler] Downloaded file size ${file.length} ...`);

            await LibAsyncFile.writeFile(this._masterFilePath, file);
            return Promise.resolve(file);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    public async parseMasterJson(file: string): Promise<any> {
        Log.instance.info("[Crawler] Processing parseMasterJson ...");
        try {
            let splitFile: string[] = file.split("\n");
            let firstLine: string = splitFile[0];

            let result = firstLine.substring(this._masterPatternStart, firstLine.length - this._masterPatternEnd);

            let decompressed = Utility.decompressFromHexStr(result);
            this._masterJson = JSON.parse(decompressed);

            await LibAsyncFile.writeFile(this._masterJsonPath, JSON.stringify(this._masterJson, null, "    "));
            return Promise.resolve(this._masterJson);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    get masterJson(): any {
        return this._masterJson;
    }

}