import {ReducerInterface, bindComponentReducers} from "../../../../lib/react/Reducer";

import {State, defaultState} from "./State";
import {
    ACT_UPDATE_CURRENT_STATUS, ACT_ADD_GOAL, ACT_UPDATE_GOAL,
    ActionUpdateCurrentStatus, ActionAddGoal, ActionUpdateGoal,
} from "./Action";

export {StateName} from "./State";

export const updateCurrentStatus = {
    action: ACT_UPDATE_CURRENT_STATUS,
    reducer: function (state: State, action: ActionUpdateCurrentStatus) {
        state.current = action.current;
        // TODO 写入文件，更新记录
        return state;
    }
} as ReducerInterface<State>;

export const addGoal = {
    action: ACT_ADD_GOAL,
    reducer: function (state: State, action: ActionAddGoal) {
        state.goals.push(action.goal);
        // TODO 写入文件，更新记录
        return state;
    }
} as ReducerInterface<State>;

export const updateGoal = {
    action: ACT_UPDATE_GOAL,
    reducer: function (state: State, action: ActionUpdateGoal) {
        state.goals[action.goal.id] = action.goal;
        // TODO 写入文件，更新记录
        return state;
    }
} as ReducerInterface<State>;

export let Reducers = bindComponentReducers([
    updateCurrentStatus,
    addGoal,
    updateGoal,
], defaultState);