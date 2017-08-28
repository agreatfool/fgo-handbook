import {ActionCreator} from "redux";
import {Goal, MstGoal} from "../../../lib/model/MstGoal";
import {CompareResult, State} from "./State";

export const ACT_UPDATE_ALL = "ACT_UPDATE_ALL";

export interface ActionUpdateAll {
    type: string;
    all: State;
}

export const updateAll: ActionCreator<ActionUpdateAll> = function (all: State) {
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

export const ACT_UPDATE_SVTIDS_ON_EDIT = "ACT_UPDATE_SVTIDS_ON_EDIT";

export interface ActionUpdateSvtIdsOnEdit {
    type: string;
    svtIds: Array<number>;
}

export const updateSvtIdsOnEdit: ActionCreator<ActionUpdateSvtIdsOnEdit> = function (svtIds: Array<number>) {
    return {
        type: ACT_UPDATE_SVTIDS_ON_EDIT,
        svtIds: svtIds,
    }
};

export const ACT_UPDATE_COMPARE_RESULT = "ACT_UPDATE_COMPARE_RESULT";

export interface ActionUpdateCompareResult {
    type: string;
    result: CompareResult;
}

export const updateCompareResult: ActionCreator<ActionUpdateCompareResult> = function (result: CompareResult) {
    return {
        type: ACT_UPDATE_COMPARE_RESULT,
        result: result,
    }
};

export const Actions = {
    updateAll,
    updateCurrentStatus,
    addGoal,
    updateGoal,
    deleteGoal,
    updateSvtIdsOnEdit,
    updateCompareResult,
};