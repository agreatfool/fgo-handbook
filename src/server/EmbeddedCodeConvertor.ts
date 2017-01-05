import * as LibPath from "path";

import * as LibAsyncFile from "async-file";

import Const from "../lib/const/Const";
import Utility from "../lib/utility/Utility";

export default class EmbeddedCodeConvertor {

    private _combined: Map<string, Map<number, string>>;
    private _dbJsonPath: string;

    // EMBEDDED CODE
    private _invididuality: Array<Array<number | string>>; // 特性 [[2000, "\u795e\u6027"]]
    private _gender: Array<string>; // 性别
    private _policy: string; // 阵营：中立 混沌 秩序 ? ? 中立
    private _personality: string; // 个性：善 惡 ? 狂 中庸 ? 花嫁 夏

    // CONVERTED
    private _invididualityConverted: Map<number, string>; // {2000: "神性"}
    private _genderConverted: Map<number, string>; // {2: "女性"}
    private _policyConverted: Map<number, string>; // {0: "中立"}
    private _personalityConverted: Map<number, string>; // {0: "善"}

    constructor() {
        this._combined = new Map<string, Map<number, string>>();
        this._dbJsonPath = LibPath.join(Const.PATH_DATABASE, "embedded_code.json");

        /**
         * EMBEDDED CODE
         */
        /**
         * invididuality 来自 https://kazemai.github.io/fgo-vz/common/js/svtData.js
         * 顶部的代码
         * function svtDataTable(e) {
         * 下面的定义 "q = ..."
         */
        this._invididuality = [
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
         * CONVERTED
         */
        this._invididualityConverted = new Map<number, string>();
        this._genderConverted = new Map<number, string>();
        this._policyConverted = new Map<number, string>();
        this._personalityConverted = new Map<number, string>();
    }

    public async run(): Promise<any> {
        try {
            await this._convertIndividuality();
            await this._convertGender();
            await this._convertPolicy();
            await this._convertPersonality();

            this._combined.set("invididuality", this._invididualityConverted);
            this._combined.set("gender", this._genderConverted);
            this._combined.set("policy", this._policyConverted);
            this._combined.set("personality", this._personalityConverted);

            await LibAsyncFile.writeFile(this._dbJsonPath, JSON.stringify(Utility.convertSimpleMapToObject(this._combined), null, "    "));

            return Promise.resolve(this._invididualityConverted);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private async _convertIndividuality(): Promise<any> {
        try {
            if (this._invididuality.length <= 0) {
                return Promise.resolve(this._invididualityConverted);
            }
            for (let index in this._invididuality) {
                let id: number = this._invididuality[index][0] as number;
                let name: string = Utility.fromUnicode(this._invididuality[index][1] as string);

                this._invididualityConverted.set(id, name);
            }
            return Promise.resolve(this._invididualityConverted);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private async _convertGender(): Promise<any> {
        try {
            if (this._gender.length <= 0) {
                return Promise.resolve(this._genderConverted);
            }
            let id = 0;
            for (let index in this._gender) {
                this._genderConverted.set(id, Utility.fromUnicode(this._gender[index]));
                id++;
            }
            return Promise.resolve(this._genderConverted);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private async _convertPolicy(): Promise<any> {
        try {
            if (this._policy.length <= 0) {
                return Promise.resolve(this._policyConverted);
            }
            let id = 0;
            let split: Array<string> = this._policy.split(" ");
            for (let index in split) {
                this._policyConverted.set(id, Utility.fromUnicode(split[index]));
                id++;
            }
            return Promise.resolve(this._policyConverted);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private async _convertPersonality(): Promise<any> {
        try {
            if (this._personality.length <= 0) {
                return Promise.resolve(this._personalityConverted);
            }
            let id = 0;
            let split: Array<string> = this._personality.split(" ");
            for (let index in split) {
                this._personalityConverted.set(id, Utility.fromUnicode(split[index]));
                id++;
            }
            return Promise.resolve(this._personalityConverted);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    get individuality()  {
        return this._invididualityConverted;
    }

}