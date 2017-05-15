import {ReducerInterface, bindComponentReducers} from "../../../../lib/react/Reducer";
import * as MstService from "../../../service/MstService";

import {State, defaultState} from "./State";
import {
    ACT_UPDATE_RAW_DATA, ACT_UPDATE_DISPLAY_DATA, ACT_UPDATE_TRANS_NAME,
    ACT_UPDATE_FILTER, ACT_UPDATE_ORDER,
    ActionUpdateRawData, ActionUpdateDisplayData, ActionUpdateTransName,
    ActionUpdateFilter, ActionUpdateOrder,
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

export const updateTransName = {
    action: ACT_UPDATE_TRANS_NAME,
    reducer: function (state: State, action: ActionUpdateTransName) {
        state.transSvtName = action.transSvtName;
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

export let Reducers = bindComponentReducers([
    updateRawData,
    updateDisplayData,
    updateTransName,
    updateFilter,
    updateOrder,
], defaultState);