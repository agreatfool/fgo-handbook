import React, {Component, ReactNode} from "react";
import {View, TouchableOpacity, Text, ScrollView} from "react-native";
import MstUtil from "../lib/utility/MstUtil";
import {CacheImage} from "../component/cache_image/App";
import * as Styles from "./Styles";
import JSXElement = JSX.JSXElement;

export interface Props {
    children?: ReactNode;
}

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
//-* TOOL BOX
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export interface ToolBoxButtonData {
    content: string | number | JSXElement;
    onPress?: () => void;
}

export interface ToolBoxWrapperProps extends Props {
    pageName: string;
    buttons: Array<ToolBoxButtonData>;
}

export class ToolBoxWrapper extends Component<ToolBoxWrapperProps, any> {
    render() {
        let props = this.props as ToolBoxWrapperProps;

        let buttonElements = [];
        props.buttons.forEach((button: ToolBoxButtonData, index) => {
            if (typeof button.content === "string" || typeof button.content === "number") {
                buttonElements.push(
                    <ToolBoxButtonText
                        key={`ToolBoxButtonText_${props.pageName}_${index}`}
                        onPress={button.onPress}>
                        {button.content}
                    </ToolBoxButtonText>
                );
            } else {
                buttonElements.push(
                    <ToolBoxButton
                        key={`ToolBoxButton_${props.pageName}_${index}`}
                        onPress={button.onPress}>
                        {button.content}
                    </ToolBoxButton>
                );
            }
        });

        return (
            <ToolBox>
                {buttonElements}
            </ToolBox>
        );
    };
}

export class ToolBox extends Component<Props, any> {
    render() {
        return (
            <View style={Styles.ToolBoxTop.container}>
                {(this.props as Props).children}
            </View>
        );
    }
}

export interface ToolBoxButtonProps extends Props {
    onPress?: () => void;
}

export class ToolBoxButtonText extends Component<ToolBoxButtonProps, any> {
    render() {
        let props = this.props as ToolBoxButtonProps;
        return (
            <TouchableOpacity
                style={Styles.ToolBoxTop.button}
                onPress={props.onPress}>
                <Text style={Styles.ToolBoxTop.text}>{props.children}</Text>
            </TouchableOpacity>
        );
    }
}

export class ToolBoxButton extends Component<ToolBoxButtonProps, any> {
    render() {
        let props = this.props as ToolBoxButtonProps;
        return (
            <TouchableOpacity
                style={Styles.ToolBoxTop.button}
                onPress={props.onPress}>
                {props.children}
            </TouchableOpacity>
        );
    }
}

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
//-* IMAGE
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export interface ResImageProps extends Props {
    appVer: string; // 0.0.1
    type: string; // face、item、skill
    id: number;
    size?: string; // small、big
}

export class ResImage extends Component<ResImageProps, any> {
    render() {
        let props = this.props as ResImageProps;

        let url = "";
        switch (props.type) {
            case "item":
                url = MstUtil.instance.getRemoteItemUrl(props.appVer, props.id);
                break;
            case "skill":
                url = MstUtil.instance.getRemoteSkillUrl(props.appVer, props.id);
                break;
            case "face":
            default:
                url = MstUtil.instance.getRemoteFaceUrl(props.appVer, props.id);
                break;
        }

        let style = Styles.Common.resImgBig;
        if (props.size && props.size === "small") {
            style = Styles.Common.resImgSmall;
        }
        return (
            <CacheImage
                style={style}
                url={url}
            />
        );
    }
}

export interface ResImageWithTextProps extends ResImageProps {
    text: string;
}

export class ResImageWithText extends Component<ResImageWithTextProps, any> {
    render() {
        let props = this.props as ResImageWithTextProps;
        props.size = "small"; // 固定小图标

        return (
            <View
                style={[
                    Styles.Common.flexDefault,
                    Styles.Common.flexRow,
                    Styles.Common.centering,
                    Styles.Common.resImgBoxWithText,
                ]}
            >
                <ResImage {...props} />
                <Text
                    style={[
                        Styles.Common.flexDefault,
                        Styles.Common.resImgBoxInlineText,
                    ]}
                >
                    {props.text}
                </Text>
            </View>
        );
    }
}

