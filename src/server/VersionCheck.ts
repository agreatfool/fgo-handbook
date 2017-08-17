import * as LibPath from "path";
import * as LibAsyncFile from "async-file";
import * as rimraf from "rimraf";
import * as LibMoment from "moment";
import * as LibUtil from "util";

import Config from "../lib/config/Config";
import Const from "../lib/const/Const";
import MstUtil from "../lib/model/MstUtil";
import VersionConfig from "../model/config/VersionConfig";

const rmrf = LibUtil.promisify(rimraf);

export default class VersionCheck {

    private _versionRawPath: string;
    private _newVerPath: string;

    private _versionRaw: string; // 0.0.1
    private _newVersion: string; // 0.0.2

    constructor() {
        this._versionRawPath = LibPath.join(Const.PATH_BASE, "VERSION");
    }

    public async run(): Promise<string> {
        await this._parseVersion();
        await this._prepareNewVerDir();

        return Promise.resolve(this._newVersion);
    }

    public async rollback(): Promise<void> {
        return await rmrf(this._newVerPath);
    }

    public async upgradeVer(): Promise<void> {
        let appVer: VersionConfig = await Config.instance.loadWholeConfig(Const.CONF_VERSION) as VersionConfig;
        appVer.version = this._newVersion;
        appVer.updated = LibMoment().format("YYYY-MM-DD");
        await LibAsyncFile.writeFile(LibPath.join(Const.PATH_CONFIG, "version.json"), JSON.stringify(appVer, null, 4));

        await LibAsyncFile.writeFile(this._versionRawPath, this._newVersion);
    }

    private async _parseVersion(): Promise<string> {
        this._versionRaw = (await LibAsyncFile.readFile(this._versionRawPath)).toString();

        let versionSplit: Array<string> = this._versionRaw.split(".");
        let patchVer: number = parseInt(versionSplit[2]); // 0.0.1 => [0, 0, 1] => versionSplit[2]: 1
        versionSplit[2] = (patchVer + 1).toString();

        this._newVersion = versionSplit.join(".");

        return Promise.resolve(this._newVersion);
    }

    private async _prepareNewVerDir() {
        this._newVerPath = LibPath.join(Const.PATH_DATABASE, this._newVersion);

        await MstUtil.instance.ensureDirs([
            this._newVerPath,
            LibPath.join(this._newVerPath, "images"),
            LibPath.join(this._newVerPath, "master"),
            LibPath.join(this._newVerPath, "origin"),
        ]);
    }

}