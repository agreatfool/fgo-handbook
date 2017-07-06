import InjectedProps from "../../../../lib/react/InjectedProps";

export interface State {
    appVer: string;
}

export const defaultState = {} as State;

export const StateName = "SceneItemRequirement";

export interface Props extends InjectedProps {
    SceneItemRequirement: State;
}