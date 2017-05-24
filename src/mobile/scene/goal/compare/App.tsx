import React, {Component} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import {defaultCurrentGoal, Goal, GoalSvt, GoalSvtSkill} from "../../../lib/model/MstGoal";
import MstUtil from "../../../lib/utility/MstUtil";
import {MstSkill, MstSvt, MstSvtSkill} from "../../../../model/master/Master";
import {MstSkillContainer, MstSvtSkillContainer} from "../../../../model/impl/MstContainer";
import {
    CompareResItem,
    CompareResItemDetail,
    CompareResSkill,
    CompareResSvt,
    CompareResSvtItem,
    CompareResult
} from "../list/State";
import {Actions} from "react-native-router-flux";
import {Body, Button, Container, Content, Header, Icon, Left, Right, Row, Title} from "native-base";
import * as Styles from "../../../view/Styles";
import {AppFooterTab, AppFooterTabIndex} from "../../../component/app_footer_tab/App";
import {ColCard, ColCardWrapper, ColR, GridLine, TextCentering, ThumbnailR} from "../../../view/View";

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
                this.appendCompareResItem(svtId, itemId, count);
                this.appendTotalLimitItem([itemDetail]);
            });

            svtResult.totalLimitQP += combineData.qp;
            this.appendTotalQP(combineData.qp);

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
                this.appendCompareResItem(svtId, itemId, count);
                this.appendTotalSkillItem([itemDetail]);
            });

            svtResult.totalSkillQP += combineData.qp;
            this.appendTotalQP(combineData.qp);
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

        let result = MstUtil.arrDeepCopy(baseItems);
        appendItems.forEach((appendItem: CompareResItemDetail) => {
            let found = false;
            result.forEach((baseItem: CompareResItemDetail, index) => {
                if (baseItem.itemId === appendItem.itemId) {
                    baseItem.count += appendItem.count;
                    result[index] = baseItem;
                    found = true;
                }
            });
            if (!found) {
                result.push(appendItem);
            }
        });

        return result;
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* RENDER
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    renderTitle(totalLimit: Array<CompareResItemDetail>,
                totalSkill: Array<CompareResItemDetail>,
                totalQP: number) {
        let sigma = (arr: Array<CompareResItemDetail>): number => {
            let total = 0;
            arr.forEach((detail: CompareResItemDetail) => {
                total += detail.count;
            });
            return total;
        };

        return (
            <View>
                <GridLine>
                    <ColCard items={[`${this._sourceGoal.name}  VS  ${this._targetGoal.name}`]}
                             backgroundColor="#CDE1F9"/>
                </GridLine>
                <GridLine>
                    <ColCardWrapper>
                        <Row>
                            <ColR><Text>{`灵基再临 道具需求：${totalLimit.length}种 ${sigma(totalLimit)}个`}</Text></ColR>
                        </Row>
                        <Row>
                            <ColR><Text>{`技能升级 道具需求：${totalSkill.length}种 ${sigma(totalSkill)}个`}</Text></ColR>
                        </Row>
                        <Row>
                            <ColR><Text>{`QP 总需求：${totalQP / 10000}万`}</Text></ColR>
                        </Row>
                    </ColCardWrapper>
                </GridLine>
            </View>
        );
    }

    render() {
        let props = this.props as GoalCompareProps;
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
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        {this.renderTitle(result.totalLimit, result.totalSkill, result.totalQP)}
                        {renderRowCellsOfElements(state.appVer, "灵基再临总需求列表",
                            ElementType.Item, 5, result.totalLimit)}
                        {renderRowCellsOfElements(state.appVer, "技能升级总需求列表",
                            ElementType.Item, 5, result.totalSkill)}
                        {renderRowCellsOfElements(state.appVer, "目标列表",
                            ElementType.Servant, 6, result.servants)}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(GoalCompare, State.StateName, Action.Actions);

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
//-* COMMON LOGIC
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export const getMstSvt = (svtId: number, svtRawData: Array<MstSvt>): MstSvt => {
    let result = {} as MstSvt;

    svtRawData.forEach((svt: MstSvt) => {
        if (svt.id === svtId) {
            result = svt;
        }
    });

    return result;
};

export const getMstSkill = (skillId: number, skillData: MstSkillContainer) => {
    return skillData.get(skillId);
};

export const goToCompareResServantPage = (svtId: number): void => {
    //noinspection TypeScriptUnresolvedFunction
    (Actions as any).goal_compare_svt({svtId: svtId});
};

export const goToCompareResItemPage = (itemId: number): void => {
    //noinspection TypeScriptUnresolvedFunction
    (Actions as any).goal_compare_item({itemId: itemId});
};

export enum ElementType {
    Item,
    Servant,
    SvtItem,
}

export const renderRowCellsOfElements = (appVer: string,
                                         title: string,
                                         type: ElementType,
                                         cellInRow: number,
                                         elements: Array<CompareResSvt | CompareResItemDetail | CompareResSvtItem>) => {
    let data: Array<Array<CompareResSvt | CompareResItemDetail | CompareResSvtItem>>
        = MstUtil.divideArrayIntoParts(elements, cellInRow);
    let rows = [];

    data.forEach((dataRow: Array<CompareResSvt | CompareResItemDetail | CompareResSvtItem>, rowIndex) => {
        let padding = [];
        if (dataRow.length < cellInRow) {
            for (let i = 0; i < cellInRow - dataRow.length; i++) {
                padding.push(<ColR key={`Item_${type}_${rowIndex}_${i + dataRow.length}`}/>);
            }
        }

        let goTo = undefined;
        if (type === ElementType.Item) {
            goTo = (element: CompareResSvt | CompareResItemDetail) => {
                goToCompareResItemPage((element as CompareResItemDetail).itemId);
            };
        } else if (type === ElementType.Servant) {
            goTo = (element: CompareResSvt | CompareResItemDetail) => {
                goToCompareResServantPage((element as CompareResSvt).svtId);
            };
        }

        let getImgUrl = undefined;
        if (type === ElementType.Item) {
            getImgUrl = (appVer, element: CompareResSvt | CompareResItemDetail | CompareResSvtItem) => {
                return MstUtil.instance.getRemoteItemUrl(appVer, (element as CompareResItemDetail).itemId);
            };
        } else if (type === ElementType.Servant) {
            getImgUrl = (appVer, element: CompareResSvt | CompareResItemDetail | CompareResSvtItem) => {
                return MstUtil.instance.getRemoteFaceUrl(appVer, (element as CompareResSvt).svtId);
            };
        } else if (type === ElementType.SvtItem) {
            getImgUrl = (appVer, element: CompareResSvt | CompareResItemDetail | CompareResSvtItem) => {
                return MstUtil.instance.getRemoteFaceUrl(appVer, (element as CompareResSvtItem).svtId);
            };
        }

        let cells = [];
        dataRow.forEach((element: CompareResSvt | CompareResItemDetail | CompareResSvtItem, cellIndex) => {
            let count = <View/>;
            if (type === ElementType.Item) {
                count = (
                    <ColR style={Styles.Common.VerticalCentering}>
                        <TextCentering>{`x${(element as CompareResItemDetail).count}`}</TextCentering>
                    </ColR>
                );
            } else if (type === ElementType.SvtItem) {
                count = (
                    <ColR style={Styles.Common.VerticalCentering}>
                        <TextCentering>{`x${(element as CompareResSvtItem).count}`}</TextCentering>
                    </ColR>
                );
            }

            let rowView = <View/>;
            if (type === ElementType.Item || type === ElementType.Servant) {
                // 带点击跳转事件
                //noinspection TypeScriptValidateTypes
                rowView = (
                    <TouchableOpacity onPress={() => goTo(element)}>
                        <Row>
                            <ColR>
                                <ThumbnailR small square
                                            source={{uri: getImgUrl(appVer, element)}}/>
                            </ColR>
                            {count}
                        </Row>
                    </TouchableOpacity>
                );
            } else {
                // 无点击事件
                //noinspection TypeScriptValidateTypes
                rowView = (
                    <Row>
                        <ColR>
                            <ThumbnailR small square
                                        source={{uri: getImgUrl(appVer, element)}}/>
                        </ColR>
                        {count}
                    </Row>
                );
            }

            cells.push(
                <ColR key={`Item_${type}_${rowIndex}_${cellIndex}`}>
                    {rowView}
                </ColR>
            );
        });

        rows.push(
            <Row key={`Item_${type}_${rowIndex}`} style={{paddingBottom: 5}}>
                {cells}
                {padding}
            </Row>
        );
    });

    let titleView = <View/>;
    if (title) {
        titleView = (
            <GridLine>
                <ColCard items={[title]} backgroundColor="#CDE1F9"/>
            </GridLine>
        );
    }

    return (
        <View>
            {titleView}
            <GridLine>
                <ColCardWrapper>
                    {rows}
                </ColCardWrapper>
            </GridLine>
        </View>
    );
};