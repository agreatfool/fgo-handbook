import React, {Component} from "react";
import {View, Text} from "react-native";
import {Actions} from "react-native-router-flux";

import injectIntoComponent from "../../../lib/react/Connect";

class Servant extends Component<any, any> {
    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View style={{marginTop: 0}}>
                <Text>Servant</Text>
            </View>
        );
    }
}

export const App = injectIntoComponent(Servant);