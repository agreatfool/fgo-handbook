import React, {Component} from "react";
import {Text, View} from "react-native";

import injectIntoComponent from "../../../../lib/react/Connect";

class Options extends Component<any, any> {
    render() {
        return (
            <View style={{marginTop: 0}}>
                <Text>Options</Text>
            </View>
        );
    }
}

export const App = injectIntoComponent(Options);