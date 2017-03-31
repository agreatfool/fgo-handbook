import {ReducerInterface, bindComponentReducers} from "../../../../lib/react/Reducer";

import {State, defaultState} from "./State";
import {
    ACT_UPDATE_ALL, ACT_UPDATE_CURRENT_STATUS, ACT_ADD_GOAL, ACT_UPDATE_GOAL,
    ActionUpdateAll, ActionUpdateCurrentStatus, ActionAddGoal, ActionUpdateGoal,
} from "./Action";
import MstLoader from "../../../lib/model/MstLoader";
import {Goal} from "../../../lib/model/MstGoal";

export {StateName} from "./State";

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
        MstLoader.instance.writeGoal(state).catch((err) => console.error(err));
        return state;
    }
} as ReducerInterface<State>;

export const addGoal = {
    action: ACT_ADD_GOAL,
    reducer: function (state: State, action: ActionAddGoal) {
        state.goals.push(action.goal);
        MstLoader.instance.writeGoal(state).catch((err) => console.error(err));
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
        MstLoader.instance.writeGoal(state).catch((err) => console.error(err));
        return state;
    }
} as ReducerInterface<State>;

export let Reducers = bindComponentReducers([
    updateAll,
    updateCurrentStatus,
    addGoal,
    updateGoal,
], defaultState);