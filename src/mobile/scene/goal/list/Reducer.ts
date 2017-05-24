import {ReducerInterface, bindComponentReducers} from "../../../../lib/react/Reducer";

import {defaultState, State} from "./State";
import {
    ACT_UPDATE_ALL, ACT_UPDATE_CURRENT_STATUS, ACT_ADD_GOAL,
    ACT_UPDATE_GOAL, ACT_DELETE_GOAL,
    ACT_UPDATE_SVTID_ON_EDIT, ACT_UPDATE_COMPARE_RESULT,
    ActionUpdateAll, ActionUpdateCurrentStatus, ActionAddGoal,
    ActionUpdateGoal, ActionDeleteGoal,
    ActionUpdateSvtIdOnEdit, ActionUpdateCompareResult,
} from "./Action";
import MstLoader from "../../../lib/model/MstLoader";
import MstUtil from "../../../lib/utility/MstUtil";
import {Goal} from "../../../lib/model/MstGoal";

export {StateName} from "./State";

const writeGoal = function (state: State): void {
    let saveObj = {
        appVer: state.appVer,
        current: state.current,
        goals: state.goals,
    };
    MstLoader.instance.writeGoal(saveObj).catch((err) => console.error(err));
};

export const updateAll = {
    action: ACT_UPDATE_ALL,
    reducer: function (state: State, action: ActionUpdateAll) {
        state = action.all;
        return state;
    }
} as ReducerInterface<State>;

export const updateCurrentStatus = {
    action: ACT_UPDATE_CURRENT_STATUS,
    reducer: function (state: State, action: ActionUpdateCurrentStatus) {
        state.current = action.current;
        writeGoal(state);
        return state;
    }
} as ReducerInterface<State>;

export const addGoal = {
    action: ACT_ADD_GOAL,
    reducer: function (state: State, action: ActionAddGoal) {
        state.goals.push(action.goal);
        writeGoal(state);
        return state;
    }
} as ReducerInterface<State>;

export const updateGoal = {
    action: ACT_UPDATE_GOAL,
    reducer: function (state: State, action: ActionUpdateGoal) {
        state.goals.forEach((goal: Goal, index) => {
            if (goal.id === action.goal.id) {
                state.goals[index] = action.goal;
            }
        });
        writeGoal(state);
        return state;
    }
} as ReducerInterface<State>;

export const deleteGoal = {
    action: ACT_DELETE_GOAL,
    reducer: function (state: State, action: ActionDeleteGoal) {
        state.goals.forEach((goal: Goal, index) => {
            if (goal.id === action.goalId) {
                state.goals = MstUtil.removeFromArrAtIndex(state.goals, index);
            }
        });
        writeGoal(state);
        return state;
    }
} as ReducerInterface<State>;

export const updateSvtIdOnEdit = {
    action: ACT_UPDATE_SVTID_ON_EDIT,
    reducer: function (state: State, action: ActionUpdateSvtIdOnEdit) {
        state.selectedSvtIdOnEdit = action.svtId;
        return state;
    }
} as ReducerInterface<State>;

export const updateCompareResult = {
    action: ACT_UPDATE_COMPARE_RESULT,
    reducer: function (state: State, action: ActionUpdateCompareResult) {
        state.compareResult = action.result;
        return state;
    }
} as ReducerInterface<State>;

export let Reducers = bindComponentReducers([
    updateAll,
    updateCurrentStatus,
    addGoal,
    updateGoal,
    deleteGoal,
    updateSvtIdOnEdit,
    updateCompareResult,
], defaultState);