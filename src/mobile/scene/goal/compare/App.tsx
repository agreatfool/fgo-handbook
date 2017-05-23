import React, {Component} from "react";
import {View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import {Goal, defaultCurrentGoal, GoalSvt, GoalSvtSkill} from "../../../lib/model/MstGoal";
import MstUtil from "../../../lib/utility/MstUtil";
import {MstSkill, MstSvtSkill, MstSvt} from "../../../../model/master/Master";
import {MstSvtSkillContainer, MstSkillContainer} from "../../../../model/impl/MstContainer";
import {
    CompareResItem, CompareResItemDetail, CompareResSkill, CompareResSvt, CompareResSvtItem,
    CompareResult
} from "../list/State";
import {Actions} from "react-native-router-flux";
import {Body, Button, Container, Content, Header, Icon, Left, Picker, Right, Row, Title, Toast} from "native-base";
import * as Styles from "../../../view/Styles";
import {AppFooterTab, AppFooterTabIndex} from "../../../component/app_footer_tab/App";
import {defaultCurrentGoal, Goal, MstGoal} from "../../../lib/model/MstGoal";
import {GridLine} from "../../../view/View";

export * from "./State";
export * from "./Action";

interface GoalCompareProps extends State.Props {
    sourceId: string;
    targetId: string;
}

class GoalCompare extends Component<GoalCompareProps, any> {
    private _result: CompareResult;
    private _sourceGoal: Goal;
    private _targetGoal: Goal;

    constructor(props, context) {
        super(props, context);

        this._result = {
            totalLimit: [],
            totalSkill: [],
            totalQP: 0,
            servants: [],
            items: [],
        } as CompareResult;

        this._sourceGoal = this.getSourceGoal();
        this._targetGoal = this.getTargetGoal();
    }

    componentDidMount() {
        this.calcCompareResult();
    }

    getGoal(goalId: string): Goal {
        let props = this.props as GoalCompareProps;
        let goal = {} as Goal;

        if (goalId === defaultCurrentGoal.id) {
            goal = Object.assign(props.SceneGoal.current);
        } else {
            props.SceneGoal.goals.forEach((element: Goal) => {
                if (element.id === goalId) {
                    goal = Object.assign({}, element);
                }
            });
        }

        return goal;
    }

    getSourceGoal(): Goal {
        return this.getGoal((this.props as GoalCompareProps).sourceId);
    }

    getTargetGoal(): Goal {
        return this.getGoal((this.props as GoalCompareProps).targetId);
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* CALC LOGIC
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    calcCompareResult(): void {
        let props = this.props as GoalCompareProps;

        this._targetGoal.servants.forEach((targetSvt: GoalSvt) => {
            let sourceSvt = this.getSvtFromGoal(this._sourceGoal, targetSvt.svtId);
            this._result.servants.push(
                this.calcCompareResSvt(targetSvt.svtId, sourceSvt, targetSvt)
            );
        });

        console.log(this._result);

        // finally update props data
        props.actions.updateCompareResult(this._result);
    }

    calcCompareResSvt(svtId: number, source: GoalSvt, target: GoalSvt): CompareResSvt {
        let result = {
            svtId: svtId,
            totalLimit: [],
            totalLimitQP: 0,
            totalSkill: [],
            totalSkillQP: 0,
            limit: [],
            skills: [],
        } as CompareResSvt;

        // 处理从者比对中的技能部分
        target.skills.forEach((targetGoalSkill: GoalSvtSkill) => {
            source.skills.forEach((sourceGoalSkill: GoalSvtSkill) => {
                if (sourceGoalSkill.skillId === targetGoalSkill.skillId) {
                    result.skills.push(this.calcCompareResSkill(
                        svtId, sourceGoalSkill.skillId,
                        sourceGoalSkill.level, targetGoalSkill.level,
                        result
                    ));
                }
            });
        });

        // 处理从者比对中的灵基再临部分
        result.limit = this.calcCompareResLimit(svtId, source.limit, target.limit, result);

        return result;
    }

    calcCompareResLimit(svtId: number,
                        sourceLimit: number,
                        targetLimit: number,
                        svtResult: CompareResSvt): Array<Array<CompareResItemDetail>> {
        let result = [] as Array<Array<CompareResItemDetail>>;

        // 参数范围校验
        if (sourceLimit >= targetLimit || targetLimit === 0) {
            return result;
        }

        let props = this.props as GoalCompareProps;
        let container = props.SceneGoal.limitCombineData;

        for (let limitIndex = sourceLimit; limitIndex < targetLimit; limitIndex++) {
            let combineData = container.get(svtId, limitIndex);
            if (!combineData || !combineData.itemIds) {
                console.log("Invalid limit combine data: svtId: ", svtId, "limitIndex: ", limitIndex, combineData);
                continue;
            }

            let items = [] as Array<CompareResItemDetail>;
            combineData.itemIds.forEach((itemId: number, index) => {
                let count = combineData.itemNums[index];
                let itemDetail = {
                    itemId: itemId,
                    count: count
                } as CompareResItemDetail;
                items = this.mergeCompareResItemDetail(items, [itemDetail]);
                svtResult.totalLimit = this.mergeCompareResItemDetail(svtResult.totalLimit, [itemDetail]);
                svtResult.totalLimitQP += combineData.qp;
                this.appendCompareResItem(svtId, itemId, count);
                this.appendTotalLimitItem([itemDetail]);
                this.appendTotalQP(combineData.qp);
            });

            result[limitIndex] = items;
        }

        return result;
    }

    calcCompareResSkill(svtId: number,
                        skillId: number,
                        sourceLv: number,
                        targetLv: number,
                        svtResult: CompareResSvt): CompareResSkill {
        let result = {
            skillId: skillId,
            levels: [] as Array<Array<CompareResItemDetail>>
        } as CompareResSkill;

        // 参数范围校验
        if (sourceLv >= targetLv || targetLv === 1) {
            return result;
        }

        let props = this.props as GoalCompareProps;
        let container = props.SceneGoal.skillCombineData;

        /**
         * MstCombineSkill 这个表是用来描述技能升级所需内容的，表中的 skillLv 字段范围为 1-9，
         * 表示当前开始升级的技能等级（没有10是因为顶级10级，只有9升10，没有10升11）。
         * 因此 CompareResSkill 中的 skills 的 index索引也是这个意思。
         */
        for (let lvIndex = sourceLv; lvIndex < targetLv; lvIndex++) {
            if (result.levels[lvIndex] === undefined) {
                result.levels[lvIndex] = []; // 初始化
            }

            let combineData = container.get(svtId, lvIndex);
            if (!combineData || !combineData.itemIds) {
                console.log("Invalid skill combine data: svtId: ", svtId, "lvIndex: ", lvIndex, combineData);
                continue;
            }

            combineData.itemIds.forEach((itemId: number, index) => {
                let count = combineData.itemNums[index];
                let itemDetail = {
                    itemId: itemId,
                    count: count
                } as CompareResItemDetail;
                result.levels[lvIndex] = this.mergeCompareResItemDetail(result.levels[lvIndex], [itemDetail]);
                svtResult.totalSkill = this.mergeCompareResItemDetail(svtResult.totalSkill, [itemDetail]);
                svtResult.totalSkillQP += combineData.qp;
                this.appendCompareResItem(svtId, itemId, count);
                this.appendTotalSkillItem([itemDetail]);
                this.appendTotalQP(combineData.qp);
            });
        }

        return result;
    }

    appendCompareResItem(svtId: number, itemId: number, count: number): void {
        let itemFound = false;
        let itemIndex = -1;
        let svtFound = false;
        this._result.items.forEach((resItem: CompareResItem, itemsIndex) => {
            if (resItem.itemId === itemId) {
                resItem.servants.forEach((svt: CompareResSvtItem, svtIndex) => {
                    if (svt.svtId === svtId) {
                        this._result.items[itemsIndex].servants[svtIndex].count += count;
                        svtFound = true;
                    }
                });
                itemFound = true;
                itemIndex = itemsIndex;
            }
        });

        let svt = {
            svtId: svtId,
            count: count
        } as CompareResSvtItem;

        if (!itemFound) {
            this._result.items.push({
                itemId: itemId,
                servants: [svt] as Array<CompareResSvtItem>
            } as CompareResItem);
        } else if (!svtFound) {
            this._result.items[itemIndex].servants.push(svt);
        }
    }

    appendTotalLimitItem(items: Array<CompareResItemDetail>): void {
        this._result.totalLimit = this.mergeCompareResItemDetail(this._result.totalLimit, items);
    }

    appendTotalSkillItem(items: Array<CompareResItemDetail>): void {
        this._result.totalSkill = this.mergeCompareResItemDetail(this._result.totalSkill, items);
    }

    appendTotalQP(qp: number): void {
        this._result.totalQP += qp;
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* CALC UTILITIES
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    getSvtFromGoal(goal: Goal, svtId: number): GoalSvt {
        let search = undefined;

        goal.servants.forEach((svt: GoalSvt) => {
            if (svt.svtId === svtId) {
                search = svt;
            }
        });

        if (search === undefined) {
            let skills = this.getSvtSkills(svtId);
            let skillsFiltered = skills.map((skill: MstSkill) => {
                return {
                    skillId: skill.id,
                    level: 1,
                } as GoalSvtSkill;
            });
            search = {
                svtId: svtId,
                limit: 0,
                skills: skillsFiltered,
            } as GoalSvt;
        }

        return search;
    }

    getSvtSkills(svtId: number): Array<MstSkill> {
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

    mergeCompareResItemDetail(baseItems: Array<CompareResItemDetail>,
                              appendItems: Array<CompareResItemDetail>): Array<CompareResItemDetail> {
        if (appendItems.length === 0) {
            return baseItems;
        }

        appendItems.forEach((appendItem: CompareResItemDetail) => {
            let found = false;
            baseItems.forEach((baseItem: CompareResItemDetail, index) => {
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

    getMstSvt(svtId: number): MstSvt {
        let props = this.props as GoalCompareProps;
        let result = {} as MstSvt;

        props.SceneGoal.svtRawData.forEach((svt: MstSvt) => {
            if (svt.id === svtId) {
                result = svt;
            }
        });

        return result;
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* RENDER
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-


    render() {
        let props = this.props as State.Props;
        let state = props.SceneGoal;

        let result: CompareResult = state.compareResult;
        if (result === undefined) {
            return <View />;
        }

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => (Actions as any).pop()}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>Progress Compare</Title>
                    </Body>
                    <Right />
                </Header>
                <Content scrollEnabled={false}>
                    <View style={Styles.Box.Wrapper}>
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(GoalCompare, State.StateName, Action.Actions);