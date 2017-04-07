import React, {Component} from "react";
import {View} from "react-native";
import * as Renderer from "../../../view/View";
import {ToolBoxWrapper, TabScene, TabPageScroll, Table, DropdownList, TableLineButton} from "../../../view/View";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import {Goal, defaultCurrentGoal, GoalSvt, GoalSvtSkill} from "../../../lib/model/MstGoal";
import MstUtil from "../../../lib/utility/MstUtil";
import {MstSkill, MstSvtSkill} from "../../../../model/master/Master";
import {MstSvtSkillContainer, MstSkillContainer} from "../../../../model/impl/MstContainer";

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

interface CalcResultSvt {
    svtId: number;
    items: Array<CalcResultItem>;
}

interface CalcResultItem {
    itemId: number;
    count: number;
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

    getGoalSvtFromCurrentGoal(svtId): GoalSvt {
        let state = this.state as GoalCompareState;

        let search = undefined;
        state.currentGoal.servants.forEach((svt: GoalSvt) => {
            if (svt.svtId === svtId) {
                search = svt;
            }
        });

        if (search === undefined) {
            let skills = this.searchMstSkillArr(svtId);
            let skillsFiltered = skills.map((skill: MstSkill) => {
                return {
                    skillId: skill.id,
                    level: 1,
                } as GoalSvtSkill;
            });
            search = {
                svtId: svtId,
                skills: skillsFiltered,
            } as GoalSvt;
        }

        return search;
    }

    searchMstSkillArr(svtId: number): Array<MstSkill> {
        let result = [] as Array<MstSkill>;

        let props = this.props as GoalCompareProps;
        let svtSkillData: MstSvtSkillContainer = props.SceneGoal.svtSkillData;
        let skillData: MstSkillContainer = props.SceneGoal.skillData;

        let skills: Map<number, MstSvtSkill> = svtSkillData.getGroup(svtId);
        for (let skill of skills.values()) {
            result.push(skillData.get(skill.skillId));
        }

        return result;
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
        // Dropdown List 切换目标Goal，重新计算页面内容
    }

    calcCompareResult() {
        let state = this.state as GoalCompareState;

        let calcResultSvts = [] as Array<CalcResultSvt>;
        let calcResultItems = [] as Array<CalcResultItem>;

        state.targetGoal.servants.forEach((svt: GoalSvt) => {
            let currentSvt = this.getGoalSvtFromCurrentGoal(svt.svtId);
            let items = this.calcSvtSkillItems(currentSvt, svt);
            calcResultSvts.push({
                svtId: svt.svtId,
                items: items
            } as CalcResultSvt);
            calcResultItems = this.calcMergeItems(calcResultItems, items);
        });

        console.log("calcResultSvts", calcResultSvts);
        console.log("calcResultItems", calcResultItems);

        return [calcResultSvts, calcResultItems];
    }

    calcMergeItems(baseItems: Array<CalcResultItem>, appendItems: Array<CalcResultItem>): Array<CalcResultItem> {
        if (appendItems.length === 0) {
            return baseItems;
        }

        appendItems.forEach((appendItem: CalcResultItem) => {
            let found = false;
            baseItems.forEach((baseItem: CalcResultItem, index) => {
                if (baseItem.itemId === appendItem.itemId) {
                    baseItem.count += appendItem.count;
                    baseItems[index] = baseItem;
                    found = true;
                }
            });
            if (!found) {
                baseItems.push(appendItem);
            }
        });

        return baseItems;
    }

    calcSvtSkillItems(currentSvt: GoalSvt, targetSvt: GoalSvt): Array<CalcResultItem> {
        let result = [] as Array<CalcResultItem>;

        targetSvt.skills.forEach((skill: GoalSvtSkill) => {
            currentSvt.skills.forEach((currentSkill: GoalSvtSkill) => {
                if (currentSkill.skillId === skill.skillId) {
                    result = this.calcMergeItems(
                        result,
                        this.calcSkillItems(targetSvt.svtId, currentSkill.level, skill.level)
                    );
                }
            });
        });

        return result;
    }

    calcSkillItems(svtId: number, currentLv: number, targetLv: number): Array<CalcResultItem> {
        if (currentLv > targetLv || targetLv === 1) {
            return [];
        }

        let result = [] as Array<CalcResultItem>;
        let props = this.props as GoalCompareProps;
        let container = props.SceneGoal.skillCombineData;

        let items = new Map<number, number>();
        for (let lvIndex = currentLv; lvIndex <= targetLv; lvIndex++) {
            let combineData = container.get(svtId, lvIndex);
            combineData.itemIds.forEach((itemId: number, index) => {
                let count = combineData.itemNums[index];
                if (items.has(itemId)) {
                    items.set(itemId, items.get(itemId) + count)
                } else {
                    items.set(itemId, count);
                }
            });
        }

        for (let [itemId, count] of items) {
            result.push({
                itemId: itemId,
                count: count,
            } as CalcResultItem);
        }

        return result;
    }

    prepareData() {
        let props = this.props as GoalCompareProps;
        let state = this.state as GoalCompareState;

        // TODO 调试
        let [calcResultSvts, calcResultItems] = this.calcCompareResult();

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
                    buttons={[]}
                />
                <TabPageScroll style={{height: 620, paddingBottom: 5}}>
                    <Table pageName="GoalCompare" data={this.prepareData()}/>
                </TabPageScroll>
            </TabScene>
        );
    }
}

export const App = injectIntoComponent(GoalCompare, State.StateName, Action.Actions);