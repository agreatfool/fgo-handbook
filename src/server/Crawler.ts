import * as LibPath from "path";
import * as LibAsyncFile from "async-file";
import * as LibMd5 from "md5";

import Config from "../lib/config/Config";
import Utility from "../lib/utility/Utility";
import Log from "../lib/log/Log";
import SourceConfig from "../model/config/SourceConfig";
import HttpPromise from "../lib/http/Http";
import Const from "../lib/const/Const";

export default class Crawler {

    private _newVersion: string; // from VersionCheck.run

    private _sourceConf: SourceConfig;

    private _sourceMasterUrl: string;
    private _masterFilePath: string;
    private _masterJsonPath: string;

    private _sourceSvtDataUrl: string;
    private _svtDataJsPath: string;

    private _sourceTransDataUrl: string;
    private _transDataJsPath: string;
    private _transDataFilePath: string;

    private _libHttp: HttpPromise;

    private _masterJson: any;
    private _masterPatternStart: number;
    private _masterPatternEnd: number;

    constructor(newVer: string) {
        Log.instance.info("[Crawler] Starting ...");

        this._newVersion = newVer;
        this._sourceConf = require(LibPath.join(Const.PATH_CONFIG, "source.json"));
        this._sourceMasterUrl = `${this._sourceConf.protocol}://${this._sourceConf.originHost}/${this._sourceConf.baseUri}/${this._sourceConf.masterJsonUri}`;
        this._sourceSvtDataUrl = `${this._sourceConf.protocol}://${this._sourceConf.originHost}/${this._sourceConf.baseUri}/${this._sourceConf.svtDataUri}`;
        this._sourceTransDataUrl = `${this._sourceConf.protocol}://${this._sourceConf.originHost}/${this._sourceConf.baseUri}/${this._sourceConf.transDataUri}`;

        this._libHttp = new HttpPromise();

        this._masterPatternStart = "var mstTxt = LZString.decompress(convert_formated_hex_to_string('".length + 1;
        this._masterPatternEnd = "'));".length;
    }

    public async run(): Promise<boolean> {
        let masterFile: string;
        let transFile: string;

        try {
            this._masterFilePath = LibPath.join(Const.PATH_DATABASE, this._newVersion, "origin", "master.js");
            this._masterJsonPath = LibPath.join(Const.PATH_DATABASE, this._newVersion, "origin", "master.json");
            this._svtDataJsPath = LibPath.join(Const.PATH_DATABASE, this._newVersion, "origin", "svtData.js");
            this._transDataJsPath = LibPath.join(Const.PATH_DATABASE, this._newVersion, "origin", "transData.js");
            this._transDataFilePath = LibPath.join(Const.PATH_DATABASE, this._newVersion, "embedded_trans.json");

            masterFile = await this._downloadMasterFile();
            let needUpgrade = await this._checkNeedUpgrade(masterFile);
            if (!needUpgrade) {
                return Promise.resolve(false);
            }

            await this._parseMasterJson(masterFile);
            await this._downloadSvtDataFile();
            transFile = await this._downloadTransDataFile();
            await this._parseTransData(transFile);
        } catch (err) {
            return Promise.reject(err);
        }

        return Promise.resolve(true);
    }

    private async _checkNeedUpgrade(newMasterFile: string): Promise<boolean> {
        let appVer = await Config.instance.loadConfig(Const.CONF_VERSION, "version");
        let oldMasterFilePath = LibPath.join(Const.PATH_DATABASE, appVer, "origin", "master.js");

        let oldMasterFile = (await LibAsyncFile.readFile(oldMasterFilePath)).toString();

        return Promise.resolve(LibMd5(oldMasterFile) !== LibMd5(newMasterFile));
    }

    private async _downloadMasterFile(): Promise<string> {
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

    private async _parseMasterJson(file: string): Promise<any> {
        Log.instance.info("[Crawler] Processing parseMasterJson ...");
        try {
            let splitFile: string[] = file.split("\n");
            let firstLine: string = splitFile[0];

            let result = firstLine.substring(this._masterPatternStart, firstLine.length - this._masterPatternEnd);

            let decompressed = Utility.decompressFromHexStr(result);
            this._masterJson = JSON.parse(decompressed);

            await LibAsyncFile.writeFile(this._masterJsonPath, JSON.stringify(this._masterJson, null, 4));
            return Promise.resolve(this._masterJson);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private async _downloadSvtDataFile(): Promise<string> {
        Log.instance.info("[Crawler] Processing downloadSvtDataFile ...");
        try {
            Log.instance.info(`[Crawler] Downloading from ${this._sourceSvtDataUrl} ...`);
            let buffer: Buffer = await this._libHttp.get(this._sourceSvtDataUrl);
            //noinspection TypeScriptUnresolvedVariable
            if (buffer.length <= 0) {
                return Promise.reject(new Error(`[Crawler] downloadSvtDataFile: Empty response data from ${this._sourceSvtDataUrl}!`));
            }
            let file: string = buffer.toString();
            Log.instance.info(`[Crawler] Downloaded file size ${file.length} ...`);

            await LibAsyncFile.writeFile(this._svtDataJsPath, file);
            return Promise.resolve(file);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private async _downloadTransDataFile(): Promise<string> {
        Log.instance.info("[Crawler] Processing downloadTransDataFile ...");
        try {
            Log.instance.info(`[Crawler] Downloading from ${this._sourceTransDataUrl} ...`);
            let buffer: Buffer = await this._libHttp.get(this._sourceTransDataUrl);
            //noinspection TypeScriptUnresolvedVariable
            if (buffer.length <= 0) {
                return Promise.reject(new Error(`[Crawler] downloadTransDataFile: Empty response data from ${this._sourceTransDataUrl}!`));
            }
            let file: string = buffer.toString();
            Log.instance.info(`[Crawler] Downloaded file size ${file.length} ...`);

            await LibAsyncFile.writeFile(this._transDataJsPath, file);
            return Promise.resolve(file);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private async _parseTransData(file: string): Promise<any> {
        Log.instance.info("[Crawler] Processing parseTransData ...");

        let convertedTrans = {
            "name": null,
            "skill": null,
            "treasure": null
        };
        let nameStart = "var svtName = ";
        let skillStart = "var skDetail = ";
        let treasureStart = "var tdDetail = ";

        // split file into lines
        let lines = file.split("\n");

        for (let line of lines) {
            if (line.indexOf(nameStart) === -1 && line.indexOf(skillStart) === -1 && line.indexOf(treasureStart) === -1) {
                continue;
            }

            let start: string;
            let convertedKey: string;
            if (line.indexOf(nameStart) !== -1) {
                start = nameStart;
                convertedKey = "name";
            } else if (line.indexOf(skillStart) !== -1) {
                start = skillStart;
                convertedKey = "skill";
            } else {
                start = treasureStart;
                convertedKey = "treasure";
            }

            let content = line.substr(
                line.indexOf("[["),
                line.length - start.length - 1
            );
            convertedTrans[convertedKey] = eval(content);
        }

        await LibAsyncFile.writeFile(this._transDataFilePath, JSON.stringify(convertedTrans, null, 4));
        return Promise.resolve(convertedTrans);
    }

    get masterJson(): any {
        return this._masterJson;
    }

}