import {MstSvt} from "../../../../model/master/Master";
import InjectedProps from "../../../../lib/react/InjectedProps";
import Const from "../../../lib/const/Const";

export enum SvtOrderChoices {
    collectionNo,
    rarity,
}

export enum SvtOrderDirections {
    ASC,
    DESC,
}

export interface State {
    filter: SvtListFilter; // 过滤器
    rawData: Array<MstSvt>; // 所有从者的原始数组
    displayData: Array<Array<MstSvt>>; // 过滤、排序等操作完成后用来显示的数组
    order: SvtListOrder; // 排序方法
}

export const defaultState = {
    filter: {
        classId: Object.keys(Const.SERVANT_CLASS_NAMES),
        genderType: Object.keys(Const.SERVANT_GENDER_TYPES),
        rarity: Object.keys(Const.SERVANT_RARITY_NAMES),
    } as SvtListFilter,
    rawData: [],
    displayData: [],
    order: {
        order: SvtOrderChoices.collectionNo,
        direction: SvtOrderDirections.DESC,
    } as SvtListOrder
} as State;

export const StateName = "SceneServantList";

export interface SvtListFilter {
    classId?: Array<string>;
    genderType?: Array<string>;
    rarity?: Array<string>;
}

export interface SvtListOrder {
    order: number;
    direction: number;
}

export interface Props extends InjectedProps {
    SceneServantList: State;
}