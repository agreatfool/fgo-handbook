import {ActionCreator} from "redux";
import {Goal, MstGoal} from "../../../lib/model/MstGoal";

export const ACT_UPDATE_ALL = "ACT_UPDATE_ALL";

export interface ActionUpdateAll {
    type: string;
    all: MstGoal;
}

export const updateAll: ActionCreator<ActionUpdateAll> = function (all: MstGoal) {
    return {
        type: ACT_UPDATE_ALL,
        all: all
    };
};

export const ACT_UPDATE_CURRENT_STATUS = "ACT_UPDATE_CURRENT_STATUS";

export interface ActionUpdateCurrentStatus {
    type: string;
    current: Goal;
}

export const updateCurrentStatus: ActionCreator<ActionUpdateCurrentStatus> = function (current: Goal) {
    return {
        type: ACT_UPDATE_CURRENT_STATUS,
        current: current
    }
};

export const ACT_ADD_GOAL = "ACT_ADD_GOAL";

export interface ActionAddGoal {
    type: string;
    goal: Goal;
}

export const addGoal: ActionCreator<ActionAddGoal> = function (goal: Goal) {
    return {
        type: ACT_ADD_GOAL,
        goal: goal
    }
};

export const ACT_UPDATE_GOAL = "ACT_UPDATE_GOAL";

export interface ActionUpdateGoal {
    type: string;
    goal: Goal;
}

export const updateGoal: ActionCreator<ActionUpdateGoal> = function (goal: Goal) {
    return {
        type: ACT_UPDATE_GOAL,
        goal: goal
    }
};

export const ACT_DELETE_GOAL = "ACT_DELETE_GOAL";

export interface ActionDeleteGoal {
    type: string;
    goalId: string;
}

export const deleteGoal: ActionCreator<ActionDeleteGoal> = function (goalId: string) {
    return {
        type: ACT_DELETE_GOAL,
        goalId: goalId,
    }
};

export const ACT_UPDATE_COMPARE_SOURCE = "ACT_UPDATE_COMPARE_SOURCE";

export interface ActionUpdateCompareSource {
    type: string;
    compareSourceId: string;
}

export const updateCompareSource: ActionCreator<ActionUpdateCompareSource> = function (sourceId: string) {
    return {
        type: ACT_UPDATE_COMPARE_SOURCE,
        compareSourceId: sourceId,
    }
};

export const ACT_UPDATE_COMPARE_TARGET = "ACT_UPDATE_COMPARE_TARGET";

export interface ActionUpdateCompareTarget {
    type: string;
    compareTargetId: string;
}

export const updateCompareTarget: ActionCreator<ActionUpdateCompareTarget> = function (targetId: string) {
    return {
        type: ACT_UPDATE_COMPARE_TARGET,
        compareTargetId: targetId,
    }
};

export const Actions = {
    updateAll,
    updateCurrentStatus,
    addGoal,
    updateGoal,
    deleteGoal,
    updateCompareSource,
    updateCompareTarget,
};