import React, {Component} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import {defaultCurrentGoal, Goal, GoalSvt, GoalSvtSkill} from "../../../lib/model/MstGoal";
import MstUtil from "../../../lib/utility/MstUtil";
import {MstCombineSkill, MstSkill, MstSvt, MstSvtSkill} from "../../../../model/master/Master";
import {MstSkillContainer, MstSvtSkillContainer} from "../../../../model/impl/MstContainer";
import {
    CompareResItem,
    CompareResItemDetail,
    CompareResSkill,
    CompareResSvt,
    CompareResSvtItem,
    CompareResult
} from "../list/State";
import {Body, Button, Col, Container, Content, Grid, Header, Icon, Left, Right, Row, Title} from "native-base";
import * as Styles from "../../../view/Styles";
import {AppFooterTab, AppFooterTabIndex} from "../../../component/app_footer_tab/App";
import {CardWithRows, ContainerWhite, GridCardWrapper, TextCentering, Thumbnail} from "../../../view/View";
import {Service} from "../../../service/MstService";
import {NavigationScreenProp} from "react-navigation";

export * from "./State";
export * from "./Action";

interface NavState {
    sourceId: string;
    targetId: string;
}

class GoalCompare extends Component<State.Props, any> {
    private _result: CompareResult;
    private _sourceGoal: Goal;
    private _targetGoal: Goal;

    private _service: Service;

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

