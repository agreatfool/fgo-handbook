import React, {Component} from "react";
import {View, Text, ScrollView, StyleSheet, FlexDirection} from "react-native";
import {Actions} from "react-native-router-flux";

import injectIntoComponent from "../../../../lib/react/Connect";

const styles = StyleSheet.create({
    flex_row: {
        flexDirection: "row" as FlexDirection
    },
    row: {
        marginBottom: 5,
    }
});

class ServantDetail extends Component<any, any> {

    componentWillMount() {
        //noinspection TypeScriptUnresolvedVariable
        Actions.refresh({title: this.props.svtId});
    }

    // FIXME 添加客制化数据添加功能
    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View style={{height: 612}}>
                <ScrollView>
                    {/*从者头像及姓名等*/}
                    <View style={[styles.flex_row, styles.row]}>
                        <Text>1111111</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export const App = injectIntoComponent(ServantDetail);