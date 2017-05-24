import React, {Component} from "react";
import {Text, View, TouchableOpacity} from "react-native";
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
import {getMstSvt, ElementType, renderRowCellsOfElements, goToCompareResItemPage} from "../compare/App";

export * from "./State";
export * from "./Action";

interface GoalCompareServantProps extends State.Props {
    svtId: number;
}

class GoalCompareServant extends Component<GoalCompareServantProps, any> {
    constructor(props, context) {
        super(props, context);
    }

    getCompareResSvt(svtId: number): CompareResSvt {
        let props = this.props as GoalCompareServantProps;
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
        const CELL_COUNT = 4;
        let limitListView = [];

        limitList.forEach((limitItems: Array<CompareResItemDetail>, rowIndex) => {
            if (limitItems === undefined) {
                return; // 因为使用灵基再临的等级作为索引，数组中可能存在空洞，需要判断
            }

            let itemsView = [];
            limitItems.forEach((limitItem: CompareResItemDetail, itemIndex) => {
                itemsView.push(
                    <ColR key={`Item_Limit_Cell_${rowIndex}_${itemIndex}`}>
                        <TouchableOpacity onPress={() => goToCompareResItemPage(limitItem.itemId)}>
                            <Row style={Styles.Common.Centering}>
                                <ColR>
                                    <ThumbnailR small square
                                                source={{uri: MstUtil.instance.getRemoteItemUrl(appVer, limitItem.itemId)}}/>
                                </ColR>
                                <ColR>
                                    <TextCentering>{`x${limitItem.count}`}</TextCentering>
                                </ColR>
                            </Row>
                        </TouchableOpacity>
                    </ColR>
                );
            });
            if (itemsView.length < CELL_COUNT) {
                let appendCount = CELL_COUNT - itemsView.length;
                for (let loop = 0; loop < appendCount; loop++) {
                    itemsView.push(<ColR key={`Item_Limit_PH_${rowIndex}_${loop}`}/>);
                }
            }

            limitListView.push(
                <Row key={`Item_Limit_Row_${rowIndex}`}>
                    <ColCard size={.3} items={[`第${rowIndex + 1}阶段`]} rowHeight={36}/>
                    <ColCardWrapper>
                        {itemsView}
                    </ColCardWrapper>
                </Row>
            );
        });

        return (
            <View>
                <GridLine>
                    <ColCard items={["灵基再临需求列表"]} backgroundColor="#CDE1F9"/>
                </GridLine>
                <GridLine>
                    {limitListView}
                </GridLine>
            </View>
        );
    }

    renderSkills(skillList: Array<CompareResSkill>) {

    }

    render() {
        let props = this.props as GoalCompareServantProps;
        let state = props.SceneGoal;
        let resSvt = this.getCompareResSvt(props.svtId);

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
                        <Title>{`${getMstSvt(props.svtId, state.svtRawData).name}`}</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        {renderRowCellsOfElements(state.appVer, `灵基再临总需求列表 (QP ${resSvt.totalLimitQP / 10000}万)`,
                            ElementType.Item, 5, resSvt.totalLimit)}
                        {this.renderLimits(state.appVer, resSvt.limit)}
                        {renderRowCellsOfElements(state.appVer, `技能升级总需求列表 (QP ${resSvt.totalSkillQP / 10000}万)`,
                            ElementType.Item, 5, resSvt.totalSkill)}
                        {this.renderSkills(resSvt.skills)}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(GoalCompareServant, State.StateName, Action.Actions);