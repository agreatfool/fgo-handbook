import * as LibPath from "path";

import * as LibAsyncFile from "async-file";

import Config from "../lib/config/Config";
import Const from "../lib/const/Const";
import Utility from "../lib/utility/Utility";
import MstUtil from "../lib/model/MstUtil";
import Log from "../lib/log/Log";

export default class MasterDumper {

    private _newVersion: string; // from VersionCheck.run

    private _dbMasterDirPath: string;
    private _masterJson: any;

    constructor(newVer: string) {
        Log.instance.info("[MasterDumper] Starting ...");

        this._newVersion = newVer;
    }

    public async run(): Promise<any> {
        try {
            let dbPath = LibPath.join(Const.PATH_DATABASE, this._newVersion);
            this._dbMasterDirPath = LibPath.join(dbPath, "master");
            this._masterJson = await Config.instance.loadDbConfigWithVersion(Const.CONF_DB_ORIGIN_MASTER, null, this._newVersion);

            await MstUtil.instance.ensureDirs([this._dbMasterDirPath]);

            await this._parseEntities();

            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    private async _parseEntities(): Promise<any> {
        Log.instance.info("[MasterDumper] Processing _parseEntities ...");
        let names = [
            "MstClass",
            "MstSkill",
            "MstSvt",
            "MstSvtCard",
            "MstSvtLimit",
            "MstSvtSkill",
            "MstSkillLv",
            "MstSkillDetail",
            "MstTreasureDevice",
            "MstSvtTreasureDevice",
            "MstTreasureDeviceLv",
            "MstFriendship",
            "MstSvtComment",
            "MstCombineLimit",
            "MstCombineSkill",
            "MstItem",
            "MstSvtExp"
        ];

        for (let typeName of names) {
            await this._parseEntity(typeName);
        }

        return Promise.resolve();
    }

    private async _parseEntity(name: string): Promise<any> {
        Log.instance.info(`[MasterDumper] Processing _parseEntity: ${name} ...`);
        let lcName = Utility.lcFirst(name);
        let ucName = Utility.ucFirst(name);

        let rawData = this._masterJson[lcName];
        await LibAsyncFile.writeFile(LibPath.join(this._dbMasterDirPath, ucName + ".json"), JSON.stringify(rawData, null, 4));

        return Promise.resolve();
    }

}