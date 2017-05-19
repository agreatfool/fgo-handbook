import React, {Component, ReactNode} from "react";
import {StyleSheet, Text, TextStyle, ViewStyle} from "react-native";
import {Button, Card, CardItem, Col, Grid, Row, Thumbnail} from "native-base";
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
            <ColR {...colProps}>
                <Card>
                    <CardItem style={cardItemStyle}>
                        <Grid>
                            {rows}
                        </Grid>
                    </CardItem>
                </Card>
            </ColR>
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
            <ColR {...colProps}>
                <Card>
                    <CardItem>
                        <Grid>
                            {props.children}
                        </Grid>
                    </CardItem>
                </Card>
            </ColR>
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
                    <ColR style={Styles.Common.VerticalCentering}>
                        <Text>{props.title}</Text>
                    </ColR>
                    <ColR size={.3} style={[Styles.Common.VerticalCentering, {alignItems: "flex-end"}]}>
                        <Button outline small block info bordered onPress={props.onPress}>
                            <Text>{props.button}</Text>
                        </Button>
                    </ColR>
                </Row>
            </ColCardWrapper>
        );
    }
}

export class GridColCardWrapper extends Component<Props, any> {
    render() {
        let props = this.props as Props;
        return (
            <GridLine>
                <ColR>
                    <Card>
                        <CardItem>
                            <Grid>
                                {props.children}
                            </Grid>
                        </CardItem>
                    </Card>
                </ColR>
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
            <ColR {...colProps} style={Styles.Common.Centering}>
                {props.children}
            </ColR>
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

interface ColRProps extends Props {
    size?: number;
    style?: ViewStyle;
}

export class ColR extends Component<ColRProps, any> {
    /**
     * 在所有使用 Col 的地方 tsc 莫名报错找不到 toString 和 toLocalString，
     * 只能自己封装一个 dummy 组件
     */
    render() {
        let props = this.props as ColRProps;

        let colProps = Object.assign({}, props);

        return (
            <Col {...colProps} toString={() => "col"} toLocaleString={() => "col"}>
                {props.children}
            </Col>
        );
    }
}

interface ThumbnailRProps extends Props {
    square?: boolean;
    small?: boolean;
    source?: any;
}

export class ThumbnailR extends Component<ThumbnailRProps, any> {
    /**
     * 在所有使用 Thumbnail 的地方 tsc 莫名报错找不到 toString 和 toLocalString，
     * 只能自己封装一个 dummy 组件
     */
    render() {
        let props = this.props as ThumbnailRProps;

        let thumbProps = Object.assign({}, props);

        return (
            <Thumbnail {...thumbProps} toString={() => "thumb"} toLocaleString={() => "thumb"}>
                {props.children}
            </Thumbnail>
        );
    }
}