import {MstSvt} from "../../model/master/Master";
import {SvtListFilter} from "../scene/servant/main/State";

export class Service {

    public filterSvtRawData(rawData: Array<MstSvt>): Array<MstSvt> {
        return rawData.filter((element: MstSvt) => {
            // 编号0 且 类型ID为8 是盾娘
            return element.collectionNo != 0 && element.classId != 8;
        });
    }

    public filterSvtDisplayData(rawData: Array<MstSvt>, filter: SvtListFilter): Array<Array<MstSvt>> {
        // FIXME not done yet
        return [];
    }

    public sortSvtDataWithNo(rawData: Array<MstSvt>): Array<MstSvt> {
        return rawData.sort((elemA: MstSvt, elemB: MstSvt) => {
            return elemA.collectionNo - elemB.collectionNo;
        });
    }

    public divideRawSvtIntoRows(rawData: Array<MstSvt>, svtInRow = 5): Array<Array<MstSvt>> {
        let result: Array<Array<MstSvt>> = [];

        rawData = rawData.filter((element: MstSvt) => {
            // 编号0 且 类型ID为8 是盾娘
            return element.collectionNo != 0 && element.classId != 8;
        });

        for (let index = 0, loop = rawData.length; index < loop; index += svtInRow) {
            result.push(rawData.slice(index, index + svtInRow));
        }

        return result;
    }

}