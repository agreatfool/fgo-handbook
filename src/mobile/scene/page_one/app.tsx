import React, {Component} from "react";
import {Text, View} from "react-native";
import {Actions} from "react-native-router-flux";

import TextInputApp from "../../component/text_input/app";

class PageOne extends Component<any, any> {
    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View style={{margin: 0}}>
                <TextInputApp />
                <Text onPress={Actions.pageTwo}>Next Page</Text>
            </View>
        );
    }
}

export default PageOne;