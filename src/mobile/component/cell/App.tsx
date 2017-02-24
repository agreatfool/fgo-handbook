import React, {Component} from "react";
import {Text, View, TextInput, Button, Image, ImageResizeMode, StyleSheet} from "react-native";

import injectIntoComponent from "../../../lib/react/Connect";
import {Actions} from "./Action";
import {StateName} from "./State";

const styles = StyleSheet.create({
    cell: {
        flex: 1,
        width: 70,
        height: 70,
        marginLeft: 5,
        marginRight: 5,
        borderWidth: 1,
        borderStyle: "solid" as any,
        borderColor: "black",
    },
    image: {
        flex: 1,
        width: 70,
        resizeMode: "contain" as ImageResizeMode
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
            <View style={styles.cell}>
                <Image style={styles.image} source={require("../../../../database/0.0.1/images/face/100100.png")}/>
            </View>
        );
    };
}

export const App = injectIntoComponent(Application, StateName, Actions);