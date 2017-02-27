import * as LibPath from "path";

import * as LibAsyncFile from "async-file";

import Config from "../lib/config/Config";
import Const from "../lib/const/Const";
import Utility from "../lib/utility/Utility";
import MstUtil from "../lib/model/MstUtil";

export default class MasterDumper {

    private _dbMasterDirPath: string;
    private _masterJson: any;

    public async run(): Promise<any> {
        try {
            let dbPath = await MstUtil.instance.getDbPathWithVer();
            this._dbMasterDirPath = LibPath.join(dbPath, "master");
            this._masterJson = await Config.instance.loadDbConfigWithVersion(Const.CONF_DB_ORIGIN_MASTER);

            await MstUtil.instance.ensureDirs([this._dbMasterDirPath]);

            await this._parseEntities();

            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    private async _parseEntities(): Promise<any> {
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
        let lcName = Utility.lcFirst(name);
        let ucName = Utility.ucFirst(name);

        let rawData = this._masterJson[lcName];
        await LibAsyncFile.writeFile(LibPath.join(this._dbMasterDirPath, ucName + ".json"), JSON.stringify(rawData, null, 4));

        return Promise.resolve();
    }

}