import React, {Component} from "react";
import {Text, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import MstUtil from "../../../lib/utility/MstUtil";
import {MstItemContainer} from "../../../../model/impl/MstContainer";
import {CompareResItem, CompareResSvtItem, CompareResult} from "../list/State";
import {
    Body,
    Button,
    Col,
    Container,
    Content,
    Grid,
    Header,
    Icon,
    Left,
    Right,
    Row,
    Thumbnail,
    Title
} from "native-base";
import * as Styles from "../../../view/Styles";
import {AppFooterTab, AppFooterTabIndex} from "../../../component/app_footer_tab/App";
import {CardWithRows, ContainerWhite, GridCardWrapper} from "../../../view/View";
import MstLoader from "../../../lib/model/MstLoader";
import BaseContainer from "../../../../lib/container/base/BaseContainer";
import {ElementType, renderRowCellsOfElements} from "../compare/App";

export * from "./State";
export * from "./Action";

interface NavState {
    itemId: number;
}

interface GoalCompareItemState {
    itemName: string;
    resItem: CompareResItem;
    total: number;
    limitTotal: number;
    skillTotal: number;
}

class GoalCompareItem extends Component<State.Props, any> {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        let props = this.props as State.Props;
        let navState = props.navigation.state.params as NavState;

        MstLoader.instance.loadModel("MstItem").then((container: BaseContainer<any>) => {
            let result: CompareResult = props.SceneGoal.compareResult;
            let resItem = {} as CompareResItem;

            result.items.forEach((item: CompareResItem) => {
                if (item.itemId === navState.itemId) {
                    resItem = item;
                }
            });

            let total = 0;
            let limitTotal = 0;
            let skillTotal = 0;
            resItem.limit.forEach((limit: CompareResSvtItem) => {
                total += limit.count;
                limitTotal += limit.count;
            });
            resItem.skill.forEach((skill: CompareResSvtItem) => {
                total += skill.count;
                skillTotal += skill.count;
            });

            this.setState({
                itemName: (container as MstItemContainer).get(navState.itemId).name,
                resItem: resItem,
                total: total,
                limitTotal: limitTotal,
                skillTotal: skillTotal
            });
        });
    }

    renderTitle() {
        let props = this.props as State.Props;
        let state = this.state as GoalCompareItemState;
        let navState = props.navigation.state.params as NavState;

        return (
            <GridCardWrapper backgroundColor="#CDE1F9">
                <Row>
                    <Col size={.2}>
                        <Thumbnail small square
                                   source={{
                                       uri: MstUtil.instance.getRemoteItemUrl(
                                           props.SceneGoal.appVer, navState.itemId
                                       )
                                   }}/>
                    </Col>
                    <Col style={Styles.Common.VerticalCentering}>
                        <Text>{`${state.itemName}  x${state.total}`}</Text>
                    </Col>
                </Row>
            </GridCardWrapper>
        );
    }

    render() {
        let props = this.props as State.Props;
        let state = this.state as GoalCompareItemState;

        if (!state
            || state["itemName"] === undefined
            || state["resItem"] === undefined
            || state["total"] === undefined
            || state["limitTotal"] === undefined
            || state["skillTotal"] === undefined) {
            return <View/>;
        }

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
                        {renderRowCellsOfElements(props.navigation, props.SceneGoal.appVer, "",
                            ElementType.SvtItem, 5, state.resItem.limit)}
                        <CardWithRows items={[`技能升级  x${state.skillTotal}`]} backgroundColor="#CDE1F9"/>
                        {renderRowCellsOfElements(props.navigation, props.SceneGoal.appVer, "",
                            ElementType.SvtItem, 5, state.resItem.skill)}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress} navigation={props.navigation}/>
            </ContainerWhite>
        );
    }
}

export const App = injectIntoComponent(GoalCompareItem, State.StateName, Action.Actions);