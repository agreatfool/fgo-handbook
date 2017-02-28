import React, {Component} from "react";
import {View, Text, ActivityIndicator, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import injectIntoComponent from "../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import * as SystemService from "../../service/SystemService";
import InjectedProps from "../../../lib/react/InjectedProps";

export * from "./State";
export * from "./Action";

const styles = StyleSheet.create({
    centering: {
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
    },
    textCenter: {
        textAlign: "center" as any,
    },
    footer: {
        position: "absolute" as any,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 8
    }
});

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
        return (
            <View style={{flex: 1, flexDirection: "column"}}>
                <View style={{flex:1}}>
                    <View style={styles.footer}>
                        <Text style={styles.textCenter}>
                            {(this.props as Props).SceneInitialization.loading}
                        </Text>
                    </View>
                </View>
                <View style={{flex:1}}>
                    <ActivityIndicator
                        animating={(this.props as Props).SceneInitialization.animating}
                        style={[styles.centering, {flex:1}]}
                        size="large"
                    />
                </View>
                <View style={{flex:1}}>
                    <View style={styles.footer}>
                        <Text style={styles.textCenter}>Copyright Jonathan</Text>
                        <Text style={styles.textCenter}>Company Good</Text>
                    </View>
                </View>
            </View>
        );
    }
}

export const App = injectIntoComponent(Initialization, State.StateName, Action.Actions);