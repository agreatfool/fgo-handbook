import {ReducerInterface, bindComponentReducers} from "../../../lib/react/Reducer";

import {State} from "./State";
import {
    ACT_UPDATE_TEXT, ACT_CLEAR_TEXT,
    ActionUpdateText, ActionClearText
} from "./Action";

export {StateName} from "./State";

export let RDCUpdateText = {
    action: ACT_UPDATE_TEXT,
    reducer: function (state: State, action: ActionUpdateText) {
        state.text = action.text;
        return state;
    }
} as ReducerInterface<State>;

export let RDCClearText = {
    action: ACT_CLEAR_TEXT,
    reducer: function (state: State, action: ActionClearText) {
        state.text = "";
        return state;
    }
} as ReducerInterface<State>;

export let Reducers = bindComponentReducers([
    RDCUpdateText,
    RDCClearText
]);