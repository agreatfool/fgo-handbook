import * as RNFS from "react-native-fs";
import BaseContainer from "../../../lib/container/base/BaseContainer";
import * as MstContainers from "../../../model/impl/MstContainer";
import MstUtil from "./MstUtil";

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

}