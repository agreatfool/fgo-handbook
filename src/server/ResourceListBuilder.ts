import * as LibPath from "path";
import * as LibUtil from "util";

import * as LibAsyncFile from "async-file";
import * as LibNcp from "ncp";
import * as rimraf from "rimraf";

import Const from "../lib/const/Const";
import Log from "../lib/log/Log";
import {TplEngine} from "./lib/Template";
import MstUtil from "../lib/model/MstUtil";

const ncp = LibUtil.promisify(LibNcp.ncp) as (source: string, destination: string, options?: LibNcp.Options) => Promise<void>;
const rmrf = LibUtil.promisify(rimraf) as (path: string, options?: rimraf.Options) => Promise<void>;

export default class ResourceListBuilder {

    private _newVersion: string; // from VersionCheck.run

    private _dbPath: string;
    private _imagePath: string;
    private _masterPath: string;
    private _images: { [key: string]: Array<number> }; // {"face": [0, 1, 2, 3]} => require("../../face/0.png")

    constructor(newVer: string) {
        Log.instance.info("[ResourceListBuilder] Starting ...");

        this._newVersion = newVer;

        this._dbPath = LibPath.join(Const.PATH_DATABASE, this._newVersion);
        this._imagePath = LibPath.join(this._dbPath, "images");
        this._masterPath = LibPath.join(this._dbPath, "master");
        this._images = {};
    }

    public async run(): Promise<any> {
        await this._clearResources();
        await this._copyPreparedResources();
        await this._processMasterPool();
        await this._processImagePool();
    }

    private async _clearResources(): Promise<any> {
        Log.instance.info("[ResourceListBuilder] Processing _clearResources ...");

        await rmrf(Const.PATH_RESOURCE);
        await MstUtil.instance.ensureDirs([Const.PATH_RESOURCE]);
    }

    private async _copyPreparedResources(): Promise<any> {
        Log.instance.info("[ResourceListBuilder] Processing _copyPreparedResources ...");

        await ncp(this._dbPath, Const.PATH_RESOURCE);
    }

    private async _processMasterPool(): Promise<any> {
        Log.instance.info("[ResourceListBuilder] Processing _processMasterPool ...");

        let masterNames = [] as Array<string>;
        let subFiles = await LibAsyncFile.readdir(LibPath.join(this._masterPath));
        for (let subFileName of subFiles) {
            masterNames.push(LibPath.basename(subFileName, ".json"));
        }

        let content = TplEngine.render("MasterPool", {
            names: masterNames
        });
        await LibAsyncFile.writeFile(LibPath.join(Const.PATH_RESOURCE, "MasterPool.ts"), content);

        return Promise.resolve();
    }

    private async _processImagePool(): Promise<any> {
        Log.instance.info("[ResourceListBuilder] Processing _processImagePool ...");

        this._images["class"] = await this._readImageList("class");
        this._images["face"] = await this._readImageList("face");
        this._images["item"] = await this._readImageList("item");
        this._images["skill"] = await this._readImageList("skill");

        TplEngine.registerHelper("toUpperCase", function (str) {
            return str.toUpperCase();
        });
        let content = TplEngine.render("ImagePool", {
            images: this._images
        });
        await LibAsyncFile.writeFile(LibPath.join(Const.PATH_RESOURCE, "ImagePool.ts"), content);

        return Promise.resolve();
    }

    private async _readImageList(subDir: string): Promise<Array<number>> {
        let ids = [];

        let subFiles = await LibAsyncFile.readdir(LibPath.join(this._imagePath, subDir));
        for (let subFileName of subFiles) {
            ids.push(LibPath.basename(subFileName, ".png"));
        }

        return Promise.resolve(ids);
    }

}