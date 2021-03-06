import React, {Component, ReactNode} from "react";
import {Image, StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import {Button, Card, CardItem, Col, Container, Grid, Left, Right, Row} from "native-base";
import * as Styles from "./Styles";
import MstLoader from "../lib/model/MstLoader";

export interface Props {
    children?: ReactNode;
}

interface ThumbnailProps extends Props {
    type: string;
    id: number;
    big?: boolean;
}

export class Thumbnail extends Component<ThumbnailProps, any> {
    render() {
        let props = this.props as ThumbnailProps;

        let source = MstLoader.instance.loadImage(props.type, props.id);

        let style;
        if (props.hasOwnProperty("big") && props.big) {
            style = Styles.Common.ThumbBig;
        } else {
            style = Styles.Common.ThumbIcon;
        }

        return (
            <Image source={source} style={style}/>
        );
    }
}

export class ContainerWhite extends Component<Props, any> {
    render() {
        let props = this.props as Props;
        return (
            <Container style={{backgroundColor: "#FFF"}}>
                {props.children}
            </Container>
        );
    }
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
            backgroundColor: "#FFF"
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

        let backgroundColor = "#FFF";
        if (props.hasOwnProperty("backgroundColor")) {
            backgroundColor = props.backgroundColor;
            delete props["backgroundColor"];
        }

        return (
            <Grid>
                <ColCardWrapper {...props} backgroundColor={backgroundColor}>
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
    buttons: Array<string>;
    onPress: Array<() => void>;
}

export class CardWithRButton extends Component<CardWithRButtonProps, any> {
    render() {
        let props = this.props as CardWithRButtonProps;

        let buttons = [];
        props.buttons.forEach((button: string, index: number) => {
            let event = props.onPress[index];
            buttons.push(
                <Col key={`CardWithRButton_${button}_${index}`} size={.5} style={{backgroundColor: "#FFF"}}>
                    <Button small block info bordered onPress={event}
                            style={{marginRight: 10, marginTop: 3, marginBottom: 3}}>
                        <Text>{button}</Text>
                    </Button>
                </Col>
            );
        });

        return (
            <CardFix>
                <Grid>
                    <Col style={[Styles.Common.VerticalCentering, {backgroundColor: "#FFF"}]}>
                        <Text style={{marginLeft: 10}}>{props.title}</Text>
                    </Col>
                    {buttons}
                </Grid>
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
                <Grid style={{backgroundColor: "#FFF"}}>
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