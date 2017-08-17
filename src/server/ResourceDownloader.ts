import * as LibPath from "path";

import HttpPromise from "../lib/http/Http";
import SourceConfig from "../model/config/SourceConfig";
import Const from "../lib/const/Const";
import {
    MstSvtContainer, MstSkillContainer, MstItemContainer, MstClassContainer
} from "../model/impl/MstContainer";
import MstLoader from "../lib/model/MstLoader";
import {MstSvt, MstSkill, MstItem, MstClass} from "../model/master/Master";
import MstUtil from "../lib/model/MstUtil";
import Log from "../lib/log/Log";

export default class ResourceDownloader {

    private _newVersion: string; // from VersionCheck.run

    private _libHttp: HttpPromise;

    private _sourceConf: SourceConfig;
    private _mstSvt: MstSvtContainer;
    private _mstSkill: MstSkillContainer;
    private _mstItem: MstItemContainer;
    private _mstClass: MstClassContainer;

    private _imageSvtFacePath: string;
    private _imageSvtSkillPath: string;
    private _imageItemIconPath: string;
    private _imageClassIconPath: string;

    constructor(newVer: string) {
        Log.instance.info("[ResourceDownloader] Starting ...");

        this._newVersion = newVer;
        this._libHttp = new HttpPromise();
        this._sourceConf = require(LibPath.join(Const.PATH_CONFIG, "source.json"));
    }

    public async run(): Promise<any> {
        try {
            this._mstSvt = await MstLoader.instance.loadModel("MstSvt") as MstSvtContainer;
            this._mstSkill = await MstLoader.instance.loadModel("MstSkill") as MstSkillContainer;
            this._mstItem = await MstLoader.instance.loadModel("MstItem") as MstItemContainer;
            this._mstClass = await MstLoader.instance.loadModel("MstClass") as MstClassContainer;

            let dbPath = LibPath.join(Const.PATH_DATABASE, this._newVersion);
            this._imageSvtFacePath = LibPath.join(dbPath, "images", "face");
            this._imageSvtSkillPath = LibPath.join(dbPath, "images", "skill");
            this._imageItemIconPath = LibPath.join(dbPath, "images", "item");
            this._imageClassIconPath = LibPath.join(dbPath, "images", "class");

            await MstUtil.instance.ensureDirs([
                LibPath.join(dbPath, "images"),
                this._imageSvtFacePath,
                this._imageSvtSkillPath,
                this._imageItemIconPath,
                this._imageClassIconPath,
            ]);

            await this._downloadServantResources();
            await this._downloadSkillResources();
            await this._downloadItemResources();
            await this._downloadClassResources();
        } catch (err) {
            return Promise.reject(err);
        }
        return Promise.resolve();
    }

    private async _downloadServantResources(): Promise<any> {
        let total = this._mstSvt.count();
        Log.instance.info(`[ResourceDownloader] _downloadServantResources: total count: ${total}`);

        let current = 0;
        for (let [id, svt] of this._mstSvt.iterator()) {
            let svtId = (svt as MstSvt).id;
            let url = this._genImageSvtFaceUri(svtId);
            let urlParts = url.split(".");
            let ext = urlParts[urlParts.length - 1];
            let filename = svtId + "." + ext;
            let filePath = LibPath.join(this._imageSvtFacePath, filename);

            let result = await this._libHttp.downloadWithCheck(url, filePath);
            current++;
            Log.instance.info(`[ResourceDownloader] _downloadServantResources: Downloaded ${current}/${total}: ${result}; url: ${url}, file: ${filePath}`);
        }
    }

    private async _downloadSkillResources(): Promise<any> {
        let total = this._mstSkill.count();
        Log.instance.info(`[ResourceDownloader] _downloadSkillResources: total count: ${total}`);

        let iconIdList = [];
        let current = 0;
        for (let [id, skill] of this._mstSkill.iterator()) {
            let skillIconId = (skill as MstSkill).iconId;
            if (iconIdList.indexOf(skillIconId) !== -1) {
                current++;
                continue;
            }
            iconIdList.push(skillIconId);
            let url = this._genImageSvtSkillUri(skillIconId);
            let urlParts = url.split(".");
            let ext = urlParts[urlParts.length - 1];
            let filename = skill.iconId + "." + ext;
            let filePath = LibPath.join(this._imageSvtSkillPath, filename);

            let result = await this._libHttp.downloadWithCheck(url, filePath);
            current++;
            Log.instance.info(`[ResourceDownloader] _downloadSkillResources: Downloaded ${current}/${total}: ${result}; url: ${url}, file: ${filePath}`);
        }
    }

    private async _downloadItemResources(): Promise<any> {
        let total = this._mstItem.count();
        Log.instance.info(`[ResourceDownloader] _downloadItemResources: total count: ${total}`);

        let current = 0;
        for (let [id, item] of this._mstItem.iterator()) {
            let itemId = (item as MstItem).id;
            let url = this._genImageItemIconUri(itemId);
            let urlParts = url.split(".");
            let ext = urlParts[urlParts.length - 1];
            let filename = itemId + "." + ext;
            let filePath = LibPath.join(this._imageItemIconPath, filename);

            let result = await this._libHttp.downloadWithCheck(url, filePath);
            current++;
            Log.instance.info(`[ResourceDownloader] _downloadItemResources: Downloaded ${current}/${total}: ${result}; url: ${url}, file: ${filePath}`);
        }
    }

    private async _downloadClassResources(): Promise<any> {
        let total = this._mstClass.count();
        Log.instance.info(`[ResourceDownloader] _downloadClassResources: total count: ${total}`);

        let current = 0;
        for (let [id, classObj] of this._mstClass.iterator()) {
            let classId = (classObj as MstClass).id;
            let url = this._genImageClassIconUri(classId);
            let urlParts = url.split(".");
            let ext = urlParts[urlParts.length - 1];
            let filename = classId + "." + ext;
            let filePath = LibPath.join(this._imageClassIconPath, filename);

            let result = await this._libHttp.downloadWithCheck(url, filePath);
            current++;
            Log.instance.info(`[ResourceDownloader] _downloadClassResources: Downloaded ${current}/${total}: ${result}; url: ${url}, file: ${filePath}`);
        }
    }

    private _genImageSvtFaceUri(svtId: number): string {
        return this._genBaseSourceUri() + "/" +
            this._sourceConf.imageSvtFaceUri.replace("#SVTID", svtId + "0"); // 后面就是多了个0，我也不知道为啥；存储成文件的时候我仍旧按id来，不补0
    }

    private _genImageSvtSkillUri(skillId: number): string {
        return this._genBaseSourceUri() + "/" +
            this._sourceConf.imageSvtSkillUri.replace("#SKILLID", skillId + "");
    }

    private _genImageItemIconUri(itemId: number): string {
        return this._genBaseSourceUri() + "/" +
            this._sourceConf.imageItemIconUri.replace("#ITEMID", itemId + "");
    }

    private _genImageClassIconUri(classId: number): string {
        return this._genBaseSourceUri() + "/" +
            this._sourceConf.imageClassIconUri.replace("#CLASSID", classId + "");
    }

    private _genBaseSourceUri(): string {
        return `${this._sourceConf.protocol}://${this._sourceConf.originHost}/${this._sourceConf.baseUri}`;
    }

}