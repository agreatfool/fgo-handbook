import {ActionCreator} from "redux";

export const ACT_UPDATE_ENABLED = "ACT_UPDATE_ENABLED";

export interface ActionUpdateEnabled {
    type: string;
    name: string;
}

export let updateEnabled: ActionCreator<ActionUpdateEnabled> = function (name: string) {
    return {
        type: ACT_UPDATE_ENABLED,
        name: name
    };
};

export let Actions = {
    updateEnabled,
};