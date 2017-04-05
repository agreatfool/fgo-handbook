import {MstSvt} from "../../../model/master/Master";
import {MstSkillContainer, MstSvtSkillContainer} from "../../../model/impl/MstContainer";

export interface MstGoal {
    appVer: string;
    svtRawData: Array<MstSvt>;
    svtSkillData: MstSvtSkillContainer;
    skillData: MstSkillContainer;
    current: Goal;
    goals: Array<Goal>;
}

export interface Goal {
    id: string; // UUID
    name: string;
    servants: Array<GoalSvt>;
}

export interface GoalSvt {
    svtId: number;
    skills: Array<GoalSvtSkill>;
}

export interface GoalSvtSkill {
    skillId: number;
    level: number;
}

export const defaultMstGoal = {
    appVer: undefined,
    current: undefined,
    goals: [],
} as MstGoal;