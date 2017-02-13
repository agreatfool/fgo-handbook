import {ReducerInterface, bindReducers} from "../../../lib/react/Reducer";

import {State} from "./State";
import {
    ACT_UPDATE_TEXT, ACT_CLEAR_TEXT,
    ActionUpdateText, ActionClearText
} from "./Action";

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

export default bindReducers([
    RDCUpdateText,
    RDCClearText
]);