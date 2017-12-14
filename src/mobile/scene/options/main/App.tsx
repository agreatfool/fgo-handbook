import React, {Component} from "react";
import {View} from "react-native";
import {
    Body,
    Button,
    Card,
    CardItem,
    Col,
    Container,
    Content,
    Grid,
    Header,
    Icon,
    Left,
    Picker,
    Right,
    Row,
    Title,
    Toast
} from "native-base";
import * as Styles from "../../../view/Styles";

import injectIntoComponent from "../../../../lib/react/Connect";
import {ContainerWhite} from "../../../view/View";
import {AppFooterTab, AppFooterTabIndex} from "../../../component/app_footer_tab/App";

class Options extends Component<any, any> {
    render() {
        return (
            <ContainerWhite>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack(null)}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>Options</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Option} navigation={this.props.navigation}/>
            </ContainerWhite>
        );
    }
}

export const App = injectIntoComponent(Options);