export class ResImageWithTextPlaceholder extends Component<any, any> {
    render() {
        let props = this.props as any;
        let children = props.children ? props.children : " ";

        return (
            <View
                style={[
                    Styles.Common.flexDefault,
                    Styles.Common.centering,
                    Styles.Common.resImgBoxWithText,
                ]}
            >
                <Text style={[Styles.Common.textCenter]}>{children}</Text>
            </View>
        );
    }
}

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
//-* TAB PAGE
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export class TabScene extends Component<Props, any> {
    render() {
        return (
            <View style={Styles.Tab.pageContainer}>
                {(this.props as Props).children}
            </View>
        );
    }
}

export class TabPageScroll extends Component<Props, any> {
    render() {
        return (
            <View style={Styles.Tab.pageDisplayArea}>
                <ScrollView style={Styles.Common.flexColumn}>
                    {(this.props as Props).children}
                </ScrollView>
            </View>
        );
    }
}

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
//-* TABLE
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export const TABLE_TITLE_HEIGHT_DEFAULT = 20;
export const TABLE_CONTENT_HEIGHT_DEFAULT = 50;

export interface TableColumnTitleProps extends Props {
    height: number;
}

export class TableColumnTitle extends Component<TableColumnTitleProps, any> {
    render() {
        let props = this.props as TableColumnTitleProps;
        if (props.children) {
            return (
                <View
                    style={[
                        Styles.Common.centering,
                        Styles.Tab.tabBar,
                        {height: props.height},
                    ]}
                >
                    <Text style={Styles.Common.textCenter}>{props.children}</Text>
                </View>
            );
        } else {
            return null;
        }
    }
}

export interface TableColumnContentRowProps extends Props {
    height: number;
}

export class TableColumnContentRow extends Component<TableColumnContentRowProps, any> {
    render() {
        let props = this.props as TableColumnContentRowProps;
        return (
            <View
                style={[
                    Styles.Common.flexRow,
                    Styles.Common.centering,
                    {minHeight: props.height},
                ]}
            >
                {props.children}
            </View>
        );
    }
}

export interface TableColumnContentProps extends Props {
    height: number;
    centering: boolean;
}

export class TableColumnContent extends Component<TableColumnContentProps, any> {
    render() {
        let props = this.props as TableColumnContentProps;
        let children = props.children;
        let content = children;

        let isContentElement = false;
        if (typeof children === "string" || typeof children === "number") {
            let styles = [];
            if (props.centering) {
                styles.push(Styles.Common.textCenter);
            }
            content = <Text style={styles}>{children}</Text>;
        } else {
            isContentElement = true;
        }

        let styles = [
            Styles.Common.verticalCentering,
            Styles.Tab.tabBar,
            {minHeight: props.height},
        ] as any;
        if (!isContentElement) { // 如果内容是元素，则不需要 flex: 1，否则影响宽度计算
            styles.push(Styles.Common.flexDefault);
        }
        return (
            <View style={styles}>
                {content}
            </View>
        );
    }
}

export const buildColumnDataSimple = function (title?: string | number, content?: string | number | JSXElement): TableColumnData {
    let result = {} as TableColumnData;

    if (title) {
        result.title = title;
    }
    if (content) {
        result.rows = [[content]];
    }

    return result;
};

export const buildColumnDataRow = function (title?: string | number, cells?: Array<string | number | JSXElement>): TableColumnData {
    let result = {} as TableColumnData;

    if (title) {
        result.title = title;
    }
    if (cells) {
        result.rows = [cells];
    }

    return result;
};

export const buildColumnData = function (title?: string | number, rows?: Array<Array<string | number | JSXElement>>): TableColumnData {
    let result = {} as TableColumnData;

    if (title) {
        result.title = title;
    }
    if (rows) {
        result.rows = rows;
    }

    return result;
};

export interface TableColumnData {
    title?: string | number;
    rows?: Array<Array<string | number | JSXElement>>;
}

export interface TableRowProps extends TableBaseProps {
    data: Array<TableColumnData>;
}

export class TableRow extends Component<TableRowProps, any> {
    render() {
        let props = this.props as TableRowProps;
        let titleHeight = props.titleHeight ? props.titleHeight : TABLE_TITLE_HEIGHT_DEFAULT;
        let contentHeight = props.contentHeight ? props.contentHeight : TABLE_CONTENT_HEIGHT_DEFAULT;
        let centering = typeof props.centering === "boolean" ? props.centering : true;
        let columnRowsCount = props.columnRowsCount ? props.columnRowsCount : 1;
        let data = props.data;

        let columns = [];
        data.forEach((columnData: TableColumnData, index) => {
            columns.push(
                <TableColumn
                    key={`TableColumn_${props.pageName}_${index}`}
                    pageName={props.pageName}
                    data={columnData}
                    titleHeight={titleHeight}
                    contentHeight={contentHeight}
                    centering={centering}
                    columnRowsCount={columnRowsCount}
                />
            );
        });

        return (
            <View
                style={[
                    Styles.Common.flexRow,
                    Styles.Common.flexDefault,
                    Styles.Common.row,
                ]}
            >
                {columns}
            </View>
        );
    }
}

