import React, {Component} from "react";
import {Router, Scene} from "react-native-router-flux";
import {Text, View, TextInput, Button} from "react-native";

import injectIntoComponent from "../../../lib/react/Connect";
import {Actions} from "./Action";
import {StateName} from "./State";

import {App as ServantList} from "../../scene/servant_list/App";

export class Application extends Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        console.log(props);
    }

    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            //<Scene key="tabContainer" tabs={true} >
            //    <Scene key="tab5" component={ServantList} title="Tab #5" icon={TabButton} />
            //    <Scene key="tab5" component={TabView} title="Tab #5" icon={TabButton} />
            //    <Scene key="tab5" component={TabView} title="Tab #5" icon={TabButton} />
            //</Scene>
            <Scene key="tabContainer" tabs={true}>
                <Scene key="tab5" component={ServantList} title="Tab #5"/>
            </Scene>
        );
    };
}

export const App = injectIntoComponent(Application, StateName, Actions);