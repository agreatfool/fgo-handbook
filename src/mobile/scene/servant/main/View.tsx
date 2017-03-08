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
        <View
            key={MstUtil.randomString(4)}
            style={[
                Styles.Common.flexRow,
                Styles.Common.flexDefault,
                Styles.Common.row,
            ]}
        >
            {img}
            {columns}
        </View>
    );
};

export interface ColumnData {
    title?: string | number;
    rows?: Array<Array<string | number | JSXElement>>;
}

export interface ColumnOptions {
    titleHeight?: number;
    contentHeight?: number;
    centering?: boolean;
    /**
     * 用来控制只有title的情况下整体Column的高度，
     * rowsCount指同行的其他Column的Content行数，
     * 知道了这个值就可以计算当前Column的高度了
     */
    rowsCount?: number;
}

export const buildColumnStructSimple = function (title?: string | number, content?: string | number | JSXElement): ColumnData {
    let result = {} as ColumnData;

    if (title) {
        result.title = title;
    }
    if (content) {
        result.rows = [[content]];
    }

    return result;
};

export const buildColumnStructRow = function (title?: string | number, cells?: Array<string | number | JSXElement>): ColumnData {
    let result = {} as ColumnData;

    if (title) {
        result.title = title;
    }
    if (cells) {
        result.rows = [cells];
    }

    return result;
};

export const buildColumnStruct = function (title?: string | number, rows?: Array<Array<string | number | JSXElement>>): ColumnData {
    let result = {} as ColumnData;

    if (title) {
        result.title = title;
    }
    if (rows) {
        result.rows = rows;
    }

    return result;
};

export const renderColumn = function (column: ColumnData, options?: ColumnOptions) {
    let titleHeight = options && options.titleHeight ? options.titleHeight : 20;
    let contentHeight = options && options.contentHeight ? options.contentHeight : 50;
    let centering = options && options.centering ? options.centering : true;
    let columnHeight = 0;

    // 根据输入信息，重新计算title的高度和整体column的高度
    let rowsCount = 0;
    if (column.rows) {
        rowsCount = column.rows.length;
    } else if (options && options.rowsCount) {
        rowsCount = options.rowsCount;
    }
    columnHeight = titleHeight + contentHeight * rowsCount;
    if (!column.rows) {
        titleHeight = columnHeight;
    }

    const Column = function (props) {
        return (
            <View
                style={[
                    Styles.Common.flexColumn,
                    Styles.Common.flexDefault,
                    {minHeight: columnHeight},
                ]}
            >
                {props.children}
            </View>
        );
    };

    const ColumnTitle = function (props) {
        if (props.children) {
            return (
                <View
                    style={[
                        Styles.Common.centering,
                        Styles.Tab.tabBar,
                        {height: titleHeight},
                    ]}
                >
                    <Text style={Styles.Common.textCenter}>{props.children}</Text>
                </View>
            );
        } else {
            return undefined;
        }
    };

    const ColumnContentRow = function (props) {
        return (
            <View
                style={[
                    Styles.Common.flexRow,
                    Styles.Common.centering,
                    {height: contentHeight},
                ]}
            >
                {props.children}
            </View>
        );
    };

    const ColumnContentWrapper = function (props) {
        return (
            <View
                style={[
                    Styles.Common.flexDefault,
                    Styles.Common.verticalCentering,
                    Styles.Tab.tabBar,
                    {height: contentHeight},
                ]}
            >
                {props.children}
            </View>
        );
    };

    const ColumnContent = function (props) {
        let content = props.children;

        if (typeof content === "string" || typeof content === "number") {
            let styles = [];
            if (centering) {
                styles.push(Styles.Common.textCenter);
            }
            return <Text style={styles}>{content}</Text>;
        } else {
            return content;
        }
    };

    const render = function () {
        let title = <ColumnTitle>{column.title}</ColumnTitle>;
        let rows = column.rows ? [] : undefined;
        if (column.rows) {
            column.rows.forEach((row: Array<string | number | JSXElement>) => {
                let columnRowCells = [];
                row.forEach((cell: string | number | JSXElement) => {
                    columnRowCells.push(
                        <ColumnContentWrapper key={MstUtil.randomString(4)}>
                            <ColumnContent>{cell}</ColumnContent>
                        </ColumnContentWrapper>
                    );
                });
                rows.push(
                    <ColumnContentRow key={MstUtil.randomString(4)}>
                        {columnRowCells}
                    </ColumnContentRow>
                );
            });
        }

        return (
            <Column key={MstUtil.randomString(4)}>
                {title}
                {rows}
            </Column>
        );
    };

    return render();
};