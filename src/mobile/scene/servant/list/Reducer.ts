import {ReducerInterface, bindComponentReducers} from "../../../../lib/react/Reducer";
import * as MstService from "../../../service/MstService";

import {State, defaultState} from "./State";
import {
    ACT_UPDATE_RAW_DATA, ACT_UPDATE_DISPLAY_DATA,
    ACT_UPDATE_FILTER, ACT_UPDATE_ORDER, ACT_UPDATE_APP_VER,
    ActionUpdateRawData, ActionUpdateDisplayData,
    ActionUpdateFilter, ActionUpdateOrder, ActionUpdateAppVer,
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
        state.filter = action.filter;
        state.displayData = MstService.Service.buildSvtDisplayData(state.rawData, state.filter, state.order);
        return state;
    }
} as ReducerInterface<State>;

export const updateOrder = {
    action: ACT_UPDATE_ORDER,
    reducer: function (state: State, action: ActionUpdateOrder) {
        state.order = action.order;
        state.displayData = MstService.Service.buildSvtDisplayData(state.rawData, state.filter, state.order);
        return state;
    }
} as ReducerInterface<State>;

export const updateAppVer = {
    action: ACT_UPDATE_APP_VER,
    reducer: function (state: State, action: ActionUpdateAppVer) {
        state.appVer = action.appVer;
        return state;
    }
} as ReducerInterface<State>;

export let Reducers = bindComponentReducers([
    updateRawData,
    updateDisplayData,
    updateFilter,
    updateOrder,
    updateAppVer,
], defaultState);