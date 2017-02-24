import React, {Component} from "react";
import {View, Text, ActivityIndicator, StyleSheet} from "react-native";
import {Actions} from "react-native-router-flux";
import injectIntoComponent from "../../../lib/react/Connect";
import {StateName} from "./State";
import {Actions as SceneActions} from "./Action";
import SystemService from "../../service/SystemService";

const styles = StyleSheet.create({
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    textCenter: {
        textAlign: "center"
    },
    footer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: 8
    }
});

class Initialization extends Component<any, any> {

    private _system: SystemService;

    constructor(props, context) {
        super(props, context);
        this._system = new SystemService();
    }

    componentDidMount() {
        this._system.test();
        //noinspection TypeScriptUnresolvedVariable
        this.props.actions.updateLoading("loading xxx ...");
    }

    componentWillUnmount() {
        //noinspection TypeScriptUnresolvedVariable
        this.props.actions.stopAnimating();
    }

    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View style={{flex: 1, flexDirection: "column"}}>
                <View style={{flex:1}}>
                    <View style={styles.footer}>
                        <Text style={styles.textCenter}>{this.props.SceneInitialization.loading}</Text>
                    </View>
                </View>
                <View style={{flex:1}}>
                    <ActivityIndicator
                        animating={this.props.SceneInitialization.animating}
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

export const App = injectIntoComponent(Initialization, StateName, SceneActions);