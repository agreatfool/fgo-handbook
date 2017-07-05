import React, {Component} from "react";
import {TouchableOpacity, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import {Actions} from "react-native-router-flux";
import {Body, Button, Container, Content, Header, Icon, Left, Right, Row, Title} from "native-base";
import * as Styles from "../../../view/Styles";
import {AppFooterTab, AppFooterTabIndex} from "../../../component/app_footer_tab/App";
import {ColCardWrapper, ColR, GridLine, TextCentering, ThumbnailR} from "../../../view/View";
import {MstSvt} from "../../../../model/master/Master";
import MstUtil from "../../../lib/utility/MstUtil";

export * from "./State";
export * from "./Action";

interface GoalItemRequirementProps extends State.Props {
    itemId: number;
}

class GoalItemRequirement extends Component<GoalItemRequirementProps, any> {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
    }

    renderItemRequirement() {
        return <View />;
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => Actions.pop()}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>道具需求清单</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        {this.renderItemRequirement()}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(GoalItemRequirement, State.StateName, Action.Actions);