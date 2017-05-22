import InjectedProps from "../../../../lib/react/InjectedProps";
import {MstSvt} from "../../../../model/master/Master";
import {MstCombineSkillContainer, MstSkillContainer, MstSvtSkillContainer} from "../../../../model/impl/MstContainer";
import {defaultMstGoal, MstGoal} from "../../../lib/model/MstGoal";

export interface State extends MstGoal {
    svtRawData: Array<MstSvt>;
    svtSkillData: MstSvtSkillContainer;
    skillCombineData: MstCombineSkillContainer;
    skillData: MstSkillContainer;
}

export const defaultState = defaultMstGoal as State;

export const StateName = "SceneGoal";

export interface Props extends InjectedProps {
    SceneGoal: State;
}