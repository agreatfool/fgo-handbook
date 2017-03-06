import {SvtInfoSkill} from "../../../lib/model/MstInfo";

export interface State {
    svtId: number;
    info: SvtInfoSkill;
    title: string;
}

export const defaultState = {
    svtId: -1,
    info: {},
    title: "",
} as State;

export const StateName = "SceneServantInfoSkill";