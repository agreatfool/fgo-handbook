import {MstSvt} from "../../../../model/master/Master";
import InjectedProps from "../../../../lib/react/InjectedProps";

export interface State {
    filter: SvtListFilter; // 过滤器
    rawData: Array<MstSvt>; // 所有从者的原始数组
    displayData: Array<Array<MstSvt>>; // 过滤、排序等操作完成后用来显示的数组
}

export interface SvtListFilter {
    classId?: Array<number>;
    genderType?: Array<number>;
    rewardLv?: Array<number>;
}

export const defaultState = {
    filter: {},
    rawData: [],
    displayData: [],
} as State;

export const StateName = "SceneServantList";

export interface Props extends InjectedProps {
    SceneServantList: State;
}