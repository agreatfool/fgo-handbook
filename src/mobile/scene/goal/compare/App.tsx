import React, {Component} from "react";
import {View} from "react-native";
import * as Renderer from "../../../view/View";
import {
    ToolBoxWrapper,
    TabScene,
    TabPageScroll,
    Table,
    DropdownList,
    TableLineButton,
    ResImage,
    ResImageWithElement
} from "../../../view/View";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import {Goal, defaultCurrentGoal, GoalSvt, GoalSvtSkill} from "../../../lib/model/MstGoal";
import MstUtil from "../../../lib/utility/MstUtil";
import {MstSkill, MstSvtSkill, MstSvt} from "../../../../model/master/Master";
import {MstSvtSkillContainer, MstSkillContainer} from "../../../../model/impl/MstContainer";

export * from "./State";
export * from "./Action";

interface GoalCompareProps extends State.Props {
    goalId: string;
}

interface GoalCompareState {
    selectedGoalId: string;
    currentStatus: Goal; // 比对的基准，永远是当前的玩家状态
    targetGoal: Goal; // 比对的目标
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
        let props = this.props as GoalCompareProps;

        this.setState({
            selectedGoalId: props.goalId,
            currentStatus: this.getDefaultCurrentStatus(),
            targetGoal: this.getTargetGoal(),
        } as GoalCompareState);
    }

    getDefaultCurrentStatus() {
        let props = this.props as GoalCompareProps;

        let targetGoal = {};
        if (!props.SceneGoal.current || props.SceneGoal.current.servants.length === 0) {
            targetGoal = defaultCurrentGoal;
        } else {
            targetGoal = props.SceneGoal.current;
        }

        return targetGoal;
    }

    getTargetGoal(goalId?: string): Goal {
        let props = this.props as GoalCompareProps;
        let goal = {} as Goal;

        if (!goalId) {
            goalId = props.goalId;
        }

        props.SceneGoal.goals.forEach((element: Goal) => {
            if (element.id === goalId) {
                goal = Object.assign({}, element);
            }
        });

        return goal;
    }

    getSvtFromCurrentStatus(svtId): GoalSvt {
        let state = this.state as GoalCompareState;

        let search = undefined;
        state.currentStatus.servants.forEach((svt: GoalSvt) => {
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

    getGoalList(): Array<Goal> {
        return MstUtil.arrDeepCopy((this.props as GoalCompareProps).SceneGoal.goals);
    }

    switchTargetGoal(): void {
        let state = this.state as GoalCompareState;

        this.setState({targetGoal: this.getTargetGoal(state.selectedGoalId)});
    }

    calcCompareResult() {
        let state = this.state as GoalCompareState;

        let calcResultSvts = [] as Array<CalcResultSvt>;
        let calcResultItems = [] as Array<CalcResultItem>;

        state.targetGoal.servants.forEach((targetSvt: GoalSvt) => {
            let currentSvt = this.getSvtFromCurrentStatus(targetSvt.svtId);
            let items = this.calcSvtSkillItems(currentSvt, targetSvt);
            calcResultSvts.push({
                svtId: targetSvt.svtId,
                items: items
            } as CalcResultSvt);
            calcResultItems = this.calcMergeItems(calcResultItems, items);
        });

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
        if (targetLv >= 10) {
            targetLv = 9; // 9意味着"9级升到10级的配置"，最高就到9
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

    getSvtName(svtId: number): MstSvt {
        let props = this.props as GoalCompareProps;
        let result = {} as MstSvt;

        props.SceneGoal.svtRawData.forEach((svt: MstSvt) => {
            if (svt.id === svtId) {
                result = svt;
            }
        });

        return result;
    }

    divideDataIntoRows(data: Array<any>, dataInRow = 5): Array<Array<any>> {
        let result: Array<Array<any>> = [];

        for (let index = 0, loop = data.length; index < loop; index += dataInRow) {
            result.push(data.slice(index, index + dataInRow));
        }

        return result;
    }

    prepareData() {
        let props = this.props as GoalCompareProps;
        let state = this.state as GoalCompareState;

        let [calcResultSvts, calcResultItems] = this.calcCompareResult();
        calcResultSvts = calcResultSvts as Array<CalcResultSvt>;
        calcResultItems = calcResultItems as Array<CalcResultItem>;

        let columnServants = Renderer.buildColumnData("从者差值", []);
        calcResultSvts.forEach((svt: CalcResultSvt) => {
            columnServants.rows.push([
                <ResImage appVer={props.SceneGoal.appVer}
                          type="face"
                          size="small"
                          id={svt.svtId}/>,
                this.getSvtName(svt.svtId).name
            ]);
            let itemsDivided = this.divideDataIntoRows(svt.items);
            itemsDivided.forEach((items: Array<CalcResultItem>) => {
                columnServants.rows.push(items.map((item: CalcResultItem) => {
                    return <ResImageWithElement
                        width={77}
                        appVer={props.SceneGoal.appVer}
                        type="item"
                        id={item.itemId}
                        size="small"
                        text={`x${item.count}`}
                    />;
                }));
            });
        });

        let columnMaterials = Renderer.buildColumnData("材料差值", []);
        let itemDivided = this.divideDataIntoRows(calcResultItems);
        itemDivided.forEach((items: Array<CalcResultItem>) => {
            columnMaterials.rows.push(items.map((item: CalcResultItem) => {
                return <ResImageWithElement
                    width={77}
                    appVer={props.SceneGoal.appVer}
                    type="item"
                    id={item.itemId}
                    size="small"
                    text={`x${item.count}`}
                />;
            }));
        });

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
        if (!this.state || !this.state.hasOwnProperty("targetGoal") || this.state["targetGoal"] === undefined) {
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