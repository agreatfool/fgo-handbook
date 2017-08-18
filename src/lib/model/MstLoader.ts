import Config from "../config/Config";
import Const from "../const/Const";
import Utility from "../utility/Utility";
import BaseContainer from "../container/base/BaseContainer";

import * as MstContainers from "../../model/impl/MstContainer";

export default class MstLoader {

    private static _instance: MstLoader = undefined;

    public static get instance(): MstLoader {
        if (MstLoader._instance === undefined) {
            MstLoader._instance = new MstLoader();
        }
        return MstLoader._instance;
    }

    private _cache: Map<string, BaseContainer<any>>;

    private constructor() {
        this._cache = new Map<string, BaseContainer<any>>();
    }

    public async loadModel(name: string, version?: string): Promise<BaseContainer<any>> {
        if (this._cache.has(name)) {
            return Promise.resolve(this._cache.get(name));
        }

        let rawData = await Config.instance.loadDbConfigWithVersion(Const.CONF_DB_ORIGIN_MASTER, Utility.lcFirst(name), version);

        let containerName = Utility.ucFirst(name) + "Container";
        let instance = new MstContainers[containerName]();
        instance.parse(rawData);
        this._cache.set(name, instance);

        return Promise.resolve(instance);
    }

}