import {SvtInfo} from "../../../lib/model/MstInfo";

export interface State {
    svtId: number;
    svtInfo: SvtInfo;
    title: string; // 页面标题，和从者名字同步
}

export const defaultState = {
    svtId: -1,
    svtInfo: {},
    title: "ServantDetail",
} as State;

export const StateName = "SceneServantInfo";