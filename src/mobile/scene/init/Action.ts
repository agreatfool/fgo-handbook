import {ActionCreator} from "redux";

export const ACT_STOP_ANIMATING = "ACT_STOP_ANIMATING";

export interface ActionStopAnimating {
    type: string;
}

export const stopAnimating: ActionCreator<ActionStopAnimating> = function () {
    return {
        type: ACT_STOP_ANIMATING,
    };
};

export const ACT_UPDATE_LOADING = "ACT_UPDATE_LOADING";

export interface ActionUpdateLoading {
    type: string;
    loading: string; // loading content text
}

export const updateLoading: ActionCreator<ActionUpdateLoading> = function (loading: string) {
    return {
        type: ACT_UPDATE_LOADING,
        loading: loading
    }
};

export const Actions = {
    stopAnimating,
    updateLoading,
};