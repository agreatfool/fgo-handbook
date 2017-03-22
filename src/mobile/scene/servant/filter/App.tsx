import React, {Component} from "react";
import {View, Text} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import {TabScene} from "../main/View";

export * from "./State";
export * from "./Action";

export class ServantFilter extends Component<State.Props, any> {
    private _service: MstService.Service;

    constructor(props, context) {
        super(props, context);

        this._service = new MstService.Service();
    }

    componentDidMount() {
        let props = this.props as State.Props;
        let state = props.SceneServantList;
    }

    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <TabScene>
                <View><Text>ServantFilter</Text></View>
            </TabScene>
        );
    }
}

export const App = injectIntoComponent(ServantFilter, State.StateName, Action.Actions);