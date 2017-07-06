import {ActionCreator} from "redux";

export const ACT_UPDATE_APP_VER = "ACT_UPDATE_APP_VER";

export interface ActionUpdateAppVer {
    type: string;
    appVer: string;
}

export const updateAppVer: ActionCreator<ActionUpdateAppVer> = function (appVer: string) {
    return {
        type: ACT_UPDATE_APP_VER,
        appVer: appVer,
    };
};

export const Actions = {
    updateAppVer,
};