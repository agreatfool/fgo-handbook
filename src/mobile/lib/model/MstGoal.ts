export interface MstGoal {
    current: Goal;
    goals: Array<Goal>;
}

export interface Goal {
    id: number;
    name: string;
    items: Array<GoalItem>;
}

export interface GoalItem {
    itemId: number;
    count: number;
}

export const defaultMstGoal = {
    current: undefined,
    goals: [],
} as MstGoal;