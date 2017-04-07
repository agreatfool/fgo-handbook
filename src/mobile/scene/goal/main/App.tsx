import React, {Component} from "react";
import {TouchableOpacity, View, Text, Alert} from "react-native";
import {Actions} from "react-native-router-flux";
import * as Renderer from "../../../view/View";
import {
    ToolBoxWrapper,
    TabScene,
    TabPageScroll,
    Table,
    ResImageWithElement,
    ResImageWithElementPlaceholder
} from "../../../view/View";
import injectIntoComponent from "../../../../lib/react/Connect";
import MstLoader from "../../../lib/model/MstLoader";
import {MstGoal, Goal} from "../../../lib/model/MstGoal";
import * as State from "./State";
import * as Action from "./Action";
import MstUtil from "../../../lib/utility/MstUtil";
import * as Styles from "../../../view/Styles";
import * as MstService from "../../../service/MstService";
import {MstSvt} from "../../../../model/master/Master";
import BaseContainer from "../../../../lib/container/base/BaseContainer";
import {MstSkillContainer, MstSvtSkillContainer, MstCombineSkillContainer} from "../../../../model/impl/MstContainer";

export * from "./State";
export * from "./Action";

/**
 * #1 目标应该按从者来设定，从者的技能；最后也需要展示当前目标的所有素材需求内容
 * #2 目标应该可以继承，e.g 2号目标继承1号目标，则1号目标中的所有内容都需要跟到2号目标中
 * #3 目标应该可以直接和当前状态比对
 * #4 点击素材应该会显示另一个页面，显示当前的目标中，当前材料都是哪些从者的需求
 */
class GoalList extends Component<State.Props, any> {
    private _appVer: string;
    private _service: MstService.Service;

    constructor(props, context) {
        super(props, context);
        this._service = new MstService.Service();
    }

    componentWillMount() {
        let props = this.props as State.Props;

        let svtRawData = [];
        let svtSkillData = null;
        let skillCombineData = null;
        let skillData = null;
        MstUtil.instance.getAppVer().then((appVer) => {
            this._appVer = appVer;
            return this._service.loadSvtRawDataConverted();
        }).then((rawData: Array<MstSvt>) => {
            svtRawData = rawData;
            return MstLoader.instance.loadModel("MstSvtSkill");
        }).then((container: BaseContainer<any>) => {
            svtSkillData = container as MstSvtSkillContainer;
            return MstLoader.instance.loadModel("MstCombineSkill");
        }).then((container: BaseContainer<any>) => {
            skillCombineData = container as MstCombineSkillContainer;
            return MstLoader.instance.loadModel("MstSkill");
        }).then((container: BaseContainer<any>) => {
            skillData = container as MstSkillContainer;
            return MstLoader.instance.loadGoal();
        }).then((data: MstGoal) => {
            data.appVer = this._appVer;
            data.svtRawData = svtRawData;
            data.svtSkillData = svtSkillData;
            data.skillCombineData = skillCombineData;
            data.skillData = skillData;
            props.actions.updateAll(data);
        });
    }

    // genItemCountStr(count: number) {
    //     return `x${count}`;
    // }

    // prepareGoalData(goal: Goal) {
    //     let column = Renderer.buildColumnData(`Goal ${goal.name}`, []);
    //
    //     const CELL_COUNT = 5;
    //
    //     let cells = [];
    //     goal.items.forEach((item: GoalItem) => {
    //         cells.push(
    //             <ResImageWithElement
    //                 appVer={this._appVer}
    //                 type="item"
    //                 id={item.itemId}
    //                 size="small"
    //                 width={77}
    //                 text={this.genItemCountStr(item.count)}
    //             />
    //         );
    //     });
    //
    //     let rows = [cells];
    //     if (cells.length > CELL_COUNT) {
    //         rows = [];
    //         for (let index = 0, loop = cells.length; index < loop; index += CELL_COUNT) {
    //             rows.push(cells.slice(index, index + CELL_COUNT));
    //         }
    //     }
    //
    //     if (rows[rows.length - 1].length < CELL_COUNT) {
    //         let lastRow = rows.pop();
    //         let appendCount = CELL_COUNT - lastRow.length;
    //         for (let loop = 0; loop < appendCount; loop++) {
    //             lastRow.push(<ResImageWithElementPlaceholder width={77} />);
    //         }
    //         rows.push(lastRow);
    //     }
    //     rows.push([
    //         <TouchableOpacity>
    //             <Text>Button</Text>
    //         </TouchableOpacity>
    //     ]);
    //
    //     column.rows = rows;
    //
    //     return [column];
    // }

