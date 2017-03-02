import {MstSvt} from "../../model/master/Master";
import {SvtListFilter} from "../scene/servant/main/State";
import Const from "../lib/const/Const";
import {SvtInfo} from "../scene/servant/detail/State";
import MstLoader from "../lib/model/MstLoader";
import {MstSvtContainer} from "../../model/impl/MstContainer";

export class Service {

    public filterSvtRawData(rawData: Array<MstSvt>): Array<MstSvt> {
        return rawData.filter((element: MstSvt) => {
            return (Const.VALID_CLASS_IDS.indexOf(element.classId) !== -1)
                && (element.collectionNo > 0);
        });
    }

    public static filterSvtDisplayData(rawData: Array<MstSvt>, filter: SvtListFilter): Array<Array<MstSvt>> {
        // FIXME not done yet
        return [];
    }

    public sortSvtDataWithNoDesc(rawData: Array<MstSvt>): Array<MstSvt> {
        return rawData.sort((elemA: MstSvt, elemB: MstSvt) => {
            return elemB.collectionNo - elemA.collectionNo;
        });
    }

    public divideRawSvtIntoRows(rawData: Array<MstSvt>, svtInRow = Const.SERVANT_IN_ROW): Array<Array<MstSvt>> {
        let result: Array<Array<MstSvt>> = [];

        for (let index = 0, loop = rawData.length; index < loop; index += svtInRow) {
            result.push(rawData.slice(index, index + svtInRow));
        }

        return result;
    }

    public async buildSvtInfo(svtId: number): Promise<SvtInfo> {
        let svtContainer = await MstLoader.instance.loadModel("MstSvt") as MstSvtContainer;
        let mstSvt = svtContainer.find(svtId);

        return undefined;
    }

}