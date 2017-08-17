import * as LibPath from "path";

import * as LibAsyncFile from "async-file";

import Log from "../lib/log/Log";
import Config from "../lib/config/Config";
import Const from "../lib/const/Const";
import Utility from "../lib/utility/Utility";
import {
    TransSvtName,
    TransSkillDetail,
    TransTreasureDetail,
    EmbeddedCodeConverted
} from "../model/master/EmbeddedCodeConverted";

export default class EmbeddedCodeConvertor {

    private _newVersion: string; // from VersionCheck.run

    private _combined: EmbeddedCodeConverted;
    private _dbJsonPath: string;

    private _svtDataJsPath: string;
    private _svtData: string;

    // EMBEDDED CODE
    private _individuality: Array<Array<number | string>>; // 特性 [[2000, "\u795e\u6027"]]
    private _gender: Array<string>; // 性别
    private _policy: string; // 阵营：中立 混沌 秩序 ? ? 中立
    private _personality: string; // 个性：善 惡 ? 狂 中庸 ? 花嫁 夏
    private _attri: string; // 属性：？人天地星獸
    private _rankFont: string; // 从者能力评级：筋力 "A"
    private _rankSymbol: string; // 从者能力评级修饰符：筋力 A"+++"
    /**
     * 下述代码片段来自 https://kazemai.github.io/fgo-vz/common/js/transData.js
     * var svtName
     * var tdDetail
     * var skDetail
     * 部分内容过大，使用文件存储 database/embedded_trans.json
     * 该文件内容由 Crawler.ts 脚本内逻辑从网络抓取并处理
     */
    private _transSvtName: Array<Array<string>>;
    private _transSkillDetail: Array<Array<string>>;
    private _transTreasureDetail: Array<Array<string>>;

    // CONVERTED
    private _individualityConverted: {[key: number]: string}; // {2000: "神性"}
    private _genderConverted: {[key: number]: string}; // {2: "女性"}
    private _policyConverted: {[key: number]: string}; // {0: "中立"}
    private _personalityConverted: {[key: number]: string}; // {0: "善"}
    private _attriConverted: {[key: number]: string}; // {0: "地"}
    private _rankFontConverted: {[key: number]: string}; // {0: "A", 1: "B", ...}
    private _rankSymbolConverted: {[key: number]: string}; // {0: "+", 1: "++", ...}
    private _transSvtNameConverted: {[key: number]: TransSvtName};
    private _transSkillDetailConverted: {[key: number]: TransSkillDetail};
    private _transTreasureDetailConverted: {[key: number]: TransTreasureDetail};

    constructor(newVer: string) {
        Log.instance.info("[EmbeddedCodeConvertor] Starting ...");

        this._newVersion = newVer;
        /**
         * EMBEDDED CODE
         */
        /**
         * invididuality 来自 https://kazemai.github.io/fgo-vz/common/js/svtData.js
         * 顶部的代码
         * function svtDataTable(e) {
         * 下面的定义 "q = ..."
         */
        this._individuality = [
            [2000, "\u795e\u6027"],
            [2001, "\u4eba\u578b"],
            [2002, "\u9f8d"],
            [2004, "\u7f85\u99ac"],
            [2005, "\u731b\u7378"],
            [2007, "\u963f\u723e\u6258\u8389\u4e9e\u81c9"],
            [2008, "\u88ab\u300c\u5929\u5730\u4e56\u96e2\u958b\u8f9f\u4e4b\u661f\u300d\u6240\u524b"],
            [2009, "\u9a0e\u4e58"],
            [2010, "\u4e9e\u745f"],
            [2011, "\u88ab\u300c\u4eba\u985e\u795e\u8a71\u30fb\u96f7\u96fb\u964d\u81e8\u300d\u6240\u524b"],
            [2012, "\u611b\u4eba"],
            [2018, "\u6b7b\u9748\u8207\u60e1\u9b54"],
            [2019, "\u9b54\u6027"],
            [2037, "\u88ab\u300c\u795e\u79d8\u6bba\u3057\u300d\u6240\u524b"]
        ];
        /**
         * ["", "\u7537\u6027", "\u5973\u6027", "\u7121"][master.mstSvt[k].genderType]
         */
        this._gender = ["", "\u7537\u6027", "\u5973\u6027", "\u7121"];
        /**
         * " \u4e2d\u7acb \u6df7\u6c8c \u79e9\u5e8f ? ? \u4e2d\u7acb".split(" ")[master.mstSvtLimit[m].policy]
         */
        this._policy = " \u4e2d\u7acb \u6df7\u6c8c \u79e9\u5e8f ? ? \u4e2d\u7acb";
        /**
         * " \u5584 \u60e1 ? \u72c2 \u4e2d\u5eb8 ? \u82b1\u5ac1 \u590f".split(" ")[master.mstSvtLimit[m].personality]
         */
        this._personality = " \u5584 \u60e1 ? \u72c2 \u4e2d\u5eb8 ? \u82b1\u5ac1 \u590f";
        /**
         * "\uff1f\u4eba\u5929\u5730\u661f\u7378".split("")[master.mstSvt[k].attri]
         */
        this._attri = "\uff1f\u4eba\u5929\u5730\u661f\u7378";
        /**
         * p = " A B C D E EX ? ? ".split("")
         */
        this._rankFont = " A B C D E EX ? ? ";
        /**
         * l = "  + ++ ? +++ ? ? \uff1f \uff0d".split(" ")
         */
        this._rankSymbol = "  + ++ ? +++ ? ? \uff1f \uff0d";

        /**
         * CONVERTED
         */
        this._individualityConverted = {};
        this._genderConverted = {};
        this._policyConverted = {};
        this._personalityConverted = {};
        this._attriConverted = {};
        this._rankFontConverted = {};
        this._rankSymbolConverted = {};
        this._transSvtNameConverted = {};
        this._transSkillDetailConverted = {};
        this._transTreasureDetailConverted = {};
    }

