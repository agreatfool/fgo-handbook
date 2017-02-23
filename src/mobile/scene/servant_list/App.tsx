import React, {Component} from "react";
import {View, Text} from "react-native";
import {Actions} from "react-native-router-flux";

import injectIntoComponent from "../../../lib/react/Connect";

class ServantList extends Component<any, any> {
    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View style={{marginTop: 0}}>
                <Text>ServantList</Text>
            </View>
        );
    }
}

export const App = injectIntoComponent(ServantList);