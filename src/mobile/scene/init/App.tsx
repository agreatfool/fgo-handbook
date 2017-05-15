import React, {Component} from "react";
import {View, Text, ActivityIndicator} from "react-native";
import {Actions} from "react-native-router-flux";
import injectIntoComponent from "../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import * as SystemService from "../../service/SystemService";
import InjectedProps from "../../../lib/react/InjectedProps";
import * as Styles from "../../view/Styles";
import {Container, Content, Footer, Grid, Row, Col, Spinner, Body} from "native-base";

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
            //noinspection TypeScriptUnresolvedFunction
            (Actions as any).servant_list();
        });
    }

    render() {
        let state: State.State = (this.props as Props).SceneInitialization;
        return (
            <Container>
                <Grid>
                    <Row size={1} />
                    <Row style={{height: 50}}>
                        <Body><Text>{state.loading}</Text></Body>
                    </Row>
                    <Row size={1}>
                        <Body><Spinner /></Body>
                    </Row>
                    <Row size={1} />
                    <Row style={{height: 50}}>
                        <Grid>
                            <Row><Body><Text>Copyright Jonathan</Text></Body></Row>
                            <Row><Body><Text>Company Good</Text></Body></Row>
                        </Grid>
                    </Row>
                </Grid>
            </Container>
        );
    }
}

export const App = injectIntoComponent(Initialization, State.StateName, Action.Actions);