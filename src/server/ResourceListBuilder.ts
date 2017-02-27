import * as LibPath from "path";

import * as LibAsyncFile from "async-file";

import MstUtil from "../model/impl/MstUtil";

export default class ResourceListBuilder {

    private _embeddedCode: string = "embedded_code.json";
    private _resourceList: Array<string>;

    constructor() {
        this._resourceList = [];
    }

    public async run(): Promise<any> {
        let dbPath = await MstUtil.instance.getDbPathWithVer();

        let subFiles = await LibAsyncFile.readdir(LibPath.join(dbPath, "master"));
        for (let subFileName of subFiles) {
            this._resourceList.push(`master/${subFileName}`);
        }
        this._resourceList.push(this._embeddedCode);

        await LibAsyncFile.writeFile(LibPath.join(dbPath, "resources.json"), JSON.stringify(this._resourceList, null, 4));

        return Promise.resolve(this._resourceList);
    }

}