    prepareData(goals: Array<Goal>) {
        let props = this.props as State.Props;
        let column = Renderer.buildColumnData(`Goal List`, []);

        column.rows.push([
            "名字",
            "数量",
            <ActionButtonText>编辑</ActionButtonText>,
            <ActionButtonText>扩展</ActionButtonText>,
            <ActionButtonText>比较</ActionButtonText>,
            <ActionButtonText>删除</ActionButtonText>,
        ]);

        goals.forEach((goal: Goal) => {
            column.rows.push([
                goal.name,
                goal.servants.length,
                <ActionButton action="edit" goal={goal} injectedActions={props.actions} />,
                <ActionButton action="extend" goal={goal} injectedActions={props.actions} />,
                <ActionButton action="compare" goal={goal} injectedActions={props.actions} />,
                <ActionButton action="delete" goal={goal} injectedActions={props.actions} />,
            ]);
        });

        return [[column]];
    }

    render() {
        let table = <View />;
        let goals: Array<Goal> = (this.props as State.Props).SceneGoal.goals;
        if (goals && goals.length !== 0) {
            table = <Table pageName="GoalList" data={this.prepareData(goals)}/>;
        }

        //noinspection TypeScriptUnresolvedVariable,TypeScriptUnresolvedFunction
        return (
            <TabScene>
                <ToolBoxWrapper
                    pageName="GoalList"
                    buttons={[
                        {content: "新建目标", onPress: () => (Actions as any).goal_edit({
                            mode: "add", isCurrent: false, goalId: undefined
                        })},
                        {content: "编辑现状", onPress: () => (Actions as any).goal_edit({
                            mode: "edit", isCurrent: true, goalId: undefined
                        })},
                        {content: "经验计算器", onPress: () => (Actions as any).goal_exp()},
                    ]}
                />
                <TabPageScroll>
                    {table}
                </TabPageScroll>
            </TabScene>
        );
    }
}

class ActionButtonText extends Component<Renderer.Props, any> {
    render() {
        let props = this.props as Renderer.Props;
        return (
            <Text style={[
                Styles.Common.textCenter, {width: 50}
            ]}>
                {props.children}
            </Text>
        );
    }
}

interface ActionButtonProps extends Renderer.Props {
    action: string;
    goal: Goal;
    injectedActions: any;
}

class ActionButton extends Component<ActionButtonProps, any> {
    render() {
        let props = this.props as ActionButtonProps;
        let text = "";
        let onPress = () => {};

        switch (props.action) {
            case "compare":
                text = "比对";
                //noinspection TypeScriptUnresolvedFunction
                onPress = () => (Actions as any).goal_compare({
                    goalId: props.goal.id
                });
                break;
            case "edit":
                text = "编辑";
                //noinspection TypeScriptUnresolvedFunction
                onPress = () => (Actions as any).goal_edit({
                    mode: "edit", isCurrent: false, goalId: props.goal.id
                });
                break;
            case "delete":
                text = "删除";
                onPress = () => {
                    Alert.alert("确认删除该目标吗？", null, [
                        {text: "取消"},
                        {text: "确定", onPress: () => props.injectedActions.deleteGoal(props.goal.id)},
                    ]);
                };
                break;
            case "extend":
                text = "扩展";
                //noinspection TypeScriptUnresolvedFunction
                onPress = () => (Actions as any).goal_edit({
                    mode: "extend", isCurrent: false, goalId: props.goal.id
                });
                break;
            default:
                onPress = () => console.error("Wrong action of ActionButton on page GoalList", props.action);
                break;
        }

        return (
            <TouchableOpacity
                style={[
                    Styles.Common.verticalCentering,
                    {width: 50, height: Renderer.TABLE_CONTENT_HEIGHT_DEFAULT},
                    {backgroundColor: "yellow"}
                ]}
                onPress={onPress}
            >
                <Text style={[
                    Styles.Common.textCenter,
                ]}>{text}</Text>
            </TouchableOpacity>
        );
    }
}

export const App = injectIntoComponent(GoalList, State.StateName, Action.Actions);