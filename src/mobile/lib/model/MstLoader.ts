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
import {ImagePool} from "../../../resource/ImagePool";
import {MasterPool} from "../../../resource/MasterPool";
import VersionConfig from "../../../model/config/VersionConfig";

const VersionInfo = require("../../../../config/version.json") as VersionConfig;
const EmbeddedCode = require("../../../resource/embedded_code.json") as EmbeddedCodeConverted;

export default class MstLoader {

    private static _instance: MstLoader = undefined;

    public static get instance(): MstLoader {
        if (MstLoader._instance === undefined) {
            MstLoader._instance = new MstLoader();
        }
        return MstLoader._instance;
    }

    private constructor() {
        this._modelCache = new Map<string, BaseContainer<any>>();
        this._service = new Service();
        this._basePath = "../../../..";
        this._resourcePath = "../../../resource";

        console.log(RNFS.DocumentDirectoryPath);
    }

    private _modelCache: Map<string, BaseContainer<any>>;
    private _service: Service;

    private _basePath: string;
    private _resourcePath: string;

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* RESOURCE
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    public getAppVer(): string {
        return VersionInfo.version;
    }

    public loadImage(type: string, id: number): any {
        let key = `${type.toUpperCase()}${id}`;
        if (!ImagePool.hasOwnProperty(key)) {
            return ImagePool.SKILL0; // default unknown image
        } else {
            return ImagePool[key];
        }
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* MODEL
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    public loadModel(name: string): BaseContainer<any> {
        if (this._modelCache.has(name)) {
            return this._modelCache.get(name);
        }

        let rawData = MasterPool[name];
        let containerName = `${name}Container`;
        let instance = new MstContainers[containerName]();
        instance.parse(rawData);
        this._modelCache.set(name, instance);

        return instance;
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* GOAL
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
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

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* MASTER DATA
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    public loadSvtDefaultLimitInfo(svtId: number): MstSvtLimit {
        let container = MstLoader.instance.loadModel("MstSvtLimit") as MstSvtLimitContainer;
        let mstSvtLimit = container.get(svtId, 0); // 首位
        if (!mstSvtLimit) {
            // 某些从者数据污染，没有对应的信息，直接从group中默认拿第一个
            console.log(`Invalid svt default limit info: svtId: ${svtId}, limitCount: 0`);
            let limitGroup = container.getGroup(svtId);
            mstSvtLimit = limitGroup.values().next().value;
        }

        return mstSvtLimit;
    }

    public loadSvtDefaultTreasureDeviceWithLv(svtId: number, level: number): MstTreasureDeviceLv {
        // ensure level secure
        if (level < 0) {
            level = 1;
        } else if (level > 5) {
            level = 5;
        }

        let svtTreasureDeviceCon = this.loadModel("MstSvtTreasureDevice") as MstSvtTreasureDeviceContainer;
        let svtTreasureDeviceLvCon = this.loadModel("MstTreasureDeviceLv") as MstTreasureDeviceLvContainer;

        let devices = svtTreasureDeviceCon.getGroup(svtId);
        let device = devices.values().next().value;

        let treasureDevice = svtTreasureDeviceLvCon.get(device.treasureDeviceId, level);
        if (!treasureDevice) {
            // 某些从者数据污染，没有对应等级的宝具信息，直接从group中默认拿第一个
            console.log(`Invalid svt treasure device lv info: svtId: ${svtId}, level: ${level}`);
            let deviceGroup = svtTreasureDeviceLvCon.getGroup(device.treasureDeviceId);
            treasureDevice = deviceGroup.values().next().value;
        }

        return treasureDevice;
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* EMBEDDED CODE
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    public loadEmbeddedCode(): EmbeddedCodeConverted {
        return EmbeddedCode;
    }

    public loadEmbeddedGender(id: number): string {
        return this.loadEmbeddedCode().gender[id];
    }

    public loadEmbeddedPolicy(id: number): string {
        return this.loadEmbeddedCode().policy[id];
    }

    public loadEmbeddedPersonality(id: number): string {
        return this.loadEmbeddedCode().personality[id];
    }

    public loadEmbeddedAttribute(id: number): string {
        return this.loadEmbeddedCode().attri[id];
    }

    public loadEmbeddedSvtName(id: number): TransSvtName {
        return this.loadEmbeddedCode().transSvtName[id];
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* OTHERS
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    public loadVisibleItemList(): Array<MstItem> {
        let list = [] as Array<MstItem>;

        let container = MstLoader.instance.loadModel("MstItem") as MstItemContainer;
        let items = container.getRaw() as Array<MstItem>;

        items.forEach((item: MstItem) => {
            if (this._service.isItemVisible(item.id)) {
                list.push(item);
            }
        });

        return list;
    }
}