export interface MstGoal {
    appVer: string;
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
    limit: number; // 灵基再临状态，0 - 4
    skills: Array<GoalSvtSkill>;
    collectionNo: number; // 排序目的
    classId: number; // 排序目的
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
    current: defaultCurrentGoal,
    goals: [],
} as MstGoal;