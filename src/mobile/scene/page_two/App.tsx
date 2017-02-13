import React, {Component} from "react";
import {Text, View} from "react-native";

import {StateName} from "../../component/text_input/State";
import injectIntoComponent from "../../../lib/react/Connect";

class PageTwo extends Component<any, any> {
    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View style={{marginTop: 100}}>
                <Text>Saved Text: {this.props.ComponentTextInput.text}</Text>
            </View>
        );
    }
}

export const App = injectIntoComponent(PageTwo, StateName);