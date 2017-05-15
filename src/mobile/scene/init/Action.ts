import {ActionCreator} from "redux";

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
    updateLoading,
};