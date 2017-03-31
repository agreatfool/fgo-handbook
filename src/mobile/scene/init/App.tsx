import React, {Component} from "react";
import {View, Text, ActivityIndicator} from "react-native";
import {Actions} from "react-native-router-flux";
import injectIntoComponent from "../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import * as SystemService from "../../service/SystemService";
import InjectedProps from "../../../lib/react/InjectedProps";
import * as Styles from "../../view/Styles";

export * from "./State";
export * from "./Action";

interface Props extends InjectedProps {
    SceneInitialization: State.State;
}

class Initialization extends Component<Props, {}> {

    private _system: SystemService.Service;

    constructor(props: Props, context) {
        super(props, context);
        this.props = props;
        this._system = new SystemService.Service();
    }

    componentDidMount() {
        this._system.init((this.props as Props).actions.updateLoading).then(() => {
            //noinspection TypeScriptValidateJSTypes
            (Actions as any).tabs();
        });
    }

    componentWillUnmount() {
        (this.props as Props).actions.stopAnimating();
    }

    render() {
        let state: State.State = (this.props as Props).SceneInitialization;
        return (
            <View style={[Styles.Common.flexColumn, Styles.Common.flexDefault]}>
                <View style={Styles.Common.flexDefault}>
                    <View style={Styles.Landing.footer}>
                        <Text style={Styles.Common.textCenter}>
                            {state.loading}
                        </Text>
                    </View>
                </View>
                <View style={Styles.Common.flexDefault}>
                    <ActivityIndicator
                        animating={state.animating}
                        style={[
                            Styles.Common.flexDefault,
                            Styles.Common.centering,
                            {padding: 8}
                        ]}
                        size="large"
                    />
                </View>
                <View style={Styles.Common.flexDefault}>
                    <View style={Styles.Landing.footer}>
                        <Text style={Styles.Common.textCenter}>Copyright Jonathan</Text>
                        <Text style={Styles.Common.textCenter}>Company Good</Text>
                    </View>
                </View>
            </View>
        );
    }
}

export const App = injectIntoComponent(Initialization, State.StateName, Action.Actions);