import {MstSvt} from "../../../model/master/Master";
import {MstSkillContainer, MstSvtSkillContainer, MstCombineSkillContainer} from "../../../model/impl/MstContainer";

export interface MstGoal {
    appVer: string;
    svtRawData: Array<MstSvt>;
    svtSkillData: MstSvtSkillContainer;
    skillCombineData: MstCombineSkillContainer;
    skillData: MstSkillContainer;
    current: Goal;
    goals: Array<Goal>;
    compareSourceId: string; // UUID of one Goal
    compareTargetId: string; // UUID of one Goal
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

export const defaultCurrentGoal = { // Goal
    id: "current",
    name: "当前进度",
    servants: [],
} as Goal;

export const defaultMstGoal = { // MstGoal
    appVer: undefined,
    current: undefined,
    goals: [defaultCurrentGoal],
    compareSourceId: "current",
    compareTargetId: "current",
} as MstGoal;