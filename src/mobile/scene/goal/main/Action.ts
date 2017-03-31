import {ActionCreator} from "redux";
import {CurrentStatus, Goal} from "./State";

export const ACT_UPDATE_CURRENT_STATUS = "ACT_UPDATE_CURRENT_STATUS";

export interface ActionUpdateCurrentStatus {
    type: string;
    current: CurrentStatus;
}

export const updateCurrentStatus: ActionCreator<ActionUpdateCurrentStatus> = function (current: CurrentStatus) {
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

export const ACT_UPDATE_GOAL = "ACT_ADD_GOAL";

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
    updateCurrentStatus,
    addGoal,
    updateGoal,
};