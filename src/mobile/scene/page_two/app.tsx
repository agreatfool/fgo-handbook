import React, {Component} from "react";
import {Text, View} from "react-native";
import {name} from "../../component/text_input/app";
import {connect} from "react-redux";

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

//noinspection TypeScriptValidateTypes
export default connect(
    // bind state
    (state) => ({
        [name]: state[name]
    })
)(PageTwo);