import {SvtInfoMaterial} from "../../../lib/model/MstInfo";

export interface State {
    svtId: number;
    info: SvtInfoMaterial;
    title: string;
}

export const defaultState = {
    svtId: -1,
    info: {},
    title: "",
} as State;

export const StateName = "SceneServantInfoMaterial";