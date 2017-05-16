import React, {Component, ReactNode} from "react";
import {Text} from "react-native";
import {Grid, Col, Row, Card, CardItem, Body} from "native-base";
import * as Styles from "./Styles";

export interface Props {
    children?: ReactNode;
}

export class GridLine extends Component<Props, any> {
    render() {
        let props = this.props as Props;
        return (
            <Grid style={Styles.Common.Row}>
                {props.children}
            </Grid>
        );
    }
}

export class RowText extends Component<Props, any> {
    render() {
        let props = this.props as Props;
        return (
            <Row>
                <ColText>
                    {props.children}
                </ColText>
            </Row>
        );
    }
}

export class ColText extends Component<Props, any> {
    render() {
        let props = this.props as Props;
        return (
            <Col style={[Styles.Common.Centering, {height: 28}]}>
                <Text>{props.children}</Text>
            </Col>
        );
    }
}