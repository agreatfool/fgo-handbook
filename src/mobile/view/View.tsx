import React, {Component, ReactNode} from "react";
import {StyleSheet, Text, TextStyle, ViewStyle, View} from "react-native";
import {Button, Card, CardItem, Col, Grid, Row, Right, Thumbnail, Left, Body} from "native-base";
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

        let rowStyle = {
            flex: 1,
            flexDirection: "row" as any,
            minHeight: 20,
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 5,
            paddingRight: 5,
            backgroundColor: "#FFFFFF"
        };
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

        let cardProps = {
            isColumn: true
        };
        if (props.hasOwnProperty("backgroundColor")) {
            cardProps = Object.assign(cardProps, {backgroundColor: props.backgroundColor});
        }

        props.items.forEach((item, index) => {
            if (typeof item === "string" || typeof item === "number") {
                rows.push(
                    <View key={`ColCard${index}`} style={rowStyle}>
                        <Text style={textStyle}>{item}</Text>
                    </View>
                );
            } else {
                rows.push(
                    <View key={`ColCard${index}`} style={rowStyle}>
                        {item}
                    </View>
                );
            }
        });

        return (
            <CardFix {...cardProps}>
                {rows}
            </CardFix>
        );
    }
}

interface GridCardWrapperProps extends Props {
    size?: number;
    backgroundColor?: string;
}

export class GridCardWrapper extends Component<GridCardWrapperProps, any> {
    render() {
        let props = this.props as GridCardWrapperProps;
        return (
            <Grid>
                <ColCardWrapper {...props}>
                    {props.children}
                </ColCardWrapper>
            </Grid>
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
                <CardFix>
                    <Grid style={cardItemStyle}>
                        {props.children}
                    </Grid>
                </CardFix>
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

interface CardWithRButtonProps extends Props {
    title: string;
    button: string;
    onPress: () => void;
}

export class CardWithRButton extends Component<CardWithRButtonProps, any> {
    render() {
        let props = this.props as CardWithRButtonProps;
        return (
            <CardFix>
                <CardItem>
                    <Left>
                        <Text>{props.title}</Text>
                    </Left>
                    <Right>
                        <Button small block info bordered onPress={props.onPress}>
                            <Text>{props.button}</Text>
                        </Button>
                    </Right>
                </CardItem>
            </CardFix>
        );
    }
}

interface CardFixProps extends Props {
    isColumn?: boolean;
    backgroundColor?: string;
}

export class CardFix extends Component<CardFixProps, any> {
    render() {
        let props = this.props as CardFixProps;

        let styles = {};
        if (props.hasOwnProperty("backgroundColor")) {
            styles = Object.assign(styles, {backgroundColor: props.backgroundColor});
        }
        if (props.hasOwnProperty("isColumn") && props.isColumn === true) {
            styles = Object.assign(styles, {flexDirection: "column"});
        } else {
            styles = Object.assign(styles, {flexDirection: "row"});
        }

        return (
            <View style={[Styles.Common.Card, styles]}>
                {props.children}
            </View>
        );
    }
}

export class CardGridWrapper extends Component<Props, any> {
    render() {
        let props = this.props as Props;
        return (
            <CardFix>
                <Grid>
                    {props.children}
                </Grid>
            </CardFix>
        );
    }
}

interface RowCenteringProps extends Props {
    height?: number; // default 20
}

export class RowCentering extends Component<RowCenteringProps, any> {
    render() {
        let props = this.props as RowCenteringProps;

        let rowStyle = {
            backgroundColor: "#FFFFFF",
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
        };
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