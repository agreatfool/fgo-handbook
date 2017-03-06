import React, {Component} from "react";
import {View, Text, ScrollView, StyleSheet, FlexDirection} from "react-native";
import {Actions} from "react-native-router-flux";

import injectIntoComponent from "../../../../lib/react/Connect";

import * as MstService from "../../../service/MstService";

const styles = StyleSheet.create({
    flex_row: {
        flexDirection: "row" as FlexDirection
    },
    row: {
        marginBottom: 5,
    }
});

class ServantDetail extends Component<any, any> {
    private _service: MstService.Service;

    constructor(props, context) {
        super(props, context);
        this._service = new MstService.Service();
        this.state = {
            info: 123
        }
    }

    componentWillMount() {
        let app = this;
        //noinspection TypeScriptUnresolvedVariable
        Actions.refresh({title: this.props.svtId});
        //noinspection TypeScriptUnresolvedVariable
        this._service.buildSvtInfo(this.props.svtId).then((info) => {
            let updated = "";
            try {
                updated = JSON.stringify(info, null, 4);
                console.log(updated);
                app.setState({
                    info: info.infoBase.name
                });
            } catch (err) {
                console.log(err);
            }
        });
    }

    // FIXME 添加客制化数据添加功能
    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View style={{height: 612}}>
                <ScrollView>
                    {/*从者头像及姓名等*/}
                    <View style={[styles.flex_row, styles.row]}>
                        <Text>{this.state.info}</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export const App = injectIntoComponent(ServantDetail);