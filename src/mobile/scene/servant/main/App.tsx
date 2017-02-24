import React, {Component} from "react";
import {View, Text} from "react-native";
import {Actions} from "react-native-router-flux";

import injectIntoComponent from "../../../../lib/react/Connect";

import {App as Row} from "../../../component/row_cells/App";
import {App as Cell} from "../../../component/cell/App";

class Servant extends Component<any, any> {
    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View style={{marginTop: 0}}>
                <Row/>
                <Row/>
            </View>
        );
    }
}

export const App = injectIntoComponent(Servant);