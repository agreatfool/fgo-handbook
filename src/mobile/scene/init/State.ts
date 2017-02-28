export interface State {
    animating: boolean;
    loading: string;
}

export const defaultState = {
    animating: true,
    loading: ""
} as State;

export const StateName = "SceneInitialization";