    public async run(): Promise<any> {
        try {
            this._dbJsonPath = LibPath.join(Const.PATH_DATABASE, this._newVersion, "embedded_code.json");
            this._svtDataJsPath = LibPath.join(Const.PATH_DATABASE, this._newVersion, "origin", "svtData.js");

            this._svtData = (await LibAsyncFile.readFile(this._svtDataJsPath)).toString();

            await this._convertIndividuality();
            await this._convertGender();
            await this._convertPolicy();
            await this._convertPersonality();
            await this._convertAttri();
            await this._convertRankFont();
            await this._convertRankSymbol();
            await this._convertTransSvtName();
            await this._convertTransSkillDetail();
            await this._convertTransTreasureDetail();

            this._combined = {
                "individuality": this._individualityConverted,
                "gender": this._genderConverted,
                "policy": this._policyConverted,
                "personality": this._personalityConverted,
                "attri": this._attriConverted,
                "rankFont": this._rankFontConverted,
                "rankSymbol": this._rankSymbolConverted,
                "transSvtName": this._transSvtNameConverted,
                "transSkillDetail": this._transSkillDetailConverted,
                "transTreasureDetail": this._transTreasureDetailConverted
            };

            await LibAsyncFile.writeFile(this._dbJsonPath, JSON.stringify(Utility.convertToObject(this._combined), null, 4));

            return Promise.resolve(this._combined);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private async _convertIndividuality(): Promise<any> {
        Log.instance.info("[EmbeddedCodeConvertor] Processing _convertIndividuality ...");
        let data: Array<Array<number | string>>;

        // parse data from svtData.js
        try {
            let start = "[[";
            let end = "]]";

            let startPos = this._svtData.indexOf(start);
            let endPos = this._svtData.indexOf(end);
            let content = this._svtData.substr(
                startPos,
                endPos - startPos
            );
            data = eval(`${content}${end}`);
        } catch (e) {
            Log.instance.info("[EmbeddedCodeConvertor] Error in _convertIndividuality, use predefined data ...");
            data = this._individuality;
        }

        // process individuality
        try {
            if (data.length <= 0) {
                return Promise.resolve(this._individualityConverted);
            }
            for (let index in data) {
                let id: number = data[index][0] as number;
                this._individualityConverted[id] = Utility.fromUnicode(data[index][1] as string);
            }
            return Promise.resolve(this._individualityConverted);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private async _convertGender(): Promise<any> {
        Log.instance.info("[EmbeddedCodeConvertor] Processing _convertGender ...");
        let data: Array<string>;

        // parse data from svtData.js
        try {
            let reg = new RegExp(/\+\[(.+)]\[master\.mstSvt\[.]\.genderType]/);
            let match = this._svtData.match(reg);
            if (!match || match.length <= 0) {
                data = this._gender;
            } else {
                data = eval(`[${match[1]}]`);
            }
        } catch (e) {
            Log.instance.info("[EmbeddedCodeConvertor] Error in _convertGender, use predefined data ...");
            data = this._gender;
        }

        // process gender
        try {
            if (data.length <= 0) {
                return Promise.resolve(this._genderConverted);
            }
            let id = 0;
            for (let index in data) {
                this._genderConverted[id] = Utility.fromUnicode(data[index]);
                id++;
            }
            return Promise.resolve(this._genderConverted);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private async _convertPolicy(): Promise<any> {
        Log.instance.info("[EmbeddedCodeConvertor] Processing _convertPolicy ...");
        let data: string;

        // parse data from svtData.js
        try {
            let reg = new RegExp(/\+\("<td>"\+"(.+)".split\(" "\)\[master\.mstSvtLimit\[.]\.policy]/);
            let match = this._svtData.match(reg);
            if (!match || match.length <= 0) {
                data = this._policy;
            } else {
                data = match[1];
            }
        } catch (e) {
            Log.instance.info("[EmbeddedCodeConvertor] Error in _convertPolicy, use predefined data ...");
            data = this._policy;
        }

        // process policy
        try {
            if (data.length <= 0) {
                return Promise.resolve(this._policyConverted);
            }
            let id = 0;
            let split: Array<string> = data.split(" ");
            for (let index in split) {
                this._policyConverted[id] = Utility.fromUnicode(split[index]);
                id++;
            }
            return Promise.resolve(this._policyConverted);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private async _convertPersonality(): Promise<any> {
        Log.instance.info("[EmbeddedCodeConvertor] Processing _convertPersonality ...");
        let data: string;

        // parse data from svtData.js
        try {
            let reg = new RegExp(/policy]\+"\\u30fb"\+"(.+)"\.split\(" "\)\[master\.mstSvtLimit\[.]\.personality]/);
            let match = this._svtData.match(reg);
            if (!match || match.length <= 0) {
                data = this._personality;
            } else {
                data = match[1];
            }
        } catch (e) {
            Log.instance.info("[EmbeddedCodeConvertor] Error in _convertPersonality, use predefined data ...");
            data = this._personality;
        }

        // process personality
        try {
            if (data.length <= 0) {
                return Promise.resolve(this._personalityConverted);
            }
            let id = 0;
            let split: Array<string> = data.split(" ");
            for (let index in split) {
                this._personalityConverted[id] = Utility.fromUnicode(split[index]);
                id++;
            }
            return Promise.resolve(this._personalityConverted);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private async _convertAttri(): Promise<any> {
        Log.instance.info("[EmbeddedCodeConvertor] Processing _convertAttri ...");
        let data: string;

        // parse data from svtData.js
        try {
            let reg = new RegExp(/\+="<td>"\+"(.+)"\.split\(""\)\[master\.mstSvt\[.]\.attri]/);
            let match = this._svtData.match(reg);
            if (!match || match.length <= 0) {
                data = this._attri;
            } else {
                data = match[1];
            }
        } catch (e) {
            Log.instance.info("[EmbeddedCodeConvertor] Error in _convertAttri, use predefined data ...");
            data = this._attri;
        }

        // process attributes
        try {
            if (data.length <= 0) {
                return Promise.resolve(this._attriConverted);
            }
            let id = 0;
            let split: Array<string> = Utility.fromUnicode(data).split("");
            for (let index in split) {
                this._attriConverted[id] = split[index];
                id++;
            }
            return Promise.resolve(this._attriConverted);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private async _convertRankFont(): Promise<any> {
        Log.instance.info("[EmbeddedCodeConvertor] Processing _convertRankFont ...");
        try {
            if (this._rankFont.length <= 0) {
                return Promise.resolve(this._rankFontConverted);
            }
            let id = 0;
            let split: Array<string> = this._rankFont.split(" ");
            for (let index in split) {
                this._rankFontConverted[id] = Utility.fromUnicode(split[index]);
                id++;
            }
            return Promise.resolve(this._rankFontConverted);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private async _convertRankSymbol(): Promise<any> {
        Log.instance.info("[EmbeddedCodeConvertor] Processing _convertRankSymbol ...");
        try {
            if (this._rankSymbol.length <= 0) {
                return Promise.resolve(this._rankSymbolConverted);
            }
            let id = 0;
            let split: Array<string> = this._rankSymbol.split(" ");
            for (let index in split) {
                this._rankSymbolConverted[id] = Utility.fromUnicode(split[index]);
                id++;
            }
            return Promise.resolve(this._rankSymbolConverted);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private async _convertTransSvtName(): Promise<any> {
        Log.instance.info("[EmbeddedCodeConvertor] Processing _convertTransSvtName ...");
        try {
            let embeddedTransData = await Config.instance.loadDbConfigWithVersion(Const.CONF_DB_EMBEDDED_TRANS);

            for (let nameInfo of embeddedTransData["name"]) {
                let svtId: number = parseInt((nameInfo as Array<string>)[0]);
                let name: string = (nameInfo as Array<string>)[1];
                let battleName: string = (nameInfo as Array<string>)[2];

                if (this._transSvtNameConverted.hasOwnProperty(svtId)) {
                    Log.instance.warn(`[EmbeddedCodeConvertor] _convertTransSvtName: Duplicate svtId: ${svtId}!`);
                }

                this._transSvtNameConverted[svtId] = {
                    "svtId": svtId,
                    "name": name,
                    "battleName": battleName
                };
            }
            return Promise.resolve(this._transSvtNameConverted);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private async _convertTransSkillDetail(): Promise<any> {
        Log.instance.info("[EmbeddedCodeConvertor] Processing _convertTransSkillDetail ...");
        try {
            let embeddedTransData = await Config.instance.loadDbConfigWithVersion(Const.CONF_DB_EMBEDDED_TRANS);

            for (let skillInfo of embeddedTransData["skill"]) {
                let skillId: number = parseInt((skillInfo as Array<string>)[0]);
                let detail: string = (skillInfo as Array<string>)[1];
                let effect1: Array<string> = Utility.isVoid((skillInfo as Array<string>)[2]) ? [] : (skillInfo as Array<string>)[2].split("/");
                let effect2: Array<string> = Utility.isVoid((skillInfo as Array<string>)[3]) ? [] : (skillInfo as Array<string>)[3].split("/");
                let effect3: Array<string> = Utility.isVoid((skillInfo as Array<string>)[4]) ? [] : (skillInfo as Array<string>)[4].split("/");
                if (this._transSkillDetailConverted.hasOwnProperty(skillId)) {
                    Log.instance.warn(`[EmbeddedCodeConvertor] _convertTransSkillDetail: Duplicate skillId: ${skillId}!`);
                }

                this._transSkillDetailConverted[skillId] = {
                    "skillId": skillId,
                    "detail": detail,
                    "effect1": effect1,
                    "effect2": effect2,
                    "effect3": effect3
                };
            }
            return Promise.resolve(this._transSkillDetailConverted);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private async _convertTransTreasureDetail(): Promise<any> {
        Log.instance.info("[EmbeddedCodeConvertor] Processing _convertTransTreasureDetail ...");
        try {
            let embeddedTransData = await Config.instance.loadDbConfigWithVersion(Const.CONF_DB_EMBEDDED_TRANS);

            for (let treasureInfo of embeddedTransData["treasure"]) {
                let treasureId: number = parseInt((treasureInfo as Array<string>)[0]);
                let detail: string = (treasureInfo as Array<string>)[1];
                let effect1: Array<string> = Utility.isVoid((treasureInfo as Array<string>)[2]) ? [] : (treasureInfo as Array<string>)[2].split("/");
                let effect2: Array<string> = Utility.isVoid((treasureInfo as Array<string>)[3]) ? [] : (treasureInfo as Array<string>)[3].split("/");
                let effect3: Array<string> = Utility.isVoid((treasureInfo as Array<string>)[4]) ? [] : (treasureInfo as Array<string>)[4].split("/");
                let effect4: Array<string> = Utility.isVoid((treasureInfo as Array<string>)[5]) ? [] : (treasureInfo as Array<string>)[5].split("/");
                if (this._transTreasureDetailConverted.hasOwnProperty(treasureId)) {
                    Log.instance.warn(`[EmbeddedCodeConvertor] _convertTransTreasureDetail: Duplicate treasureId: ${treasureId}!`);
                }

                this._transTreasureDetailConverted[treasureId] = {
                    "treasureId": treasureId,
                    "detail": detail,
                    "effect1": effect1,
                    "effect2": effect2,
                    "effect3": effect3,
                    "effect4": effect4
                };
            }
            return Promise.resolve(this._transTreasureDetailConverted);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    get individuality() {
        return this._individualityConverted;
    }

}