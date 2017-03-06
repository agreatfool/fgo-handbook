import {ReducerInterface, bindComponentReducers} from "../../../../lib/react/Reducer";
import {Actions} from "react-native-router-flux";
import {SvtInfoSkill} from "../../../lib/model/MstInfo";

import {State, defaultState} from "./State";
import {
    ACT_UPDATE_PAGE_TITLE, ACT_UPDATE_SVT_INFO,
    ActionUpdatePageTitle, ActionUpdateSvtInfo,
} from "./Action";

export {StateName} from "./State";

export const updatePageTitle = {
    action: ACT_UPDATE_PAGE_TITLE,
    reducer: function (state: State, action: ActionUpdatePageTitle) {
        Actions.refresh({title: action.title});
        state.title = action.title;
        return state;
    }
} as ReducerInterface<State>;

export const updateSvtInfo = {
    action: ACT_UPDATE_SVT_INFO,
    reducer: function (state: State, action: ActionUpdateSvtInfo) {
        state.info = action.info as SvtInfoSkill;
        return state;
    }
} as ReducerInterface<State>;

export let Reducers = bindComponentReducers([
    updatePageTitle,
    updateSvtInfo,
], defaultState);