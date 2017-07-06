import {bindComponentReducers, ReducerInterface} from "../../../../lib/react/Reducer";
import {defaultState, State} from "./State";
import {ACT_UPDATE_APP_VER, ActionUpdateAppVer} from "./Action";

export {StateName} from "./State";

export const updateAppVer = {
    action: ACT_UPDATE_APP_VER,
    reducer: function (state: State, action: ActionUpdateAppVer) {
        state.appVer = action.appVer;
        return state;
    }
} as ReducerInterface<State>;

export let Reducers = bindComponentReducers([
    updateAppVer,
], defaultState);