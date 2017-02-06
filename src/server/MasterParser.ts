import * as LibPath from "path";

import Config from "../lib/config/Config";
import Const from "../lib/const/Const";

// import {
//     MstClass,
//     MstSkill,
//     MstSvt,
//     MstSvtCard,
//     MstSvtLimit,
//     MstSvtSkill,
//     MstSkillLv,
//     MstSkillDetail,
//     MstTreasureDevice,
//     MstSvtTreasureDevice,
//     MstTreasureDeviceLv,
//     MstFriendship,
//     MstSvtComment,
//     MstCombineLimit,
//     MstCombineSkill,
//     MstItem,
//     MstSvtExp
// } from "../model/master/Master";

export default class MasterParser {

    private _dbMasterPath: string;

    // TODO 这个类需要将 master.json 里的内容按 interface 一个个存到单独的文件内，且主键之类的都需要重构
    constructor() {

    }

    public async run(): Promise<any> {
        try {
            let appVer = await Config.instance.loadConfig(Const.CONF_APP, "version");
            this._dbMasterPath = LibPath.join(Const.PATH_DATABASE, appVer, "master");

            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    private async _parseEntity(): Promise<any> {

    }

}