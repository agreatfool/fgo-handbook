import React, {Component} from "react";
import {Text} from "react-native";
import {Button, Footer, FooterTab} from "native-base";
import {NavigationScreenProp} from "react-navigation";

export enum AppFooterTabIndex {
    Servant,
    Progress,
    Option,
}

interface AppFooterTabProps {
    navigation: NavigationScreenProp<any, any>;
    activeIndex: number; // 0 - 2
}

export class AppFooterTab extends Component<AppFooterTabProps, any> {

    constructor(props, context) {
        super(props, context);
    }

    genServantButton() {
        let props = this.props as AppFooterTabProps;
        let isActive = props.activeIndex === AppFooterTabIndex.Servant;

        let event = () => {
            if (isActive) {
                return;
            }
            props.navigation.navigate("ServantList");
        };

        if (isActive) {
            return <Button active onPress={event}><Text>Servant</Text></Button>;
        } else {
            return <Button onPress={event}><Text>Servant</Text></Button>;
        }
    }

    genProgressButton() {
        let props = this.props as AppFooterTabProps;
        let isActive = props.activeIndex === AppFooterTabIndex.Progress;

        let event = () => {
            if (isActive) {
                return;
            }
            props.navigation.navigate("GoalList");
        };

        if (isActive) {
            return <Button active onPress={event}><Text>Progress</Text></Button>;
        } else {
            return <Button onPress={event}><Text>Progress</Text></Button>;
        }
    }

    genOptionButton() {
        let props = this.props as AppFooterTabProps;
        let isActive = props.activeIndex === AppFooterTabIndex.Option;

        let event = () => {
            if (isActive) {
                return;
            }
            props.navigation.navigate("Options");
        };

        if (isActive) {
            return <Button active onPress={event}><Text>Option</Text></Button>;
        } else {
            return <Button onPress={event}><Text>Option</Text></Button>;
        }
    }

    render() {
        return (
            <Footer>
                <FooterTab>
                    {this.genServantButton()}
                    {this.genProgressButton()}
                    {this.genOptionButton()}
                </FooterTab>
            </Footer>
        );
    }

}