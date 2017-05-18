import {ReducerInterface, bindComponentReducers} from "../../../../lib/react/Reducer";

import {State, defaultState} from "./State";
import {
    ACT_UPDATE_ALL, ACT_UPDATE_CURRENT_STATUS, ACT_ADD_GOAL,
    ACT_UPDATE_GOAL, ACT_DELETE_GOAL, ACT_UPDATE_COMPARE_SOURCE,
    ACT_UPDATE_COMPARE_TARGET,
    ActionUpdateAll, ActionUpdateCurrentStatus, ActionAddGoal,
    ActionUpdateGoal, ActionDeleteGoal, ActionUpdateCompareSource,
    ActionUpdateCompareTarget,
} from "./Action";
import MstLoader from "../../../lib/model/MstLoader";
import {Goal} from "../../../lib/model/MstGoal";
import MstUtil from "../../../lib/utility/MstUtil";

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

export const updateCompareSource = {
    action: ACT_UPDATE_COMPARE_SOURCE,
    reducer: function (state: State, action: ActionUpdateCompareSource) {
        state.compareSourceId = action.compareSourceId;
        return state;
    }
} as ReducerInterface<State>;

export const updateCompareTarget = {
    action: ACT_UPDATE_COMPARE_TARGET,
    reducer: function (state: State, action: ActionUpdateCompareTarget) {
        state.compareTargetId = action.compareTargetId;
        return state;
    }
} as ReducerInterface<State>;

export let Reducers = bindComponentReducers([
    updateAll,
    updateCurrentStatus,
    addGoal,
    updateGoal,
    deleteGoal,
    updateCompareSource,
    updateCompareTarget,
], defaultState);