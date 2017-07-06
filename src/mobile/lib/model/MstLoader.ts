import * as RNFS from "react-native-fs";
import BaseContainer from "../../../lib/container/base/BaseContainer";
import * as MstContainers from "../../../model/impl/MstContainer";
import {
    MstItemContainer,
    MstSvtLimitContainer,
    MstSvtTreasureDeviceContainer,
    MstTreasureDeviceLvContainer
} from "../../../model/impl/MstContainer";
import MstUtil from "../utility/MstUtil";
import {EmbeddedCodeConverted, TransSvtName} from "../../../model/master/EmbeddedCodeConverted";
import {MstItem, MstSvtLimit, MstSvtTreasureDevice, MstTreasureDeviceLv} from "../../../model/master/Master";
import {defaultMstGoal, MstGoal} from "./MstGoal";
import Const from "../const/Const";
import {Service} from "../../service/MstService";

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
        this._service = new Service();
    }

    private _cache: Map<string, BaseContainer<any>>;
    private _embeddedCode: EmbeddedCodeConverted;
    private _service: Service;

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* MAIN
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    public async loadModel(name: string): Promise<BaseContainer<any>> {
        if (this._cache.has(name)) {
            return Promise.resolve(this._cache.get(name));
        }

        let rawData = await MstUtil.instance.loadJson(
            `${await MstUtil.instance.getLocalDbPath()}/master/${name}.json`
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
            `${await MstUtil.instance.getLocalDbPath()}/embedded_code.json`
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

    public async writeGoal(goal: Object): Promise<any> {
        return MstUtil.instance.writeJson(`${RNFS.DocumentDirectoryPath}/${Const.DB_FILE_PATH}`, goal);
    }

    public async loadVisibleItemList(): Promise<Array<MstItem>> {
        let list = [] as Array<MstItem>;

        let container = await MstLoader.instance.loadModel("MstItem") as MstItemContainer;
        let items = container.getRaw() as Array<MstItem>;

        items.forEach((item: MstItem) => {
            if (this._service.isItemVisible(item.id)) {
                list.push(item);
            }
        });

        return list;
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* MASTER
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    public async loadSvtDefaultLimitInfo(svtId: number): Promise<MstSvtLimit> {
        let container = await MstLoader.instance.loadModel("MstSvtLimit") as MstSvtLimitContainer;
        let mstSvtLimit = container.get(svtId, 0); // 首位
        if (!mstSvtLimit) {
            // 某些从者数据污染，没有对应的信息，直接从group中默认拿第一个
            console.log(`Invalid svt default limit info: svtId: ${svtId}, limitCount: 0`);
            let limitGroup = container.getGroup(svtId);
            mstSvtLimit = limitGroup.values().next().value;
        }

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

        let treasureDevice = svtTreasureDeviceLvCon.get(device.treasureDeviceId, level);
        if (!treasureDevice) {
            // 某些从者数据污染，没有对应等级的宝具信息，直接从group中默认拿第一个
            console.log(`Invalid svt treasure device lv info: svtId: ${svtId}, level: ${level}`);
            let deviceGroup = svtTreasureDeviceLvCon.getGroup(device.treasureDeviceId);
            treasureDevice = deviceGroup.values().next().value;
        }

        return Promise.resolve(treasureDevice);
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