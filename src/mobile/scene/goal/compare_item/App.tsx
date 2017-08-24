import React, {Component} from "react";
import {Text, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import MstUtil from "../../../lib/utility/MstUtil";
import {MstItemContainer} from "../../../../model/impl/MstContainer";
import {CompareResItem, CompareResSvtItem, CompareResult} from "../list/State";
import {Actions} from "react-native-router-flux";
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
import {ColCard, ColCardWrapper} from "../../../view/View";
import MstLoader from "../../../lib/model/MstLoader";
import BaseContainer from "../../../../lib/container/base/BaseContainer";
import {ElementType, renderRowCellsOfElements} from "../compare/App";

export * from "./State";
export * from "./Action";

interface GoalCompareItemProps extends State.Props {
    itemId: number;
}

interface GoalCompareItemState {
    itemName: string;
    resItem: CompareResItem;
    total: number;
    limitTotal: number;
    skillTotal: number;
}

class GoalCompareItem extends Component<GoalCompareItemProps, any> {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        let props = this.props as GoalCompareItemProps;

        MstLoader.instance.loadModel("MstItem").then((container: BaseContainer<any>) => {
            let result: CompareResult = props.SceneGoal.compareResult;
            let resItem = {} as CompareResItem;

            result.items.forEach((item: CompareResItem) => {
                if (item.itemId === props.itemId) {
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
                itemName: (container as MstItemContainer).get(props.itemId).name,
                resItem: resItem,
                total: total,
                limitTotal: limitTotal,
                skillTotal: skillTotal
            });
        });
    }

    renderTitle() {
        let props = this.props as GoalCompareItemProps;
        let state = this.state as GoalCompareItemState;

        return (
            <Grid>
                <ColCardWrapper backgroundColor="#CDE1F9">
                    <Row>
                        <Col size={.2}>
                            <Thumbnail small square
                                       source={{
                                           uri: MstUtil.instance.getRemoteItemUrl(
                                               props.SceneGoal.appVer, props.itemId
                                           )
                                       }}/>
                        </Col>
                        <Col style={Styles.Common.VerticalCentering}>
                            <Text>{`${state.itemName}  x${state.total}`}</Text>
                        </Col>
                    </Row>
                </ColCardWrapper>
            </Grid>
        );
    }

    render() {
        let props = this.props as GoalCompareItemProps;
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
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => (Actions as any).pop()}>
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
                        <Grid>
                            <ColCard items={[`灵基再临  x${state.limitTotal}`]} backgroundColor="#CDE1F9"/>
                        </Grid>
                        {renderRowCellsOfElements(props.SceneGoal.appVer, "",
                            ElementType.SvtItem, 5, state.resItem.limit)}
                        <Grid>
                            <ColCard items={[`技能升级  x${state.skillTotal}`]} backgroundColor="#CDE1F9"/>
                        </Grid>
                        {renderRowCellsOfElements(props.SceneGoal.appVer, "",
                            ElementType.SvtItem, 5, state.resItem.skill)}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(GoalCompareItem, State.StateName, Action.Actions);