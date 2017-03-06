import {SvtInfoStory} from "../../../lib/model/MstInfo";

export interface State {
    svtId: number;
    info: SvtInfoStory;
    title: string;
}

export const defaultState = {
    svtId: -1,
    info: {},
    title: "",
} as State;

export const StateName = "SceneServantInfoStory";