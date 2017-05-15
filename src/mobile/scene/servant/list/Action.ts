import {ActionCreator} from "redux";
import {MstSvt} from "../../../../model/master/Master";
import {SvtListFilter, SvtListOrder} from "./State";
import {TransSvtName} from "../../../../model/master/EmbeddedCodeConverted";

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
    displayData: Array<MstSvt>;
}

export const updateDisplayData: ActionCreator<ActionUpdateDisplayData> = function (displayData: Array<any>) {
    return {
        type: ACT_UPDATE_DISPLAY_DATA,
        displayData: displayData,
    };
};

export const ACT_UPDATE_TRANS_NAME = "ACT_UPDATE_TRANS_NAME";

export interface ActionUpdateTransName {
    type: string;
    transSvtName: {[key: number]: TransSvtName};
}

export const updateTransName: ActionCreator<ActionUpdateTransName> = function (transSvtName: {[key: number]: TransSvtName}) {
    return {
        type: ACT_UPDATE_TRANS_NAME,
        transSvtName: transSvtName
    }
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

export const ACT_UPDATE_ORDER = "ACT_UPDATE_ORDER";

export interface ActionUpdateOrder {
    type: string;
    order: SvtListOrder;
}

export const updateOrder: ActionCreator<ActionUpdateOrder> = function (order: SvtListOrder) {
    return {
        type: ACT_UPDATE_ORDER,
        order: order,
    };
};

export const Actions = {
    updateRawData,
    updateDisplayData,
    updateTransName,
    updateFilter,
    updateOrder,
};