        this._service = new Service();
    }

    componentDidMount() {
        this.calcCompareResult();
    }

    getGoal(goalId: string): Goal {
        let props = this.props as State.Props;
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
        let props = this.props as State.Props;
        let navState = props.navigation.state.params as NavState;

        return this.getGoal(navState.sourceId);
    }

    getTargetGoal(): Goal {
        let props = this.props as State.Props;
        let navState = props.navigation.state.params as NavState;

        return this.getGoal(navState.targetId);
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* CALC LOGIC
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    calcCompareResult(): void {
        let props = this.props as State.Props;

        this._targetGoal.servants.forEach((targetSvt: GoalSvt) => {
            let sourceSvt = this.getSvtFromGoal(this._sourceGoal, targetSvt.svtId);
            this._result.servants.push(
                this.calcCompareResSvt(targetSvt.svtId, sourceSvt, targetSvt)
            );
        });

        // sort items
        this._service.sortCompareResItems(this._result.totalLimit, props.SceneGoal.visibleItems);
        this._service.sortCompareResItems(this._result.totalSkill, props.SceneGoal.visibleItems);

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

        let props = this.props as State.Props;
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
                this.appendCompareResItem(svtId, itemId, count, "limit");
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

        let props = this.props as State.Props;
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
                console.log(`Invalid skill combine data: svtId: ${svtId}, lvIndex: ${lvIndex}, combineData:`, combineData);

                if (svtId === 401800 && lvIndex === 9 && combineData === undefined) {
                    // 羽蛇神的9 => 10升级数据缺失，可能是数据污染，在代码里补全
                    combineData = {
                        "itemIds": [6999],
                        "itemNums": [1],
                        "id": 401800,
                        "skillLv": 9,
                        "qp": 20000000
                    } as MstCombineSkill;
                } else {
                    continue;
                }
            }

            combineData.itemIds.forEach((itemId: number, index) => {
                let count = combineData.itemNums[index];
                let itemDetail = {
                    itemId: itemId,
                    count: count
                } as CompareResItemDetail;
                result.levels[lvIndex] = this.mergeCompareResItemDetail(result.levels[lvIndex], [itemDetail]);
                svtResult.totalSkill = this.mergeCompareResItemDetail(svtResult.totalSkill, [itemDetail]);
                this.appendCompareResItem(svtId, itemId, count, "skill");
                this.appendTotalSkillItem([itemDetail]);
            });

            svtResult.totalSkillQP += combineData.qp;
            this.appendTotalQP(combineData.qp);
        }

        return result;
    }

    appendCompareResItem(svtId: number, itemId: number, count: number, type: string): void {
        let itemFound = false;
        let itemIndex = -1;
        let svtFound = false;
        this._result.items.forEach((resItem: CompareResItem, itemsIndex) => {
            if (resItem.itemId === itemId) {
                let data = resItem[type];
                data.forEach((svt: CompareResSvtItem, svtIndex) => {
                    if (svt.svtId === svtId) {
                        this._result.items[itemsIndex][type][svtIndex].count += count;
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
            let data = {
                itemId: itemId,
                limit: [] as Array<CompareResSvtItem>,
                skill: [] as Array<CompareResSvtItem>
            } as CompareResItem;
            data[type] = [svt];

            this._result.items.push(data);
        } else if (!svtFound) {
            this._result.items[itemIndex][type].push(svt);
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
            let info = this.getSvtInfo(svtId);
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
                collectionNo: info.collectionNo,
                classId: info.classId,
            } as GoalSvt;
        }

        return search;
    }

    getSvtInfo(svtId: number): MstSvt {
        let result = {} as MstSvt;

        let props = this.props as State.Props;
        props.SceneGoal.svtRawData.forEach((svtInfo: MstSvt) => {
            if (svtInfo.id === svtId) {
                result = svtInfo;
            }
        });

        return result;
    }

    getSvtSkills(svtId: number): Array<MstSkill> {
        let result = [] as Array<MstSkill>;

        let props = this.props as State.Props;
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

        let result = MstUtil.deepCopy(baseItems);
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

    filterEmptyLimitCompareResSvt(resSvt: CompareResSvt) {
        return resSvt.totalLimit.length !== 0;
    }

    filterEmptySkillCompareResSvt(resSvt: CompareResSvt) {
        return resSvt.totalSkill.length !== 0;
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
                <CardWithRows items={[`${this._sourceGoal.name}  VS  ${this._targetGoal.name}`]}
                              backgroundColor="#CDE1F9"/>
                <GridCardWrapper>
                    <Col style={{paddingTop: 5, paddingLeft: 10, paddingRight: 10}}>
                        <Row style={{marginBottom: 5}}>
                            <Col><Text>{`灵基再临 道具需求：${totalLimit.length}种 ${sigma(totalLimit)}个`}</Text></Col>
                        </Row>
                        <Row style={{marginBottom: 5}}>
                            <Col><Text>{`技能升级 道具需求：${totalSkill.length}种 ${sigma(totalSkill)}个`}</Text></Col>
                        </Row>
                        <Row style={{marginBottom: 5}}>
                            <Col><Text>{`QP 总需求：${totalQP / 10000}万`}</Text></Col>
                        </Row>
                    </Col>
                </GridCardWrapper>
            </View>
        );
    }

    render() {
        let props = this.props as State.Props;
        let state = props.SceneGoal;

        let result: CompareResult = state.compareResult;
        if (result === undefined) {
            return <View/>;
        }

        let totalItems = this.mergeCompareResItemDetail(result.totalLimit, result.totalSkill);
        this._service.sortCompareResItems(totalItems, state.visibleItems);

        return (
            <ContainerWhite>
                <Header>
                    <Left>
                        <Button transparent onPress={() => props.navigation.goBack(null)}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>Progress Compare</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        {this.renderTitle(result.totalLimit, result.totalSkill, result.totalQP)}
                        {renderRowCellsOfElements(props.navigation, state.appVer, "灵基材料列表",
                            ElementType.Item, 5, result.totalLimit)}
                        {renderRowCellsOfElements(props.navigation, state.appVer, "技能材料列表",
                            ElementType.Item, 5, result.totalSkill)}
                        {renderRowCellsOfElements(props.navigation, state.appVer, "总材料列表",
                            ElementType.Item, 5, totalItems)}
                        {renderRowCellsOfElements(props.navigation, state.appVer, "灵基目标列表",
                            ElementType.Servant, 6, result.servants.filter(this.filterEmptyLimitCompareResSvt))}
                        {renderRowCellsOfElements(props.navigation, state.appVer, "技能目标列表",
                            ElementType.Servant, 6, result.servants.filter(this.filterEmptySkillCompareResSvt))}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress} navigation={props.navigation}/>
            </ContainerWhite>
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

export const goToCompareResServantPage = (navigation: NavigationScreenProp<any, any>, svtId: number): void => {
    navigation.navigate("GoalCompareServant", {svtId: svtId})
};

export const goToCompareResItemPage = (navigation: NavigationScreenProp<any, any>, itemId: number): void => {
    navigation.navigate("GoalCompareItem", {itemId: itemId})
};

export const goToServantPage = (navigation: NavigationScreenProp<any, any>, svtId: number): void => {
    navigation.navigate("ServantMaterial", {svtId: svtId});
};

export enum ElementType {
    Item,
    Servant,
    SvtItem,
}

export const renderRowCellsOfElements = (navigation: NavigationScreenProp<any, any>,
                                         appVer: string,
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
                padding.push(<Col key={`Item_${type}_${rowIndex}_${i + dataRow.length}`}/>);
            }
        }

        let goTo = undefined;
        if (type === ElementType.Item) {
            goTo = (element: CompareResSvt | CompareResItemDetail | CompareResSvtItem) => {
                goToCompareResItemPage(navigation, (element as CompareResItemDetail).itemId);
            };
        } else if (type === ElementType.Servant) {
            goTo = (element: CompareResSvt | CompareResItemDetail | CompareResSvtItem) => {
                goToCompareResServantPage(navigation, (element as CompareResSvt).svtId);
            };
        } else if (type === ElementType.SvtItem) {
            goTo = (element: CompareResSvt | CompareResItemDetail | CompareResSvtItem) => {
                goToServantPage(navigation, (element as CompareResSvtItem).svtId);
            };
        }

        let imageType = undefined;
        let getImageId = undefined;
        if (type === ElementType.Item) {
            imageType = "item";
            getImageId = (element: CompareResSvt | CompareResItemDetail | CompareResSvtItem) => {
                return (element as CompareResItemDetail).itemId;
            };
        } else if (type === ElementType.Servant) {
            imageType = "face";
            getImageId = (element: CompareResSvt | CompareResItemDetail | CompareResSvtItem) => {
                return (element as CompareResSvt).svtId;
            };
        } else if (type === ElementType.SvtItem) {
            imageType = "face";
            getImageId = (element: CompareResSvt | CompareResItemDetail | CompareResSvtItem) => {
                return (element as CompareResSvtItem).svtId;
            };
        }

        let cells = [];
        dataRow.forEach((element: CompareResSvt | CompareResItemDetail | CompareResSvtItem, cellIndex) => {
            let count = <View/>;
            if (type === ElementType.Item) {
                count = (
                    <Col style={Styles.Common.VerticalCentering}>
                        <TextCentering>{`x${(element as CompareResItemDetail).count}`}</TextCentering>
                    </Col>
                );
            } else if (type === ElementType.SvtItem) {
                count = (
                    <Col style={Styles.Common.VerticalCentering}>
                        <TextCentering>{`x${(element as CompareResSvtItem).count}`}</TextCentering>
                    </Col>
                );
            }

            //noinspection TypeScriptValidateTypes
            let rowView = (
                <TouchableOpacity onPress={() => goTo(element)}>
                    <Row>
                        <Col>
                            <Thumbnail type={imageType} id={getImageId(element)}/>
                        </Col>
                        {count}
                    </Row>
                </TouchableOpacity>
            );

            cells.push(
                <Col key={`Item_${type}_${rowIndex}_${cellIndex}`}>
                    {rowView}
                </Col>
            );
        });

        rows.push(
            <Row key={`Item_${type}_${rowIndex}`} style={{marginBottom: 5}}>
                {cells}
                {padding}
            </Row>
        );
    });

    let titleView = <View/>;
    if (title) {
        titleView = (
            <CardWithRows items={[title]} backgroundColor="#CDE1F9"/>
        );
    }

    return (
        <View>
            {titleView}
            <GridCardWrapper>
                <Col style={{paddingTop: 5, paddingLeft: 10, paddingRight: 10}}>
                    {rows}
                </Col>
            </GridCardWrapper>
        </View>
    );
};