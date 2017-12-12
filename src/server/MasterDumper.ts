import * as LibPath from "path";

import * as LibAsyncFile from "async-file";

import HttpPromise from "../lib/http/Http";
import Config from "../lib/config/Config";
import Const from "../lib/const/Const";
import Utility from "../lib/utility/Utility";
import MstUtil from "../lib/model/MstUtil";
import Log from "../lib/log/Log";
import {MstSvt, MstSvtComment} from "../model/master/Master";
import SourceConfig from "../model/config/SourceConfig";

export default class MasterDumper {

    private _newVersion: string; // from VersionCheck.run

    private _sourceConf: SourceConfig;
    private _libHttp: HttpPromise;
    private _commentUrl: string;

    private _dbMasterDirPath: string;
    private _masterJson: any;

    public static readonly VALID_CLASS_IDS: Array<number> = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, // 剑弓枪骑术杀狂盾裁AlterEgo仇
        17, // Grand Caster
        20, // 提亚马特
        22, // 魔神王盖提亚
        23, // Moon Cancer
        25, // Foreigner
    ];

    constructor(newVer: string) {
        Log.instance.info("[MasterDumper] Starting ...");

        this._sourceConf = require(LibPath.join(Const.PATH_CONFIG, "source.json"));
        this._libHttp = new HttpPromise();
        this._commentUrl = `${this._sourceConf.protocol}://${this._sourceConf.originHost}/${this._sourceConf.baseUri}`;

        this._newVersion = newVer;
    }

    public async run(): Promise<any> {
        try {
            let dbPath = LibPath.join(Const.PATH_DATABASE, this._newVersion);
            this._dbMasterDirPath = LibPath.join(dbPath, "master");
            this._masterJson = await Config.instance.loadDbConfigWithVersion(Const.CONF_DB_ORIGIN_MASTER, null, this._newVersion);

            await MstUtil.instance.ensureDirs([this._dbMasterDirPath]);

            await this._parseEntities();
            await this._loadMstSvtComments();

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
            // "MstSvtComment", // already handled by this._loadMstSvtComments
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

    private async _loadMstSvtComments() {
        let comments: Array<MstSvtComment> = [];

        let mstSvt = this._masterJson["mstSvt"];
        let filtered: Array<MstSvt> = this._filterSvtRawData(mstSvt);

        let current = 0;
        let total = filtered.length;

        for (let svtInfo of filtered) {
            let url = this._genCommentUri(svtInfo.id);

            let content: Buffer = await this._libHttp.get(url);
            let decoded = new Buffer(content.toString("utf-8"), "base64").toString("utf-8");
            let parsed = JSON.parse(decoded);

            comments = comments.concat(parsed);

            current++;
            Log.instance.info(`[MasterDumper] _loadMstSvtComments: Downloaded ${current}/${total}, url: ${url}`);
        }

        await LibAsyncFile.writeFile(LibPath.join(this._dbMasterDirPath, "MstSvtComment.json"), JSON.stringify(comments, null, 4));
    }

    private _filterSvtRawData(rawData: Array<MstSvt>): Array<MstSvt> {
        return rawData.filter((element: MstSvt) => {
            return (MasterDumper.VALID_CLASS_IDS.indexOf(element.classId) !== -1)
                && (element.collectionNo > 0);
        });
    }

    private _genCommentUri(svtId: number): string {
        return `${this._sourceConf.protocol}://${this._sourceConf.originHost}/${this._sourceConf.baseUri}/${this._sourceConf.commentUri.replace("#SVTID", svtId + "")}`;
    }

}