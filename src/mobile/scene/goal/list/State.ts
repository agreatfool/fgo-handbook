import InjectedProps from "../../../../lib/react/InjectedProps";
import {MstGoal, defaultMstGoal} from "../../../lib/model/MstGoal";

export interface State extends MstGoal {}

export const defaultState = defaultMstGoal as State;

export const StateName = "SceneGoal";

export interface Props extends InjectedProps {
    SceneGoal: State;
}