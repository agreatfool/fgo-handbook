import {ReducerInterface, bindComponentReducers} from "../../../../lib/react/Reducer";

import {State, defaultState} from "./State";
import {
    ACT_UPDATE_PAGE_TITLE, ACT_UPDATE_SVT_INFO, ACT_UPDATE_SVT_ID,
    ActionUpdatePageTitle, ActionUpdateSvtInfo, ActionUpdateSvtId,
} from "./Action";

export {StateName} from "./State";

export const updatePageTitle = {
    action: ACT_UPDATE_PAGE_TITLE,
    reducer: function (state: State, action: ActionUpdatePageTitle) {
        state.title = action.title;
        return state;
    }
} as ReducerInterface<State>;

export const updateSvtInfo = {
    action: ACT_UPDATE_SVT_INFO,
    reducer: function (state: State, action: ActionUpdateSvtInfo) {
        if (action.info.baseInfo) {
            state.baseInfo = action.info.baseInfo;
        } else if (action.info.materialInfo) {
            state.materialInfo = action.info.materialInfo;
        } else if (action.info.skillInfo) {
            state.skillInfo = action.info.skillInfo;
        } else if (action.info.storyInfo) {
            state.storyInfo = action.info.storyInfo;
        }
        return state;
    }
} as ReducerInterface<State>;

export const updateSvtId = {
    action: ACT_UPDATE_SVT_ID,
    reducer: function (state: State, action: ActionUpdateSvtId) {
        state.svtId = action.svtId;
        return state;
    }
} as ReducerInterface<State>;

export let Reducers = bindComponentReducers([
    updatePageTitle,
    updateSvtInfo,
    updateSvtId,
], defaultState);