import React, {Component, ReactNode} from "react";
import {Text} from "react-native";
import {Grid, Col, Row, Card, CardItem, Body} from "native-base";
import * as Styles from "./Styles";
import JSXElement = JSX.JSXElement;

export interface Props {
    children?: ReactNode;
}

export class GridLine extends Component<Props, any> {
    render() {
        let props = this.props as Props;
        return (
            <Grid>
                {props.children}
            </Grid>
        );
    }
}

interface ColCardProps extends Props {
    items: Array<String | number | JSXElement>;
}

export class ColCard extends Component<ColCardProps, any> {
    render() {
        let props = this.props as ColCardProps;
        let rows = [];
        props.items.forEach((item, index) => {
            if (typeof item === "string" || typeof item === "number") {
                rows.push(
                    <Row key={`ColCard${index}`} style={[Styles.Common.Centering, {minHeight: 20}]}>
                        <Text style={Styles.Common.TextCenter}>{item}</Text>
                    </Row>
                );
            } else {
                rows.push(
                    <Row key={`ColCard${index}`} style={[Styles.Common.Centering, {minHeight: 20}]}>
                        {item}
                    </Row>
                );
            }
        });

        return (
            <Col>
                <Card>
                    <CardItem>
                        <Grid>
                            {rows}
                        </Grid>
                    </CardItem>
                </Card>
            </Col>
        );
    }
}