import React, {Component, ReactNode} from "react";
import {Text, TextStyle, ViewStyle, StyleSheet} from "react-native";
import {Card, CardItem, Col, Grid, Row} from "native-base";
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
    size?: number;
    rowHeight?: number;             // default 20
    rowStyle?: ViewStyle;
    textStyle?: TextStyle;
    isVerticalCentered?: boolean;   // default true
    isHorizontalCentered?: boolean; // default true
    isTextCentered?: boolean;       // default true
    backgroundColor?: string;
}

export class ColCard extends Component<ColCardProps, any> {
    render() {
        let props = this.props as ColCardProps;
        let rows = [];

        let colProps = {};
        if (props.hasOwnProperty("size")) {
            colProps = Object.assign(colProps, {size: props.size});
        }

        let rowStyle = {};
        rowStyle = Object.assign(rowStyle, {minHeight: 20});
        if (!(props.hasOwnProperty("isVerticalCentered") && !props.isVerticalCentered)) {
            rowStyle = Object.assign(rowStyle, StyleSheet.flatten(Styles.Common.VerticalCentering));
        }
        if (!(props.hasOwnProperty("isHorizontalCentered") && !props.isHorizontalCentered)) {
            rowStyle = Object.assign(rowStyle, StyleSheet.flatten(Styles.Common.HorizontalCentering));
        }
        if (props.hasOwnProperty("rowHeight")) {
            rowStyle = Object.assign(rowStyle, {height: props.rowHeight});
        }
        if (props.hasOwnProperty("rowStyle")) {
            rowStyle = Object.assign(rowStyle, props.rowStyle);
        }

        let textStyle = {};
        if (!(props.hasOwnProperty("isTextCentered") && !props.isTextCentered)) {
            textStyle = Object.assign(textStyle, StyleSheet.flatten(Styles.Common.TextCentering));
        }
        if (props.hasOwnProperty("textStyle")) {
            textStyle = Object.assign(textStyle, props.textStyle);
        }

        let cardItemStyle = {};
        if (props.hasOwnProperty("backgroundColor")) {
            cardItemStyle = Object.assign(cardItemStyle, {backgroundColor: props.backgroundColor});
        }

        props.items.forEach((item, index) => {
            if (typeof item === "string" || typeof item === "number") {
                rows.push(
                    <Row key={`ColCard${index}`} style={rowStyle}>
                        <Text style={textStyle}>{item}</Text>
                    </Row>
                );
            } else {
                rows.push(
                    <Row key={`ColCard${index}`} style={rowStyle}>
                        {item}
                    </Row>
                );
            }
        });

        return (
            <Col {colProps}>
                <Card>
                    <CardItem style={cardItemStyle}>
                        <Grid>
                            {rows}
                        </Grid>
                    </CardItem>
                </Card>
            </Col>
        );
    }
}

interface ColCardWrapperProps extends Props {
    size?: number;
}

export class ColCardWrapper extends Component<ColCardWrapperProps, any> {
    render() {
        let props = this.props as ColCardWrapperProps;

        let colProps = {};
        if (props.hasOwnProperty("size")) {
            colProps = Object.assign(colProps, {size: props.size});
        }

        return (
            <Col {colProps}>
                <Card>
                    <CardItem>
                        <Grid>
                            {props.children}
                        </Grid>
                    </CardItem>
                </Card>
            </Col>
        );
    }
}

export class GridColCardWrapper extends Component<Props, any> {
    render() {
        let props = this.props as Props;
        return (
            <GridLine>
                <Col>
                    <Card>
                        <CardItem>
                            <Grid>
                                {props.children}
                            </Grid>
                        </CardItem>
                    </Card>
                </Col>
            </GridLine>
        );
    }
}

interface RowCenteringProps extends Props {
    height?: number; // default 20
}

export class RowCentering extends Component<RowCenteringProps, any> {
    render() {
        let props = this.props as RowCenteringProps;

        let rowStyle = {};
        rowStyle = Object.assign(rowStyle, StyleSheet.flatten(Styles.Common.Centering));
        rowStyle = Object.assign(rowStyle, {minHeight: 20});
        if (props.hasOwnProperty("height")) {
            rowStyle = Object.assign(rowStyle, {height: props.height});
        }

        return (
            <Row style={rowStyle}>
                {props.children}
            </Row>
        );
    }
}

interface ColCenteringProps extends Props {
    size?: number;
}

export class ColCentering extends Component<ColCenteringProps, any> {
    render() {
        let props = this.props as ColCenteringProps;

        let colProps = {};
        if (props.hasOwnProperty("size")) {
            colProps = Object.assign(colProps, {size: props.size});
        }

        return (
            <Col {colProps} style={Styles.Common.Centering}>
                {props.children}
            </Col>
        );
    }
}

export class TextCentering extends Component<Props, any> {
    render() {
        let props = this.props as Props;
        return (
            <Text style={Styles.Common.TextCentering}>
                {props.children}
            </Text>
        );
    }
}