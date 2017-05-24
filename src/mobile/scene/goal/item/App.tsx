import React, {Component} from "react";
import {Text, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import MstUtil from "../../../lib/utility/MstUtil";
import {MstItemContainer} from "../../../../model/impl/MstContainer";
import {CompareResItem, CompareResult} from "../list/State";
import {Actions} from "react-native-router-flux";
import {Body, Button, Container, Content, Header, Icon, Left, Right, Row, Title} from "native-base";
import * as Styles from "../../../view/Styles";
import {AppFooterTab, AppFooterTabIndex} from "../../../component/app_footer_tab/App";
import {ColCardWrapper, ColR, GridLine, ThumbnailR} from "../../../view/View";
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
}

class GoalCompareItem extends Component<GoalCompareItemProps, any> {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        let props = this.props as GoalCompareItemProps;

        MstLoader.instance.loadModel("MstItem").then((container: BaseContainer) => {
            this.setState({
                itemName: (container as MstItemContainer).get(props.itemId).name
            });
        });
    }

    renderTitle(itemId: number, itemName: string) {
        let props = this.props as GoalCompareItemProps;
        return (
            <GridLine>
                <ColCardWrapper backgroundColor="#CDE1F9">
                    <Row>
                        <ColR size={.2}>
                            <ThumbnailR small square
                                        source={{
                                            uri: MstUtil.instance.getRemoteItemUrl(
                                                props.SceneGoal.appVer, itemId
                                            )
                                        }}/>
                        </ColR>
                        <ColR style={Styles.Common.VerticalCentering}>
                            <Text>{itemName}</Text>
                        </ColR>
                    </Row>
                </ColCardWrapper>
            </GridLine>
        );
    }

    render() {
        let props = this.props as GoalCompareItemProps;
        let state = this.state as GoalCompareItemState;
        let result: CompareResult = props.SceneGoal.compareResult;
        if (result === undefined
            || !state || !state.hasOwnProperty("itemName")
            || state.itemName === undefined) {
            return <View />;
        }

        let resItem = {} as CompareResItem;
        result.items.forEach((item: CompareResItem) => {
            if (item.itemId === props.itemId) {
                resItem = item;
            }
        });

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
                    <Right />
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        {this.renderTitle(props.itemId, state.itemName)}
                        {renderRowCellsOfElements(props.SceneGoal.appVer, "",
                            ElementType.SvtItem, 5, resItem.servants)}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(GoalCompareItem, State.StateName, Action.Actions);