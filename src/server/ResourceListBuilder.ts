import * as LibPath from "path";

import * as LibAsyncFile from "async-file";

import Const from "../lib/const/Const";
import Log from "../lib/log/Log";

export default class ResourceListBuilder {

    private _newVersion: string; // from VersionCheck.run

    private _embeddedCode: string = "embedded_code.json";
    private _resourceList: Array<string>;

    constructor(newVer: string) {
        Log.instance.info("[ResourceListBuilder] Starting ...");

        this._newVersion = newVer;
        this._resourceList = [];
    }

    public async run(): Promise<any> {
        let dbPath = LibPath.join(Const.PATH_DATABASE, this._newVersion);

        let subFiles = await LibAsyncFile.readdir(LibPath.join(dbPath, "master"));
        for (let subFileName of subFiles) {
            this._resourceList.push(`master/${subFileName}`);
        }
        this._resourceList.push(this._embeddedCode);

        await LibAsyncFile.writeFile(LibPath.join(dbPath, "resources.json"), JSON.stringify(this._resourceList, null, 4));

        return Promise.resolve(this._resourceList);
    }

}