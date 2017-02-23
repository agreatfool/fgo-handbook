import React, {Component} from "react";
import {Router, Scene} from "react-native-router-flux";
import thunk from "redux-thunk";
import {createStore, applyMiddleware, combineReducers} from "redux";
import {Provider} from "react-redux";
import {Text, StyleSheet} from "react-native";

import Reducers from "../app/Reducers";
import {App as Servant} from "../scene/servant/App";
import {App as Material} from "../scene/material/App";
import {App as Options} from "../scene/options/App";

const store = createStore(
    combineReducers(Reducers),
    applyMiddleware(thunk)
);

const styles = StyleSheet.create({
    navigation: {
        height: 64,
    },
    container: {
        marginTop: 64,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
    },
    tabBar: {
        borderWidth: 1,
        borderStyle: "dotted",
        borderColor: "#000000",
    },
    tabSelected: {
        color: "red",
    },
    tab: {
        color: "black",
    }
});

export class App extends Component<any, any> {
    render() {
        return (
            <Provider store={store}>
                <Router navigationBarStyle={styles.navigation}>
                    <Scene key="root">
                        <Scene key="tabs" tabs={true} tabBarStyle={styles.tabBar}>
                            <Scene key="servant" component={Servant} title="Servant" icon={TabButton} sceneStyle={styles.container}/>
                            <Scene key="material" component={Material} title="Material" icon={TabButton} sceneStyle={styles.container}/>
                            <Scene key="options" component={Options} title="Options" icon={TabButton} sceneStyle={styles.container}/>
                        </Scene>
                    </Scene>
                </Router>
            </Provider>
        );
    }
}

class TabButton extends Component<any, any> {
    render(){
        //noinspection TypeScriptUnresolvedVariable
        return (
            <Text style={this.props.selected ? styles.tabSelected : styles.tab}>{this.props.title}</Text>
        );
    }
}