import React, {Component} from "react";
import {View, Text} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import MstUtil from "../../../lib/model/MstUtil";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import * as Renderer from "./View";
import * as Styles from "../../../style/Styles";

export * from "./State";
export * from "./Action";

class ServantStory extends Component<State.Props, any> {
    private _appVer: string;
    private _service: MstService.Service;

    constructor(props, context) {
        super(props, context);
        this._service = new MstService.Service();
    }

    componentWillMount() {
        let props = this.props as State.Props;
        MstUtil.instance.getAppVer().then((appVer) => {
            this._appVer = appVer;
            return this._service.getServantName(props.svtId);
        }).then((name) => {
            props.actions.updatePageTitle(name);
            return this._service.buildSvtInfoStory(props.svtId);
        }).then((info) => {
            props.actions.updateSvtInfo({storyInfo: info});
        });
    }

    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View style={{marginTop: 0}}>
                <Text>{this.props.svtId} Material</Text>
            </View>
        );
    }
}

export const App = injectIntoComponent(ServantStory, State.StateName, Action.Actions);