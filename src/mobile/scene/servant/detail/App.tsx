import React, {Component} from "react";
import {View, Text, TouchableOpacity, ScrollView} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import InjectedProps from "../../../../lib/react/InjectedProps";
import * as Styles from "../../../style/Styles";
import {SvtInfoBase} from "../../../lib/model/MstInfo";

export * from "./State";
export * from "./Action";

interface Props extends InjectedProps {
    svtId: number;
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
        let info: SvtInfoBase = (this.props as Props).SceneServantInfo.baseInfo;
        return (
            <View>
                <View style={[Styles.Common.flexRow, Styles.ToolBoxTop.container]}>
                    <TouchableOpacity style={Styles.ToolBoxTop.button}>
                        <Text style={Styles.ToolBoxTop.text}>
                            编辑模式
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{height: 582, padding: 5}}>
                    <ScrollView>
                        {/*从者头像及姓名等*/}
                        <View style={[]}>
                            <Text>{info.name}</Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

export const App = injectIntoComponent(ServantDetail, State.StateName, Action.Actions);