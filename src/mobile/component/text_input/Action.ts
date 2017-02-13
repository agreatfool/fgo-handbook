import {ActionCreator} from "redux";

export const ACT_UPDATE_TEXT = "ACT_UPDATE_TEXT";
export const ACT_CLEAR_TEXT = "ACT_CLEAR_TEXT";

export interface ActionUpdateText {
    type: string;
    text: string;
}

export interface ActionClearText {
    type: string;
}

export let ACTUpdateText: ActionCreator<any> = function (text: string) {
    return {
        type: ACT_UPDATE_TEXT,
        text: text
    };
};

export let ACTClearText: ActionCreator<any> = function () {
    return {
        type: ACT_CLEAR_TEXT
    };
};

export let Actions = {
    ACTUpdateText,
    ACTClearText
};