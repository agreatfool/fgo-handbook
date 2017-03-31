import InjectedProps from "../../../../lib/react/InjectedProps";

export interface State {
    current: CurrentStatus;
    goals: Array<Goal>;
}

export const defaultState = {
} as State;

export const StateName = "SceneMaterial";

export interface Props extends InjectedProps {
    SceneMaterial: State;
}

export interface CurrentStatus {
    items: Array<GoalItem>;
}

export interface Goal {
    id: number;
    name: string;
    items: Array<GoalItem>;
}

export interface GoalItem {
    itemId: number;
    count: number;
}