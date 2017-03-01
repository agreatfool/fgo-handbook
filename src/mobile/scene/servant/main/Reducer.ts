import {ReducerInterface, bindComponentReducers} from "../../../../lib/react/Reducer";
import * as MstService from "../../../service/MstService";

import {State, defaultState} from "./State";
import {
    ACT_UPDATE_RAW_DATA, ACT_UPDATE_DISPLAY_DATA, ACT_UPDATE_FILTER,
    ActionUpdateRawData, ActionUpdateDisplayData, ActionUpdateFilter
} from "./Action";

export {StateName} from "./State";

export const updateRawData = {
    action: ACT_UPDATE_RAW_DATA,
    reducer: function (state: State, action: ActionUpdateRawData) {
        state.rawData = action.rawData;
        return state;
    }
} as ReducerInterface<State>;

export const updateDisplayData = {
    action: ACT_UPDATE_DISPLAY_DATA,
    reducer: function (state: State, action: ActionUpdateDisplayData) {
        state.displayData = action.displayData;
        return state;
    }
} as ReducerInterface<State>;

export const updateFilter = {
    action: ACT_UPDATE_FILTER,
    reducer: function (state: State, action: ActionUpdateFilter) {
        state.displayData = MstService.Service.filterSvtDisplayData(state.rawData, action.filter);
        return state;
    }
} as ReducerInterface<State>;

export let Reducers = bindComponentReducers([
    updateRawData,
    updateDisplayData,
    updateFilter,
], defaultState);