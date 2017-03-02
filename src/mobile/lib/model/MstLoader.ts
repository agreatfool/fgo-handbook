import * as RNFS from "react-native-fs";
import BaseContainer from "../../../lib/container/base/BaseContainer";
import * as MstContainers from "../../../model/impl/MstContainer";
import MstUtil from "./MstUtil";
import {
    EmbeddedCodeConverted, TransSvtName, TransSkillDetail,
    TransTreasureDetail
} from "../../../model/master/EmbeddedCodeConverted";

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
        let key = "EmbeddedCode";
        if (this._cache.has(key)) {
            return Promise.resolve(this._cache.get(key));
        }

        let data = await MstUtil.instance.loadJson(
            `${await MstUtil.instance.getDbPath()}/embedded_code.json`
        );

        return Promise.resolve(data as EmbeddedCodeConverted);
    }

    public async loadEmbeddedIndividuality(id: number): Promise<string> {
        return Promise.resolve((await this.loadEmbeddedCode()).individuality.get(id));
    }

    public async loadEmbeddedGender(id: number): Promise<string> {
        return Promise.resolve((await this.loadEmbeddedCode()).gender.get(id));
    }

    public async loadEmbeddedPolicy(id: number): Promise<string> {
        return Promise.resolve((await this.loadEmbeddedCode()).policy.get(id));
    }

    public async loadEmbeddedPersonality(id: number): Promise<string> {
        return Promise.resolve((await this.loadEmbeddedCode()).personality.get(id));
    }

    public async loadEmbeddedAttribute(id: number): Promise<string> {
        return Promise.resolve((await this.loadEmbeddedCode()).attri.get(id));
    }

    public async loadEmbeddedSvtName(id: number): Promise<TransSvtName> {
        return Promise.resolve((await this.loadEmbeddedCode()).transSvtName.get(id));
    }

    public async loadEmbeddedSkillDetail(id: number): Promise<TransSkillDetail> {
        return Promise.resolve((await this.loadEmbeddedCode()).transSkillDetail.get(id));
    }

    public async loadEmbeddedTreasureDetail(id: number): Promise<TransTreasureDetail> {
        return Promise.resolve((await this.loadEmbeddedCode()).transTreasureDetail.get(id));
    }
}