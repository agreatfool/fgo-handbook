import React, {Component} from "react";
import {Text, View, TextInput, Button} from "react-native";

import injectIntoComponent from "../../../lib/react/Connect";
import Actions from "./Action";
import {StateName} from "./State";

export class Application extends Component<any, any> {
    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View style={{marginTop: 100}}>
                <Text>This is ComponentInputText: </Text>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => {
                        //noinspection TypeScriptUnresolvedVariable
                        this.props.actions.ACTUpdateText(text);
                    }}
                    placeholder="test"
                    value={this.props.ComponentTextInput.text}
                />
                <Button
                    onPress={() => this.props.actions.ACTClearText()}
                    title="Clear Text"
                    color="#841584"
                />
                <Text>What inputted: {this.props.ComponentTextInput.text}</Text>
            </View>
        );
    };
}

export default injectIntoComponent(StateName, Actions, Application);