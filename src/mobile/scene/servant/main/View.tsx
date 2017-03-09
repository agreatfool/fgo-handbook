import React, {Component, ReactNode} from "react";
import {View, TouchableOpacity, Text, ScrollView} from "react-native";
import MstUtil from "../../../lib/model/MstUtil";
import {CacheImage} from "../../../component/cache_image/App";
import * as Styles from "../../../style/Styles";
import JSXElement = JSX.JSXElement;

interface Props {
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
    buttons: Array<ToolBoxButtonData>;
}

export class ToolBoxWrapper extends Component<ToolBoxWrapperProps, any> {
    render() {
        let buttons = (this.props as ToolBoxWrapperProps).buttons;
        let buttonElements = [];
        buttons.forEach((button: ToolBoxButtonData) => {
            if (typeof button.content === "string" || typeof button.content === "number") {
                buttonElements.push(
                    <ToolBoxButtonText
                        key={MstUtil.randomString(4)}
                        onPress={button.onPress}>
                        {button.content}
                    </ToolBoxButtonText>
                );
            } else {
                buttonElements.push(
                    <ToolBoxButton
                        key={MstUtil.randomString(4)}
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

        return <CacheImage style={Styles.Common.resImg} url={url}/>;
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

export class TabPage extends Component<Props, any> {
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
                    {height: props.height},
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

        if (typeof children === "string" || typeof children === "number") {
            let styles = [];
            if (props.centering) {
                styles.push(Styles.Common.textCenter);
            }
            content = <Text style={styles}>{children}</Text>;
        }

        return (
            <View
                style={[
                    Styles.Common.flexDefault,
                    Styles.Common.verticalCentering,
                    Styles.Tab.tabBar,
                    {height: props.height},
                ]}
            >
                {content}
            </View>
        );
    }
}

export const buildColumnStructSimple = function (title?: string | number, content?: string | number | JSXElement): TableColumnData {
    let result = {} as TableColumnData;

    if (title) {
        result.title = title;
    }
    if (content) {
        result.rows = [[content]];
    }

    return result;
};

export const buildColumnStructRow = function (title?: string | number, cells?: Array<string | number | JSXElement>): TableColumnData {
    let result = {} as TableColumnData;

    if (title) {
        result.title = title;
    }
    if (cells) {
        result.rows = [cells];
    }

    return result;
};

export const buildColumnStruct = function (title?: string | number, rows?: Array<Array<string | number | JSXElement>>): TableColumnData {
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
        let centering = props.centering ? props.centering : true;
        let columnRowsCount = props.columnRowsCount ? props.columnRowsCount : undefined;
        let data = props.data;

        let columns = [];
        data.forEach((columnData: TableColumnData) => {
            columns.push(
                <TableColumn
                    key={MstUtil.randomString(4)}
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
                key={MstUtil.randomString(4)}
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
        let data = props.data;
        //noinspection JSUnusedAssignment
        let columnHeight = titleHeight + contentHeight;

        // 根据输入信息，重新计算title的高度和整体行高
        let columnRowsCount = 0;
        if (data.rows) {
            columnRowsCount = data.rows.length;
        } else if (props.columnRowsCount) {
            columnRowsCount = props.columnRowsCount;
        }
        columnHeight = titleHeight + contentHeight * columnRowsCount;
        if (!data.rows) {
            titleHeight = columnHeight;
        }

        let columnTitle = (
            <TableColumnTitle height={titleHeight}>
                {data.title}
            </TableColumnTitle>
        );

        let columnRows = data.rows ? [] : undefined;
        if (data.rows) {
            data.rows.forEach((columnRowData: Array<string | number | JSXElement>) => {
                let columnRowCells = [];
                columnRowData.forEach((cell: string | number | JSXElement) => {
                    columnRowCells.push(
                        <TableColumnContent
                            key={MstUtil.randomString(4)}
                            height={contentHeight}
                            centering={centering}
                        >
                            {cell}
                        </TableColumnContent>
                    );
                });
                columnRows.push(
                    <TableColumnContentRow
                        key={MstUtil.randomString(4)}
                        height={contentHeight}
                    >
                        {columnRowCells}
                    </TableColumnContentRow>
                );
            });
        }

        return (
            <View
                style={[
                Styles.Common.flexColumn,
                Styles.Common.flexDefault,
                {minHeight: columnHeight},
            ]}
            >
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
        props.data.forEach((rowData: Array<TableColumnData>) => {
            rows.push(
                <TableRow
                    key={MstUtil.randomString(4)}
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