export interface TableColumnProps extends Props {
    pageName: string;
    data: TableColumnData;
    titleHeight: number;
    contentHeight: number;
    centering: boolean;
    columnRowsCount?: number;
}

export class TableColumn extends Component<TableColumnProps, any> {
    render() {
        let props = this.props as TableColumnProps;
        let titleHeight = props.titleHeight;
        let contentHeight = props.contentHeight;
        let centering = props.centering;
        let columnRowsCount = props.columnRowsCount;
        let data = props.data;
        //noinspection JSUnusedAssignment
        let columnHeight = titleHeight + contentHeight;

        // 根据输入信息，重新计算title的高度和整体行高
        if (data.title && !data.rows) {
            //noinspection JSUnusedAssignment
            columnHeight = titleHeight + contentHeight * columnRowsCount;
        } else if (!data.title && data.rows) {
            //noinspection JSUnusedAssignment
            columnHeight = contentHeight * data.rows.length;
        } else if (data.title && data.rows) {
            //noinspection JSUnusedAssignment
            columnHeight = titleHeight + contentHeight * data.rows.length;
        } else {
            return <View />;
        }

        let columnTitle = (
            <TableColumnTitle height={titleHeight}>
                {data.title}
            </TableColumnTitle>
        );

        let columnRows = (data.rows ? [] : undefined) as any;
        /**
         * singleElementMode：
         * 当前Column只内嵌一行，且内嵌只有一列，且内容物是一个JSXElement
         * 这种情况直接把内容物套入Column即可，无需多嵌套内部的 TableColumnContentRow 和 TableColumnContent
         * 且 flex: 1 也不需要，否则会影响宽度计算；见下面的 Column style
         */
        let singleElementMode = false;
        if (data.rows && data.rows.length === 1 // Column内嵌一行
            && data.rows[0].length === 1 // 嵌入行内嵌一列
            && typeof data.rows[0][0] !== "string"
            && typeof data.rows[0][0] !== "number"
        ) {
            singleElementMode = true;
            columnRows = data.rows[0][0];
        } else if (data.rows) {
            data.rows.forEach((columnRowData: Array<string | number | JSXElement>, rowIndex) => {
                let columnRowCells = [];
                columnRowData.forEach((cell: string | number | JSXElement, cellIndex) => {
                    columnRowCells.push(
                        <TableColumnContent
                            key={`TableColumnContent_${props.pageName}_${cellIndex}`}
                            height={contentHeight}
                            centering={centering}
                        >
                            {cell}
                        </TableColumnContent>
                    );
                });
                columnRows.push(
                    <TableColumnContentRow
                        key={`TableColumnContentRow_${props.pageName}_${rowIndex}`}
                        height={contentHeight}
                    >
                        {columnRowCells}
                    </TableColumnContentRow>
                );
            });
        }

        let styles = [
            Styles.Common.flexColumn,
            {minHeight: columnHeight},
        ] as any;
        if (!singleElementMode) {
            styles.push(Styles.Common.flexDefault);
        }
        return (
            <View style={styles}>
                {columnTitle}
                {columnRows}
            </View>
        );
    }
}

export interface TableProps extends TableBaseProps {
    data: Array<Array<TableColumnData>>;
}

export interface TableBaseProps extends Props {
    pageName: string;
    titleHeight?: number;
    contentHeight?: number;
    centering?: boolean;
    /**
     * 用来控制只有 title 的情况下的总行高，
     * columnRowsCount 指同一行的其他 Column 的 Content 行数，
     * 知道了这个值就可以计算当前的行高
     */
    columnRowsCount?: number;
}

export class Table extends Component<TableProps, any> {
    render() {
        let props = this.props as TableProps;
        let baseProps = Object.assign({}, props);
        delete baseProps.data;

        let rows = [];
        props.data.forEach((rowData: Array<TableColumnData>, index) => {
            rows.push(
                <TableRow
                    key={`TableRow_${props.pageName}_${index}`}
                    pageName={props.pageName}
                    data={rowData}
                    {...baseProps}
                />
            );
        });

        return (
            <View style={[
                    Styles.Common.flexColumn,
                    Styles.Common.flexDefault
                ]}
            >
                {rows}
            </View>
        );
    }
}