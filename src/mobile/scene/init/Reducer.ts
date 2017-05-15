import {ReducerInterface, bindComponentReducers} from "../../../lib/react/Reducer";

import {State, defaultState} from "./State";
import {
    ACT_UPDATE_LOADING,
    ActionUpdateLoading,
} from "./Action";

export {StateName} from "./State";

export const updateLoading = {
    action: ACT_UPDATE_LOADING,
    reducer: function (state: State, action: ActionUpdateLoading) {
        state.loading = action.loading;
        return state;
    }
} as ReducerInterface<State>;

export const Reducers = bindComponentReducers([
    updateLoading,
], defaultState);