import React, {Component} from "react";
import {View, Text, StyleSheet, Image, FlexDirection, ImageResizeMode} from "react-native";
import {Actions} from "react-native-router-flux";

import injectIntoComponent from "../../../../lib/react/Connect";

const styles = StyleSheet.create({
    row: {
        flexDirection: "row" as FlexDirection,
        marginTop: 5,
        marginBottom: 5
    },
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

class Servant extends Component<any, any> {
    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View style={{marginTop: 0}}>
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Image style={styles.image} source={require("../../../../../database/0.0.1/images/face/100100.png")}/>
                    </View>
                    <View style={styles.cell}>
                        <Image style={styles.image} source={require("../../../../../database/0.0.1/images/face/100100.png")}/>
                    </View>
                    <View style={styles.cell}>
                        <Image style={styles.image} source={require("../../../../../database/0.0.1/images/face/100100.png")}/>
                    </View>
                    <View style={styles.cell}>
                        <Image style={styles.image} source={require("../../../../../database/0.0.1/images/face/100100.png")}/>
                    </View>
                    <View style={styles.cell}>
                        <Image style={styles.image} source={require("../../../../../database/0.0.1/images/face/100100.png")}/>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Image style={styles.image} source={require("../../../../../database/0.0.1/images/face/100100.png")}/>
                    </View>
                    <View style={styles.cell}>
                        <Image style={styles.image} source={require("../../../../../database/0.0.1/images/face/100100.png")}/>
                    </View>
                    <View style={styles.cell}>
                        <Image style={styles.image} source={require("../../../../../database/0.0.1/images/face/100100.png")}/>
                    </View>
                    <View style={styles.cell}>
                        <Image style={styles.image} source={require("../../../../../database/0.0.1/images/face/100100.png")}/>
                    </View>
                    <View style={styles.cell}>
                        <Image style={styles.image} source={require("../../../../../database/0.0.1/images/face/100100.png")}/>
                    </View>
                </View>
            </View>
        );
    }
}

export const App = injectIntoComponent(Servant);