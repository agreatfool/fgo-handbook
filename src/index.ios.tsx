import React, {Component} from "react";
import {Text, View, TextInput} from "react-native";
import {Router, Scene, Actions} from "react-native-router-flux";
import thunk from "redux-thunk";
import {createStore, applyMiddleware, combineReducers, Reducer, ActionCreator} from "redux";
import {connect, Provider} from "react-redux";

// ---

// ---

namespace ComponentTextInput {
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
        return Object.assign({}, state, {text: (action as ActionUpdateText).text, name: "aaa"});
    };

    export let ACTOR_createUpdateText: ActionCreator<ActionUpdateText> = function (text: string) {
        return {
            type: ACT_UPDATE_TEXT,
            text: text
        };
    };

    export class Application extends Component<any, any> {
        render() {
            return (
                <View style={{marginTop: 100}}>
                    <Text>This is ComponentInputText: </Text>
                    <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(text) => {
                            //noinspection TypeScriptValidateTypes
                            store.dispatch(ACTOR_createUpdateText(text));
                        }}
                        placeholder="test"
                    />
                    <Text>What inputted: {store.getState().ComponentTextInput.text}</Text>
                </View>
            );
        };
    }
}

// ---

const store = createStore(
    combineReducers({
        [ComponentTextInput.name]: ComponentTextInput.RDC_updateText
    }),
    applyMiddleware(thunk)
);

// ---

export default class App extends Component<any, any> {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Scene key="root">
                        <Scene key="pageOne" component={PageOne} title="PageOne" initial={true}/>
                        <Scene key="pageTwo" component={PageTwo} title="PageTwo"/>
                    </Scene>
                </Router>
            </Provider>
        );
    }
}

class PageOne extends Component<any, any> {
    render() {
        return (
            <View style={{margin: 0}}>
                <ComponentTextInput.Application />
            </View>
        );
    }
}

class PageTwo extends Component<any, any> {
    render() {
        return (
            <View style={{margin: 0}}>
                <ComponentTextInput.Application />
            </View>
        );
    }
}