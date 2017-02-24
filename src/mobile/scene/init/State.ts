export interface State {
    animating: boolean;
    loading: string;
}

export let defaultState = {
    animating: true,
    loading: ""
} as State;

export let StateName = "SceneInitialization";