import {MstSvt} from "../../model/master/Master";
import {SvtListFilter} from "../scene/servant/main/State";
import Const from "../lib/const/Const";

export class Service {

    private _validSvtClassIds = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 11, // 剑弓枪骑术杀狂盾裁仇
        17, // GrandCaster
        20, // 提亚马特
        22, // 魔神王盖提亚
    ];

    public filterSvtRawData(rawData: Array<MstSvt>): Array<MstSvt> {
        return rawData.filter((element: MstSvt) => {
            return (this._validSvtClassIds.indexOf(element.classId) !== -1)
                && (element.collectionNo > 0 || element.id === 800100); // 800100 盾娘
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

}