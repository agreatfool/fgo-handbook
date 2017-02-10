import React, {Component} from "react";
import {Text, View, TextInput} from "react-native";
import {Reducer, ActionCreator, bindActionCreators} from "redux";
import {connect} from "react-redux";

export const name = "ComponentTextInput";

export interface StateText {
    text: string;
}

export const ACT_UPDATE_TEXT = "ACT_UPDATE_TEXT";

export interface ActionUpdateText {
    type: string;
    text: string;
}

export let RDC_updateText: Reducer<StateText> = function (state = {text: "123"}, action) {
    if ((action as ActionUpdateText).type != ACT_UPDATE_TEXT) {
        return state;
    }
    return Object.assign({}, state, {text: (action as ActionUpdateText).text});
};

export let ACTOR_createUpdateText: ActionCreator<any> = function (text: string) {
    return {
        type: ACT_UPDATE_TEXT,
        text: text
    };
};

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
                            this.props.actions.ACTOR_createUpdateText(text);
                        }}
                    placeholder="test"
                />
                <Text>What inputted: {this.props.ComponentTextInput.text}</Text>
            </View>
        );
    };
}

//noinspection TypeScriptValidateTypes
export default connect(
    // bind state
    (state) => ({
        [name]: state[name]
    }),
    // bind dispatch action
    (dispatch) => ({
        actions: bindActionCreators({
            ACTOR_createUpdateText
        }, dispatch)
    })
)(Application);