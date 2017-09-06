import React, {Component} from "react";
import {Text, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import {Body, Button, Col, Container, Content, Grid, Header, Icon, Left, Right, Row, Title} from "native-base";
import * as Styles from "../../../view/Styles";
import {AppFooterTab, AppFooterTabIndex} from "../../../component/app_footer_tab/App";
import {CardWithRows, ContainerWhite, GridCardWrapper, Thumbnail} from "../../../view/View";
import {MstCombineLimit, MstCombineSkill} from "../../../../model/master/Master";
import {CompareResSvtItem} from "../list/State";
import {
    MstCombineLimitContainer,
    MstCombineSkillContainer,
    MstItemContainer
} from "../../../../model/impl/MstContainer";
import MstLoader from "../../../lib/model/MstLoader";
import {ElementType, renderRowCellsOfElements} from "../compare/App";

export * from "./State";
export * from "./Action";

interface NavState {
    itemId: number;
}

interface GoalItemRequirementState {
    itemName: string;
    total: number;
    limitTotal: number;
    skillTotal: number;
    limit: Array<CompareResSvtItem>;
    skill: Array<CompareResSvtItem>;
}

class GoalItemRequirement extends Component<State.Props, any> {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        let props = this.props as State.Props;
        let navState = props.navigation.state.params as NavState;

        let targetId = navState.itemId;

        let limits: Array<MstCombineLimit> = (MstLoader.instance.loadModel("MstCombineLimit") as MstCombineLimitContainer).getRaw();
        let skills: Array<MstCombineSkill> = (MstLoader.instance.loadModel("MstCombineSkill") as MstCombineSkillContainer).getRaw();

        let itemName: string = (MstLoader.instance.loadModel("MstItem") as MstItemContainer).get(targetId).name;
        let reqLimitTotal: number = 0;
        let reqSkillTotal: number = 0;
        let reqLimit: Array<CompareResSvtItem> = [];
        let reqSkill: Array<CompareResSvtItem> = [];

        props.actions.updateAppVer(MstLoader.instance.getAppVer());

        limits.forEach((limit: MstCombineLimit) => {
            let index = limit.itemIds.indexOf(targetId);
            if (index !== -1) {
                let svtId = limit.id;
                let reqCount = limit.itemNums[index];
                reqLimitTotal += reqCount;
                this.updateCompareResSvtItem(reqLimit, svtId, reqCount);
            }
        });

        skills.forEach((skill: MstCombineSkill) => {
            let index = skill.itemIds.indexOf(targetId);
            if (index !== -1) {
                let svtId = skill.id;
                let reqCount = skill.itemNums[index] * 3; // 三个技能
                reqSkillTotal += reqCount;
                this.updateCompareResSvtItem(reqSkill, svtId, reqCount);
            }
        });

        this.setState({
            itemName: itemName,
            total: reqLimitTotal + reqSkillTotal,
            limitTotal: reqLimitTotal,
            skillTotal: reqSkillTotal,
            limit: reqLimit,
            skill: reqSkill
        });
    }

    updateCompareResSvtItem(dataSet: Array<CompareResSvtItem>, svtId: number, count: number) {
        let found: CompareResSvtItem = undefined;
        dataSet.forEach((data: CompareResSvtItem, index: number) => {
            if (data.svtId === svtId) {
                found = data;
                data.count += count;
                dataSet[index] = data;
            }
        });

        if (found === undefined) {
            dataSet.push({
                svtId: svtId,
                count: count
            } as CompareResSvtItem);
        }
    }

    renderTitle() {
        let props = this.props as State.Props;
        let state = this.state as GoalItemRequirementState;
        let navState = props.navigation.state.params as NavState;

        return (
            <GridCardWrapper backgroundColor="#CDE1F9">
                <Row style={{marginLeft: 10, marginRight: 10}}>
                    <Col size={.2}>
                        <Thumbnail type="item" id={navState.itemId}/>
                    </Col>
                    <Col style={Styles.Common.VerticalCentering}>
                        <Text>{`${state.itemName}  x${state.total}`}</Text>
                    </Col>
                </Row>
            </GridCardWrapper>
        );
    }

    render() {
        if (!this.state
            || this.state["limit"] === undefined
            || this.state["skill"] === undefined
            || this.state["itemName"] === undefined) {
            return <View/>;
        }

        let props = this.props as State.Props;
        let state = this.state as GoalItemRequirementState;

        return (
            <ContainerWhite>
                <Header>
                    <Left>
                        <Button transparent onPress={() => props.navigation.goBack(null)}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>{state.itemName}</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        {this.renderTitle()}
                        <CardWithRows items={[`灵基再临  x${state.limitTotal}`]} backgroundColor="#CDE1F9"/>
                        {renderRowCellsOfElements(props.navigation, props.SceneItemRequirement.appVer, "",
                            ElementType.SvtItem, 5, state.limit)}
                        <CardWithRows items={[`技能升级  x${state.skillTotal}`]} backgroundColor="#CDE1F9"/>
                        {renderRowCellsOfElements(props.navigation, props.SceneItemRequirement.appVer, "",
                            ElementType.SvtItem, 5, state.skill)}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress} navigation={props.navigation}/>
            </ContainerWhite>
        );
    }
}

export const App = injectIntoComponent(GoalItemRequirement, State.StateName, Action.Actions);