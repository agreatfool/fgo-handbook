import React from "react";
import {View, TouchableOpacity, Text, ScrollView} from "react-native";
import MstUtil from "../../../lib/model/MstUtil";
import {CacheImage} from "../../../component/cache_image/App";
import * as Styles from "../../../style/Styles";
import JSXElement = JSX.JSXElement;

export interface ToolBoxButton {
    text: string;
    onPress?: () => void;
}

export const renderToolBoxTop = function (buttons: Array<ToolBoxButton>) {
    let buttonElements = [];
    buttons.forEach((button: ToolBoxButton) => {
        buttonElements.push(
            <TouchableOpacity
                key={MstUtil.randomString(6)}
                style={Styles.ToolBoxTop.button}
                onPress={button.onPress}>
                <Text style={Styles.ToolBoxTop.text}>
                    {button.text}
                </Text>
            </TouchableOpacity>
        );
    });

    return (
        <View style={Styles.ToolBoxTop.container}>
            {buttonElements}
        </View>
    );
};

export const renderResourceImg = function (appVer: string, type: string, id: number): JSXElement {
    let url = "";

    switch (type) {
        case "item":
            url = MstUtil.instance.getRemoteItemUrl(appVer, id);
            break;
        case "skill":
            url = MstUtil.instance.getRemoteSkillUrl(appVer, id);
            break;
        case "face":
        default:
            url = MstUtil.instance.getRemoteFaceUrl(appVer, id);
            break;
    }

    return <CacheImage style={Styles.Common.resImg} url={url}/>;
};

export const renderPageAreaWithoutToolBox = function (rows: Array<JSXElement>) {
    return (
        <View style={Styles.Tab.pageDisplayArea}>
            <ScrollView style={Styles.Common.flexColumn}>
                {rows}
            </ScrollView>
        </View>
    );
};

export const renderRow = function (columns: Array<JSXElement>, img?: JSXElement) {
    return (
        <View style={[
                    Styles.Common.flexRow,
                    Styles.Common.flexDefault,
                    Styles.Common.row,
                ]}
              key={MstUtil.randomString(6)}>
            {img}
            {columns}
        </View>
    );
};

export interface ColumnData {
    title: string | number;
    // content和element两取一，两者皆存在则取element
    content?: string | number;
    element?: JSXElement;
}

export interface ColumnOptions {
    height?: number;
    centering?: boolean;
}

export const renderColumn = function (column: ColumnData, options?: ColumnOptions) {
    let titleHeight = 20;
    let columnHeight = options && options.height ? options.height : 50;

    let Content = function (props) {
        let styles = [
            {minHeight: columnHeight - titleHeight},
            Styles.Common.verticalCentering,
            Styles.Tab.tabBar
        ];
        if (options && options.centering) {
            styles.push(Styles.Common.horizontalCentering);
        }
        return (
            <View style={styles}>
                {props.children}
            </View>
        );
    };

    let columnDisplay = undefined;
    if (column.element) {
        columnDisplay = <Content>{column.element}</Content>;
    } else if (column.content) {
        columnDisplay = (
            <Content>
                <Text style={Styles.Common.textCenter}>{column.content}</Text>
            </Content>
        );
    }

    // column只有title的情况，title的高度应该占满
    if (!columnDisplay) {
        titleHeight = columnHeight;
    }

    return (
        <View style={[
                    Styles.Common.flexColumn,
                    Styles.Common.flexDefault,
                    {minHeight: columnHeight}
                ]}
              key={MstUtil.randomString(6)}>
            <View style={[Styles.Common.centering, {height: titleHeight}, Styles.Tab.tabBar]}>
                <Text style={Styles.Common.textCenter}>{column.title}</Text>
            </View>
            {columnDisplay}
        </View>
    );
};