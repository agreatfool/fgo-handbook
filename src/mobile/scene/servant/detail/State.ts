import {SvtInfoBase, SvtInfoMaterial, SvtInfoSkill, SvtInfoStory} from "../../../lib/model/MstInfo";
import InjectedProps from "../../../../lib/react/InjectedProps";

export interface State {
    svtId: number;
    baseInfo: SvtInfoBase;
    materialInfo: SvtInfoMaterial;
    skillInfo: SvtInfoSkill;
    storyInfo: SvtInfoStory;
    title: string;
}

export const defaultState = {
    svtId: -1,
    baseInfo: {},
    materialInfo: {},
    skillInfo: {},
    storyInfo: {},
    title: "",
} as State;

export const StateName = "SceneServantInfo";

export interface Props extends InjectedProps {
    svtId: number;
    SceneServantInfo: State;
}