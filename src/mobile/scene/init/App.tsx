import React, {Component} from "react";
import {Text} from "react-native";
import injectIntoComponent from "../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import * as SystemService from "../../service/SystemService";
import InjectedProps from "../../../lib/react/InjectedProps";
import {Body, Col, Container, Content, Footer, Grid, Row, Spinner} from "native-base";
import {ContainerWhite} from "../../view/View";

export * from "./State";
export * from "./Action";

interface InitializationProps extends InjectedProps {
    SceneInitialization: State.State;
}

class Initialization extends Component<InitializationProps, {}> {

    private _system: SystemService.Service;

    constructor(props: InitializationProps, context) {
        super(props, context);
        this.props = props;
        this._system = new SystemService.Service();
    }

    componentDidMount() {
        let props = this.props as InitializationProps;

        this._system.init(props.actions.updateLoading).then(() => {
            //noinspection TypeScriptUnresolvedFunction
            // (Actions as any).servant_list();
            props.navigation.navigate("ServantList");
        });
    }

    render() {
        let state: State.State = (this.props as InitializationProps).SceneInitialization;

        return (
            <ContainerWhite>
                <Grid>
                    <Row size={1}/>
                    <Row style={{height: 50}}>
                        <Body><Text>{state.loading}</Text></Body>
                    </Row>
                    <Row size={1}>
                        <Body><Spinner/></Body>
                    </Row>
                    <Row size={1}/>
                    <Row style={{height: 50}}>
                        <Grid>
                            <Row><Body><Text>Copyright Jonathan</Text></Body></Row>
                            <Row><Body><Text>Company Good</Text></Body></Row>
                        </Grid>
                    </Row>
                </Grid>
            </ContainerWhite>
        );
    }
}

export const App = injectIntoComponent(Initialization, State.StateName, Action.Actions);