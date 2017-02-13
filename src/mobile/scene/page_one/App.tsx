import React, {Component} from "react";
import {Text, View} from "react-native";
import {Actions} from "react-native-router-flux";

import {App as TextInputApp} from "../../component/text_input/App";
import injectIntoComponent from "../../../lib/react/Connect";

class PageOne extends Component<any, any> {
    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View style={{margin: 0}}>
                <TextInputApp />
                <Text onPress={(Actions as any).pageTwo}>Next Page</Text>
            </View>
        );
    }
}

export const App = injectIntoComponent(PageOne);