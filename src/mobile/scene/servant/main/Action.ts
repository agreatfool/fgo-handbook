import {ActionCreator} from "redux";
import {MstSvt} from "../../../../model/master/Master";
import {SvtListFilter} from "./State";

export const ACT_UPDATE_RAW_DATA = "ACT_UPDATE_RAW_DATA";

export interface ActionUpdateRawData {
    type: string;
    rawData: Array<MstSvt>;
}

export const updateRawData: ActionCreator<ActionUpdateRawData> = function (rawData: Array<MstSvt>) {
    return {
        type: ACT_UPDATE_RAW_DATA,
        rawData: rawData
    }
};

export const ACT_UPDATE_DISPLAY_DATA = "ACT_UPDATE_DISPLAY_DATA";

export interface ActionUpdateDisplayData {
    type: string;
    displayData: Array<Array<MstSvt>>;
}

export const updateDisplayData: ActionCreator<ActionUpdateDisplayData> = function (displayData: Array<any>) {
    return {
        type: ACT_UPDATE_DISPLAY_DATA,
        displayData: displayData,
    };
};

export const ACT_UPDATE_FILTER = "ACT_UPDATE_FILTER";

export interface ActionUpdateFilter {
    type: string;
    filter: SvtListFilter;
}

export const updateFilter: ActionCreator<ActionUpdateFilter> = function (filter: SvtListFilter) {
    return {
        type: ACT_UPDATE_FILTER,
        filter: filter
    }
};

export const Actions = {
    updateRawData,
    updateDisplayData,
    updateFilter
};