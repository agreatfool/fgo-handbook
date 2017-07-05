import React, {Component} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import MstUtil from "../../../lib/utility/MstUtil";
import {CompareResItemDetail, CompareResSkill, CompareResSvt, CompareResult} from "../list/State";
import {Actions} from "react-native-router-flux";
import {Body, Button, Container, Content, Header, Icon, Left, Right, Row, Title} from "native-base";
import * as Styles from "../../../view/Styles";
import {AppFooterTab, AppFooterTabIndex} from "../../../component/app_footer_tab/App";
import {ColCard, ColCardWrapper, ColR, GridLine, TextCentering, ThumbnailR} from "../../../view/View";
import {ElementType, getMstSkill, getMstSvt, goToCompareResItemPage, renderRowCellsOfElements} from "../compare/App";
import {Service} from "../../../service/MstService";

export * from "./State";
export * from "./Action";

interface GoalCompareServantProps extends State.Props {
    svtId: number;
}

class GoalCompareServant extends Component<GoalCompareServantProps, any> {
    private _service: Service;

    constructor(props, context) {
        super(props, context);

        this._service = new Service();
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

    renderSkills(appVer: string, skillList: Array<CompareResSkill>) {
        let props = this.props as GoalCompareServantProps;
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
                        <ColR key={`Item_Skill_Cell_${lvIndex}_${itemIndex}`}>
                            <TouchableOpacity onPress={() => goToCompareResItemPage(item.itemId)}>
                                <Row style={Styles.Common.Centering}>
                                    <ColR>
                                        <ThumbnailR small square
                                                    source={{uri: MstUtil.instance.getRemoteItemUrl(appVer, item.itemId)}}/>
                                    </ColR>
                                    <ColR>
                                        <TextCentering>{`x${item.count}`}</TextCentering>
                                    </ColR>
                                </Row>
                            </TouchableOpacity>
                        </ColR>
                    );
                });
                if (cells.length < CELL_COUNT) {
                    let appendCount = CELL_COUNT - cells.length;
                    for (let loop = 0; loop < appendCount; loop++) {
                        cells.push(<ColR key={`Item_Skill_PH_${lvIndex}_${loop}`}/>);
                    }
                }
                skillLevelListView.push(
                    <Row key={`Item_Skill_Row_${lvIndex}`}>
                        <ColCard size={.3} items={[`Lv.${lvIndex}\n->\nLv.${lvIndex + 1}`]} rowHeight={36}/>
                        <ColCardWrapper>
                            {cells}
                        </ColCardWrapper>
                    </Row>
                );
            });

            skillListView.push(
                <GridLine key={`Skill_Title_${resSkill.skillId}`}>
                    <Row>
                        <ColCardWrapper>
                            <Row>
                                <ColR size={.2}>
                                    <ThumbnailR small square
                                                source={{uri: MstUtil.instance.getRemoteSkillUrl(appVer, mstSkill.iconId)}}/>
                                </ColR>
                                <ColR style={Styles.Common.VerticalCentering}>
                                    <Text>{mstSkill.name}</Text>
                                </ColR>
                            </Row>
                        </ColCardWrapper>
                    </Row>
                    {skillLevelListView}
                </GridLine>
            );
        });

        return (
            <View>
                <GridLine>
                    <ColCard items={["技能升级需求列表"]} backgroundColor="#CDE1F9"/>
                </GridLine>
                {skillListView}
            </View>
        );
    }

    render() {
        let props = this.props as GoalCompareServantProps;
        let state = props.SceneGoal;
        let resSvt = this.getCompareResSvt(props.svtId);

        let result: CompareResult = state.compareResult;
        if (result === undefined) {
            return <View />;
        }

        this._service.sortCompareResItems(resSvt.totalLimit, state.visibleItems);
        this._service.sortCompareResItems(resSvt.totalSkill, state.visibleItems);

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
                        {this.renderSkills(state.appVer, resSvt.skills)}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(GoalCompareServant, State.StateName, Action.Actions);