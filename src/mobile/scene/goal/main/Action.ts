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

export const Actions = {
    updateAll,
    updateCurrentStatus,
    addGoal,
    updateGoal,
};