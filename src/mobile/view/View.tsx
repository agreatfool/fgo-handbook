import React, {Component, ReactNode} from "react";
import {StyleSheet, Text, TextStyle, ViewStyle} from "react-native";
import {Button, Card, CardItem, Col, Grid, Row, Thumbnail} from "native-base";
import * as Styles from "./Styles";

export interface Props {
    children?: ReactNode;
}

interface CardWithRowsProps extends Props {
    items: Array<String | number | JSX.Element>;
    size?: number;
    rowHeight?: number;             // default 20
    rowStyle?: ViewStyle;
    textStyle?: TextStyle;
    isVerticalCentered?: boolean;   // default true
    isHorizontalCentered?: boolean; // default true
    isTextCentered?: boolean;       // default true
    backgroundColor?: string;
}

export class CardWithRows extends Component<CardWithRowsProps, any> {
    render() {
        let props = this.props as CardWithRowsProps;
        let rows = [];

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
        if (props.hasOwnProperty("backgroundColor")) {
            rowStyle = Object.assign(rowStyle, {backgroundColor: props.backgroundColor});
        }

        let textStyle = {};
        if (!(props.hasOwnProperty("isTextCentered") && !props.isTextCentered)) {
            textStyle = Object.assign(textStyle, StyleSheet.flatten(Styles.Common.TextCentering));
        }
        if (props.hasOwnProperty("textStyle")) {
            textStyle = Object.assign(textStyle, props.textStyle);
        }

        let cardStyle = {};
        if (props.hasOwnProperty("backgroundColor")) {
            cardStyle = Object.assign(cardStyle, {backgroundColor: props.backgroundColor});
        }

        props.items.forEach((item, index) => {
            if (typeof item === "string" || typeof item === "number") {
                rows.push(
                    <CardItem key={`ColCard${index}`} style={rowStyle}>
                        <Text style={textStyle}>{item}</Text>
                    </CardItem>
                );
            } else {
                rows.push(
                    <CardItem key={`ColCard${index}`} style={rowStyle}>
                        {item}
                    </CardItem>
                );
            }
        });

        return (
            <Card style={cardStyle}>
                {rows}
            </Card>
        );
    }
}

interface ColCardWrapperProps extends Props {
    size?: number;
    backgroundColor?: string;
}

export class ColCardWrapper extends Component<ColCardWrapperProps, any> {
    render() {
        let props = this.props as ColCardWrapperProps;

        let colProps = {};
        if (props.hasOwnProperty("size")) {
            colProps = Object.assign(colProps, {size: props.size});
        }

        let cardItemStyle = {};
        if (props.hasOwnProperty("backgroundColor")) {
            cardItemStyle = Object.assign(cardItemStyle, {backgroundColor: props.backgroundColor});
        }

        return (
            <Col {...colProps}>
                <Card>
                    <CardItem style={cardItemStyle}>
                        <Grid>
                            {props.children}
                        </Grid>
                    </CardItem>
                </Card>
            </Col>
        );
    }
}

interface ColCardWithRightButtonProps extends Props {
    title: string;
    button: string;
    onPress: () => void;
}

export class ColCardWithRightButton extends Component<ColCardWithRightButtonProps, any> {
    render() {
        let props = this.props as ColCardWithRightButtonProps;
        return (
            <ColCardWrapper>
                <Row>
                    <Col style={Styles.Common.VerticalCentering}>
                        <Text>{props.title}</Text>
                    </Col>
                    <Col size={.3} style={[Styles.Common.VerticalCentering, {alignItems: "flex-end"}]}>
                        <Button small block info bordered onPress={props.onPress}>
                            <Text>{props.button}</Text>
                        </Button>
                    </Col>
                </Row>
            </ColCardWrapper>
        );
    }
}

export class GridColCardWrapper extends Component<Props, any> {
    render() {
        let props = this.props as Props;
        return (
            <Grid>
                <Col>
                    <Card>
                        <CardItem>
                            <Grid>
                                {props.children}
                            </Grid>
                        </CardItem>
                    </Card>
                </Col>
            </Grid>
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
            <Col {...colProps} style={Styles.Common.Centering}>
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