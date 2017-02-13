import React, {Component} from "react";
import {Text, View, TextInput, Button} from "react-native";
import {Reducer, ActionCreator, bindActionCreators} from "redux";
import {connect} from "react-redux";

export const name = "ComponentTextInput";

export interface State {
    text: string;
}

export interface ReducerInterface {
    action: string;
    reducer: Reducer<State>;
}

export const ACT_UPDATE_TEXT = "ACT_UPDATE_TEXT";
export const ACT_CLEAR_TEXT = "ACT_CLEAR_TEXT";

export interface ActionUpdateText {
    type: string;
    text: string;
}

export interface ActionClearText {
    type: string;
}

export let Reducers: Reducer<State> = function (state: State, action): State {
    let cloned = typeof state === 'undefined' ? {"text": "default text"} as State : Object.assign({}, state) as State;

    let reducers: Array<ReducerInterface> = [
        RDCUpdateText,
        RDCClearText
    ];

    for (let reducerInterface of reducers) {
        if (action.type == reducerInterface.action) {
            cloned = reducerInterface.reducer(cloned, action);
            break;
        }
    }

    return cloned;
};

export let RDCUpdateText = {
    action: ACT_UPDATE_TEXT,
    reducer: function (state: State, action: ActionUpdateText) {
        state.text = action.text;
        return state;
    }
} as ReducerInterface;

export let RDCClearText = {
    action: ACT_CLEAR_TEXT,
    reducer: function (state: State, action: ActionClearText) {
        state.text = "";
        return state;
    }
} as ReducerInterface;

export let ACTUpdateText: ActionCreator<any> = function (text: string) {
    return {
        type: ACT_UPDATE_TEXT,
        text: text
    };
};

export let ACTClearText: ActionCreator<any> = function () {
    return {
        type: ACT_CLEAR_TEXT
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

//noinspection TypeScriptValidateTypes
export default connect(
    // bind state
    (state) => ({
        [name]: state[name]
    }),
    // bind dispatch action
    (dispatch) => ({
        actions: bindActionCreators({
            ACTUpdateText,
            ACTClearText
        }, dispatch)
    })
)(Application);