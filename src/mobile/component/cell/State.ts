export interface State {
    names: Array<string>;
    enabled: string;
}

export let defaultState = {
    names: [
        "servant",
        "material",
        "options"
    ],
    enabled: ""
} as State;

export let StateName = "ComponentBottomTabs";