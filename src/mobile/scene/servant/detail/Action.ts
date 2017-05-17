import {ActionCreator} from "redux";
import {SvtInfo} from "../../../lib/model/MstInfo";

export const ACT_UPDATE_PAGE_TITLE = "ACT_UPDATE_PAGE_TITLE";

export interface ActionUpdatePageTitle {
    type: string;
    title: string;
}

export const updatePageTitle: ActionCreator<ActionUpdatePageTitle> = function (title: string) {
    return {
        type: ACT_UPDATE_PAGE_TITLE,
        title: title
    }
};

export const ACT_UPDATE_SVT_INFO = "ACT_UPDATE_SVT_INFO";

export interface ActionUpdateSvtInfo {
    type: string;
    info: SvtInfo;
}

export const updateSvtInfo: ActionCreator<ActionUpdateSvtInfo> = function (info: SvtInfo) {
    return {
        type: ACT_UPDATE_SVT_INFO,
        info: info
    }
};

export const ACT_UPDATE_SVT_ID = "ACT_UPDATE_SVT_ID";

export interface ActionUpdateSvtId {
    type: string;
    svtId: number;
}

export const updateSvtId: ActionCreator<ActionUpdateSvtId> = function (svtId: number) {
    return {
        type: ACT_UPDATE_SVT_ID,
        svtId: svtId
    }
};

export const Actions = {
    updatePageTitle,
    updateSvtInfo,
    updateSvtId,
};