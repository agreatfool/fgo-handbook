import * as LibPath from "path";

import * as AsyncFile from "async-file";

import Config from "../lib/config/Config";
import Const from "../lib/const/Const";
import Utility from "../lib/utility/Utility";

export default class MasterDumper {

    private _dbMasterDirPath: string;
    private _masterJson: any;

    public async run(): Promise<any> {
        try {
            let appVer = await Config.instance.loadConfig(Const.CONF_APP, "version");
            this._dbMasterDirPath = LibPath.join(Const.PATH_DATABASE, appVer, "master");
            this._masterJson = await Config.instance.loadDbConfigWithVersion(Const.CONF_DB_ORIGIN_MASTER);

            let dirExists = await AsyncFile.exists(this._dbMasterDirPath);
            if (!dirExists) {
                await AsyncFile.createDirectory(this._dbMasterDirPath);
            }

            //noinspection JSIgnoredPromiseFromCall
            this._parseEntities();

            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    private async _parseEntities(): Promise<any> {
        [
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
        ].forEach((name) => {
            //noinspection JSIgnoredPromiseFromCall
            this._parseEntity(name);
        });
    }

    private async _parseEntity(name: string): Promise<any> {
        let lcName = Utility.lcFirst(name);
        let ucName = Utility.ucFirst(name);

        let rawData = this._masterJson[lcName];
        await AsyncFile.writeFile(LibPath.join(this._dbMasterDirPath, ucName + ".json"), JSON.stringify(rawData, null, 4));
    }

}