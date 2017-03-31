import * as RNFS from "react-native-fs";
import BaseContainer from "../../../lib/container/base/BaseContainer";
import * as MstContainers from "../../../model/impl/MstContainer";
import {
    MstSvtLimitContainer,
    MstSvtTreasureDeviceContainer,
    MstTreasureDeviceLvContainer
} from "../../../model/impl/MstContainer";
import MstUtil from "../utility/MstUtil";
import {EmbeddedCodeConverted, TransSvtName} from "../../../model/master/EmbeddedCodeConverted";
import {MstSvtLimit, MstSvtTreasureDevice, MstTreasureDeviceLv} from "../../../model/master/Master";
import {MstGoal, defaultMstGoal} from "./MstGoal";
import Const from "../const/Const";

export default class MstLoader {

    private static _instance: MstLoader = undefined;

    public static get instance(): MstLoader {
        if (MstLoader._instance === undefined) {
            MstLoader._instance = new MstLoader();
        }
        return MstLoader._instance;
    }

    private constructor() {
        this._cache = new Map<string, BaseContainer<any>>();
    }

    private _cache: Map<string, BaseContainer<any>>;
    private _embeddedCode: EmbeddedCodeConverted;

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* MAIN
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    public async loadModel(name: string): Promise<BaseContainer<any>> {
        if (this._cache.has(name)) {
            return Promise.resolve(this._cache.get(name));
        }

        let rawData = await MstUtil.instance.loadJson(
            `${await MstUtil.instance.getDbPath()}/master/${name}.json`
        );

        let containerName = `${name}Container`;
        let instance = new MstContainers[containerName]();
        instance.parse(rawData);
        this._cache.set(name, instance);

        return Promise.resolve(instance);
    }

    public async loadEmbeddedCode(): Promise<EmbeddedCodeConverted> {
        if (this._embeddedCode) {
            return Promise.resolve(this._embeddedCode);
        }

        let data = await MstUtil.instance.loadJson(
            `${await MstUtil.instance.getDbPath()}/embedded_code.json`
        ) as EmbeddedCodeConverted;
        this._embeddedCode = data;

        return Promise.resolve(data);
    }

    public async loadGoal(): Promise<MstGoal> {
        let goal = defaultMstGoal;
        let path = `${RNFS.DocumentDirectoryPath}/${Const.DB_FILE_PATH}`;

        let exists = await RNFS.exists(path);
        if (exists) {
            goal = await MstUtil.instance.loadJson(path) as MstGoal;
        }

        return Promise.resolve(goal);
    }

    public async writeGoal(goal: MstGoal): Promise<any> {
        return MstUtil.instance.writeJson(`${RNFS.DocumentDirectoryPath}/${Const.DB_FILE_PATH}`,
            JSON.stringify(goal, null, 4));
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* MASTER
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    public async loadSvtDefaultLimitInfo(svtId: number): Promise<MstSvtLimit> {
        let container = await MstLoader.instance.loadModel("MstSvtLimit") as MstSvtLimitContainer;
        let mstSvtLimit = container.get(svtId, 0); // 首位

        return Promise.resolve(mstSvtLimit);
    }

    public async loadSvtDefaultTreasureDeviceWithLv(svtId: number, level: number): Promise<MstTreasureDeviceLv> {
        // ensure level secure
        if (level < 0) {
            level = 1;
        } else if (level > 5) {
            level = 5;
        }

        let svtTreasureDeviceCon = await this.loadModel("MstSvtTreasureDevice") as MstSvtTreasureDeviceContainer;
        let svtTreasureDeviceLvCon = await this.loadModel("MstTreasureDeviceLv") as MstTreasureDeviceLvContainer;

        let devices = svtTreasureDeviceCon.getGroup(svtId);
        let device = devices.values().next().value;

        return Promise.resolve(svtTreasureDeviceLvCon.get(device.treasureDeviceId, level));
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* EMBEDDED CODE
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    public async loadEmbeddedGender(id: number): Promise<string> {
        return Promise.resolve((await this.loadEmbeddedCode()).gender[id]);
    }

    public async loadEmbeddedPolicy(id: number): Promise<string> {
        return Promise.resolve((await this.loadEmbeddedCode()).policy[id]);
    }

    public async loadEmbeddedPersonality(id: number): Promise<string> {
        return Promise.resolve((await this.loadEmbeddedCode()).personality[id]);
    }

    public async loadEmbeddedAttribute(id: number): Promise<string> {
        return Promise.resolve((await this.loadEmbeddedCode()).attri[id]);
    }

    public async loadEmbeddedSvtName(id: number): Promise<TransSvtName> {
        return Promise.resolve((await this.loadEmbeddedCode()).transSvtName[id]);
    }
}