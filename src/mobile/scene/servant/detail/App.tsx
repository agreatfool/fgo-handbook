import React, {Component} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ViewStyle,
    TextStyle,
    FlexAlignType,
    FlexDirection
} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import InjectedProps from "../../../../lib/react/InjectedProps";

export * from "./State";
export * from "./Action";

const styles = StyleSheet.create({
    flexRow: {
        flexDirection: "row" as FlexDirection
    },
    flexRowRight: {
        flexDirection: "row-reverse" as FlexDirection
    },
    row: {
        marginBottom: 5,
    },
    topButton: {
        flex: 1,
        marginRight: 5,
        height: 20,
        alignItems: "flex-end" as FlexAlignType,
    } as ViewStyle,
    topButtonText: {
        width: 100,
        height: 20,
        lineHeight: 20,
        fontSize: 12,
        textAlign: "center",
        backgroundColor: "yellow",
    } as TextStyle
});

interface Props extends InjectedProps {
    SceneServantInfo: State.State;
}

class ServantDetail extends Component<Props, any> {
    private _service: MstService.Service;

    constructor(props, context) {
        super(props, context);
        this._service = new MstService.Service();
    }

    componentWillMount() {
        //noinspection TypeScriptUnresolvedVariable
        this._service.buildSvtInfoBase(this.props.svtId).then((info) => {
            (this.props as Props).actions.updatePageTitle(info.name);
            (this.props as Props).actions.updateSvtInfo({baseInfo: info});
        });
    }

    render() {
        let info = (this.props as Props).SceneServantInfo.baseInfo;
        return (
            <View>
                <View style={[styles.flexRow, {height: 20}]}>
                    <TouchableOpacity style={styles.topButton}>
                        <Text style={styles.topButtonText}>
                            编辑模式
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{height: 582, padding: 5}}>
                    <ScrollView>
                        {/*从者头像及姓名等*/}
                        <View style={[styles.flexRow, styles.row]}>
                            <Text>{info.name}</Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

export const App = injectIntoComponent(ServantDetail, State.StateName, Action.Actions);