import * as LibPath from "path";

import * as LibAsyncFile from "async-file";

import HttpPromise from "../lib/http/Http";
import SourceConfig from "../model/config/SourceConfig";
import Const from "../lib/const/Const";
import {
    MstSvtContainer, MstSkillContainer, MstItemContainer
} from "../model/impl/MstContainer";
import MstLoader from "../model/impl/MstLoader";
import { MstSvt } from "../model/master/Master";
import MstUtil from "../model/impl/MstUtil";

export default class ResourceDownloader {

    private _libHttp: HttpPromise;

    private _sourceConf: SourceConfig;
    private _mstSvt: MstSvtContainer;
    private _mstSkill: MstSkillContainer;
    private _mstItem: MstItemContainer;

    private _imageSvtFacePath: string;
    private _imageSvtSkillPath: string;
    private _imageItemIconPath: string;

    constructor() {
        this._sourceConf = require(LibPath.join(Const.PATH_CONFIG, "source.json"));
    }

    public async run(): Promise<any> {
        try {
            this._mstSvt = await MstLoader.instance.loadModel("MstSvt") as MstSvtContainer;
            this._mstSkill = await MstLoader.instance.loadModel("MstSkill") as MstSkillContainer;
            this._mstItem = await MstLoader.instance.loadModel("MstItem") as MstItemContainer;

            let dbPath = await MstUtil.instance.getDbPathWithVer();
            this._imageSvtFacePath = LibPath.join(dbPath, "images", "face");
            this._imageSvtSkillPath = LibPath.join(dbPath, "images", "skill");
            this._imageItemIconPath = LibPath.join(dbPath, "images", "item");

            await MstUtil.instance.ensureDirs([
                LibPath.join(dbPath, "images"),
                this._imageSvtFacePath,
                this._imageSvtSkillPath,
                this._imageItemIconPath
            ]);

            await this._downloadServantResources();
            await this._downloadSkillResources();
            await this._downloadItemResources();
        } catch (err) {
            return Promise.reject(err);
        }
        return Promise.resolve();
    }

    private async _downloadServantResources() {
        for (let entity of this._mstSvt.iterator()) { // entity: [number, MstSvt]
            let svt = entity[1] as MstSvt;
            let svtId = svt.id;
            let url = this._genImageSvtFaceUri(svtId);
            console.log(url);

            let urlParts = url.split("/");
            let filename = urlParts[urlParts.length - 1];
            console.log(filename);

            let buff: Buffer = await this._libHttp.download(url);
            await LibAsyncFile.writeFile(LibPath.join(this._imageSvtFacePath, filename), buff, "binary");

            break;
        }
    }

    private async _downloadSkillResources() {

    }

    private async _downloadItemResources() {

    }

    private _genImageSvtFaceUri(svtId: number) {
        return this._genBaseSourceUri() +
            this._sourceConf.imageSvtFaceUri.replace("#SVTID", svtId + "");
    }

    private _genImageSvtSkillUri(skillId: number) {
        return this._genBaseSourceUri() +
            this._sourceConf.imageSvtSkillUri.replace("#SKILLID", skillId + "");
    }

    private _genImageItemIconUri(itemId: number) {
        return this._genBaseSourceUri() +
            this._sourceConf.imageItemIconUri.replace("#ITEMID", itemId + "");
    }

    private _genBaseSourceUri() {
        return `${this._sourceConf.protocol}://${this._sourceConf.originHost}/${this._sourceConf.baseUri}`;
    }

}