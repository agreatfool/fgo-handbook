import {ReducerInterface, bindComponentReducers} from "../../../lib/react/Reducer";

import {State, defaultState} from "./State";
import {
    ACT_STOP_ANIMATING, ACT_UPDATE_LOADING,
    ActionStopAnimating, ActionUpdateLoading,
} from "./Action";

export {StateName} from "./State";

export const stopAnimating = {
    action: ACT_STOP_ANIMATING,
    reducer: function (state: State, action: ActionStopAnimating) {
        state.animating = false;
        return state;
    }
} as ReducerInterface<State>;

export const updateLoading = {
    action: ACT_UPDATE_LOADING,
    reducer: function (state: State, action: ActionUpdateLoading) {
        state.loading = action.loading;
        return state;
    }
} as ReducerInterface<State>;

export const Reducers = bindComponentReducers([
    stopAnimating,
    updateLoading,
], defaultState);