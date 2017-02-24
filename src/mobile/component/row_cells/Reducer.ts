import {ReducerInterface, bindComponentReducers} from "../../../lib/react/Reducer";

import {State, defaultState} from "./State";
import {
    ACT_UPDATE_ENABLED,
    ActionUpdateEnabled,
} from "./Action";

export {StateName} from "./State";

export let updateEnabled = {
    action: ACT_UPDATE_ENABLED,
    reducer: function (state: State, action: ActionUpdateEnabled) {
        state.enabled = action.name;
        return state;
    }
} as ReducerInterface<State>;

export let Reducers = bindComponentReducers([
    updateEnabled,
], defaultState);