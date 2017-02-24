import React, {Component} from "react";
import {Text, View, TextInput, Button, FlexDirection, StyleSheet} from "react-native";

import injectIntoComponent from "../../../lib/react/Connect";
import {Actions} from "./Action";
import {StateName} from "./State";

import {App as Cell} from "../cell/App";


const styles = StyleSheet.create({
    row: {
        flexDirection: "row" as FlexDirection,
        marginTop: 5,
        marginBottom: 5
    }
});

export class Application extends Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        // console.log(props);
    }

    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View style={styles.row}>
                <Cell/>
                <Cell/>
                <Cell/>
                <Cell/>
                <Cell/>
            </View>
        );
    };
}

export const App = injectIntoComponent(Application, StateName, Actions);