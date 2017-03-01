import React, {Component} from "react";
import {View, Text} from "react-native";
import {Actions} from "react-native-router-flux";

import injectIntoComponent from "../../../../lib/react/Connect";

class ServantDetail extends Component<any, any> {

    componentWillMount() {
        //noinspection TypeScriptUnresolvedVariable
        Actions.refresh({title: this.props.svtId});
    }

    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View style={{marginTop: 0}}>
                <Text>{this.props.svtId}</Text>
            </View>
        );
    }
}

export const App = injectIntoComponent(ServantDetail);