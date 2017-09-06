import React, {Component} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import {CompareResItemDetail, CompareResSkill, CompareResSvt, CompareResult} from "../list/State";
import {Body, Button, Col, Container, Content, Grid, Header, Icon, Left, Right, Row, Title} from "native-base";
import * as Styles from "../../../view/Styles";
import {AppFooterTab, AppFooterTabIndex} from "../../../component/app_footer_tab/App";
import {CardWithRows, ContainerWhite, GridCardWrapper, TextCentering, Thumbnail} from "../../../view/View";
import {ElementType, getMstSkill, getMstSvt, goToCompareResItemPage, renderRowCellsOfElements} from "../compare/App";
import {Service} from "../../../service/MstService";

export * from "./State";
export * from "./Action";

interface NavState {
    svtId: number;
}

class GoalCompareServant extends Component<State.Props, any> {
    private _service: Service;

    constructor(props, context) {
        super(props, context);

        this._service = new Service();
    }

    getCompareResSvt(svtId: number): CompareResSvt {
        let props = this.props as State.Props;
        let result = props.SceneGoal.compareResult;

        let resSvt = {} as CompareResSvt;
        result.servants.forEach((svt: CompareResSvt) => {
            if (svt.svtId === svtId) {
                resSvt = svt;
            }
        });

        return resSvt;
    }

    renderLimits(appVer: string, limitList: Array<Array<CompareResItemDetail>>) {
        let props = this.props as State.Props;

        const CELL_COUNT = 4;
        let limitListView = [];

        limitList.forEach((limitItems: Array<CompareResItemDetail>, rowIndex) => {
            if (limitItems === undefined) {
                return; // 因为使用灵基再临的等级作为索引，数组中可能存在空洞，需要判断
            }

            let itemsView = [];
            limitItems.forEach((limitItem: CompareResItemDetail, itemIndex) => {
                itemsView.push(
                    <Col key={`Item_Limit_Cell_${rowIndex}_${itemIndex}`}>
                        <TouchableOpacity onPress={() => goToCompareResItemPage(props.navigation, limitItem.itemId)}>
                            <Row style={Styles.Common.Centering}>
                                <Col>
                                    <Thumbnail type="item" id={limitItem.itemId}/>
                                </Col>
                                <Col>
                                    <TextCentering>{`x${limitItem.count}`}</TextCentering>
                                </Col>
                            </Row>
                        </TouchableOpacity>
                    </Col>
                );
            });
            if (itemsView.length < CELL_COUNT) {
                let appendCount = CELL_COUNT - itemsView.length;
                for (let loop = 0; loop < appendCount; loop++) {
                    itemsView.push(<Col key={`Item_Limit_PH_${rowIndex}_${loop}`}/>);
                }
            }

            limitListView.push(
                <Row key={`Item_Limit_Row_${rowIndex}`}>
                    <Col size={.4}><CardWithRows size={.3} items={[`第${rowIndex + 1}阶段`]} rowHeight={36}/></Col>
                    <Col size={1}>
                        <GridCardWrapper>
                            {itemsView}
                        </GridCardWrapper>
                    </Col>
                </Row>
            );
        });

        return (
            <View>
                <CardWithRows items={["灵基再临需求列表"]} backgroundColor="#CDE1F9"/>
                <Grid>
                    {limitListView}
                </Grid>
            </View>
        );
    }

    renderSkills(appVer: string, skillList: Array<CompareResSkill>) {
        let props = this.props as State.Props;
        let state = props.SceneGoal;

        const CELL_COUNT = 4;
        let skillListView = [];

        skillList.forEach((resSkill: CompareResSkill) => {
            if (resSkill.levels.length === 0) {
                return; // no item info, skip it
            }
            let mstSkill = getMstSkill(resSkill.skillId, state.skillData);

            let skillLevelListView = [];
            resSkill.levels.forEach((items: Array<CompareResItemDetail>, lvIndex) => {
                if (items === undefined) {
                    return; // 因为使用技能的等级作为索引，数组中可能存在空洞，需要判断
                }
                let cells = [];
                items.forEach((item: CompareResItemDetail, itemIndex) => {
                    cells.push(
                        <Col key={`Item_Skill_Cell_${lvIndex}_${itemIndex}`}>
                            <TouchableOpacity onPress={() => goToCompareResItemPage(props.navigation, item.itemId)}>
                                <Row style={Styles.Common.Centering}>
                                    <Col>
                                        <Thumbnail type="item" id={item.itemId}/>
                                    </Col>
                                    <Col>
                                        <TextCentering>{`x${item.count}`}</TextCentering>
                                    </Col>
                                </Row>
                            </TouchableOpacity>
                        </Col>
                    );
                });
                if (cells.length < CELL_COUNT) {
                    let appendCount = CELL_COUNT - cells.length;
                    for (let loop = 0; loop < appendCount; loop++) {
                        cells.push(<Col key={`Item_Skill_PH_${lvIndex}_${loop}`}/>);
                    }
                }
                skillLevelListView.push(
                    <Row key={`Item_Skill_Row_${lvIndex}`}>
                        <Col size={.4}><CardWithRows size={.3} items={[`Lv.${lvIndex} -> Lv.${lvIndex + 1}`]}
                                                     rowHeight={36}/></Col>
                        <Col size={1}>
                            <GridCardWrapper>
                                {cells}
                            </GridCardWrapper>
                        </Col>
                    </Row>
                );
            });

            skillListView.push(
                <Grid key={`Skill_Title_${resSkill.skillId}`}>
                    <Row>
                        <GridCardWrapper>
                            <Row>
                                <Col size={.2}>
                                    <Thumbnail type="skill" id={mstSkill.iconId}/>
                                </Col>
                                <Col style={Styles.Common.VerticalCentering}>
                                    <Text>{mstSkill.name}</Text>
                                </Col>
                            </Row>
                        </GridCardWrapper>
                    </Row>
                    {skillLevelListView}
                </Grid>
            );
        });

        return (
            <View>
                <CardWithRows items={["技能升级需求列表"]} backgroundColor="#CDE1F9"/>
                {skillListView}
            </View>
        );
    }

    render() {
        let props = this.props as State.Props;
        let state = props.SceneGoal;
        let navState = props.navigation.state.params as NavState;
        let resSvt = this.getCompareResSvt(navState.svtId);

        let result: CompareResult = state.compareResult;
        if (result === undefined) {
            return <View/>;
        }

        this._service.sortCompareResItems(resSvt.totalLimit, state.visibleItems);
        this._service.sortCompareResItems(resSvt.totalSkill, state.visibleItems);

        return (
            <ContainerWhite>
                <Header>
                    <Left>
                        <Button transparent onPress={() => props.navigation.goBack(null)}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>{`${getMstSvt(navState.svtId, state.svtRawData).name}`}</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        {renderRowCellsOfElements(props.navigation, state.appVer,
                            `灵基再临总需求列表 (QP ${resSvt.totalLimitQP / 10000}万)`,
                            ElementType.Item, 5, resSvt.totalLimit)}
                        {this.renderLimits(state.appVer, resSvt.limit)}
                        {renderRowCellsOfElements(props.navigation, state.appVer,
                            `技能升级总需求列表 (QP ${resSvt.totalSkillQP / 10000}万)`,
                            ElementType.Item, 5, resSvt.totalSkill)}
                        {this.renderSkills(state.appVer, resSvt.skills)}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress} navigation={props.navigation}/>
            </ContainerWhite>
        );
    }
}

export const App = injectIntoComponent(GoalCompareServant, State.StateName, Action.Actions);