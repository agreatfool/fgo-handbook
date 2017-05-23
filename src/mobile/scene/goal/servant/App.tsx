import React, {Component} from "react";
import {Text, View} from "react-native";
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

interface GoalCompareServantProps extends State.Props {
    svtId: number;
}

class GoalCompareServant extends Component<GoalCompareServantProps, any> {
    constructor(props, context) {
        super(props, context);
    }

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
                    <Title>Compare Servant</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        <Text>{(this.props as GoalCompareServantProps).svtId}</Text>
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(GoalCompareServant, State.StateName, Action.Actions);