import React, {Component} from "react";
import {View} from "react-native";
import * as Renderer from "../../../view/View";
import {ToolBoxWrapper, TabScene, TabPageScroll, Table, DropdownList, TableLineButton} from "../../../view/View";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import {Goal, defaultCurrentGoal} from "../../../lib/model/MstGoal";
import MstUtil from "../../../lib/utility/MstUtil";

export * from "./State";
export * from "./Action";

interface GoalCompareProps extends State.Props {
    goalId: string;
}

interface GoalCompareState {
    selectedGoalId: string;
    currentGoal: Goal;
    targetGoal: Goal;
}

class GoalCompare extends Component<GoalCompareProps, any> {
    componentDidMount() {
        let currentGoal = this.getCurrentGoal();
        let targetGoal = this.getDefaultTargetGoal();

        this.setState({
            selectedGoalId: "current",
            currentGoal: currentGoal,
            targetGoal: targetGoal,
        });
    }

    getCurrentGoal(): Goal {
        let props = this.props as GoalCompareProps;
        let goal = {} as Goal;

        props.SceneGoal.goals.forEach((element: Goal) => {
            if (element.id === props.goalId) {
                goal = Object.assign({}, element);
            }
        });

        return goal;
    }

    getDefaultTargetGoal() {
        let props = this.props as GoalCompareProps;

        let targetGoal = {};
        if (!props.SceneGoal.current || props.SceneGoal.current.servants.length === 0) {
            targetGoal = defaultCurrentGoal;
        } else {
            targetGoal = props.SceneGoal.current;
        }

        return targetGoal;
    }

    getGoalList(): Array<Goal> {
        let props = this.props as GoalCompareProps;

        let data = MstUtil.arrDeepCopy(props.SceneGoal.goals);
        data.unshift(this.getDefaultTargetGoal()); // 将当前的玩家状态作为第一个选项

        return data;
    }

    switchTargetGoal(): void {

    }

    prepareData() {
        let props = this.props as GoalCompareProps;
        let state = this.state as GoalCompareState;

        let columnServants = Renderer.buildColumnData("从者差值", []);

        let columnMaterials = Renderer.buildColumnData("材料差值", []);

        let columnSelectTarget = Renderer.buildColumnData("切换比对目标", []);
        columnSelectTarget.rows.push([
                <DropdownList
                    data={this.getGoalList()}
                    selectedValue={`${state.selectedGoalId}`}
                    onValueChange={(goalId: string) => this.setState({selectedGoalId: goalId})}
                    getValue={(goal: Goal) => `${goal.id}`}
                    getLabel={(goal: Goal) => `${goal.name}`}
                />
            ],
            [
                <TableLineButton onPress={() => this.switchTargetGoal()}>
                    进行比对
                </TableLineButton>
            ]
        );

        return [[columnServants], [columnMaterials], [columnSelectTarget]];
    }

    render() {
        if (!this.state || !this.state.hasOwnProperty("currentGoal") || this.state["currentGoal"] === undefined) {
            return <View />;
        }

        //noinspection TypeScriptUnresolvedVariable,TypeScriptUnresolvedFunction
        return (
            <TabScene>
                <ToolBoxWrapper
                    pageName="GoalCompare"
                    buttons={[
                    ]}
                />
                <TabPageScroll style={{height: 620, paddingBottom: 5}}>
                    <Table pageName="GoalCompare" data={this.prepareData()}/>
                </TabPageScroll>
            </TabScene>
        );
    }
}

export const App = injectIntoComponent(GoalCompare, State.StateName, Action.Actions);