import * as LibPath from "path";

import * as LibAsyncFile from "async-file";

import Const from "../lib/const/Const";
import Utility from "../lib/utility/Utility";

export default class IndividualityConvertor {

    private _utility: Utility;
    private _dbJsonPath: string;

    private _invididuality: Array<Array<number | string>>; // [[2000, "\u795e\u6027"]]
    private _converted: Map<number, string>;

    constructor() {
        this._utility = new Utility();
        this._dbJsonPath = LibPath.join(Const.PATH_DATABASE, "individuality.json");

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
        this._converted = new Map<number, string>();
    }

    public async run(): Promise<any> {
        try {
            if (this._invididuality.length <= 0) {
                return Promise.resolve(this._converted);
            }

            for (let index in this._invididuality) {
                let id: number = this._invididuality[index][0] as number;
                let name: string = this._invididuality[index][1] as string;
                name = this._utility.fromUnicode(name);

                this._converted.set(id, name);
            }

            await LibAsyncFile.writeFile(this._dbJsonPath, JSON.stringify(this._utility.convertSimpleMapToObject(this._converted), null, "    "));
            return Promise.resolve(this._converted);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    get individuality()  {
        return this._converted;
    }

}