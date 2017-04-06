import {StyleSheet, FlexDirection, FlexAlignType, FlexJustifyType, ImageResizeMode, ViewStyle, TextStyle} from "react-native";

export const Common = StyleSheet.create({
    flexRow: {
        flexDirection: "row" as FlexDirection
    },
    flexRowReverse: {
        flexDirection: "row-reverse" as FlexDirection
    },
    flexColumn: {
        flexDirection: "column" as FlexDirection
    },
    flexDefault: {
        flex: 1,
    },
    row: {
        marginBottom: 15,
    },
    textCenter: {
        textAlign: "center" as any,
    },
    centering: {
        alignItems: "center" as FlexAlignType,
        justifyContent: "center" as FlexJustifyType,
    },
    horizontalCentering: {
        alignItems: "center" as FlexAlignType,
    },
    verticalCentering: {
        justifyContent: "center" as FlexJustifyType,
    },
    resImgSmall: {
        width: 50,
        height: 50,
        resizeMode: "contain" as ImageResizeMode
    },
    resImgBig: {
        width: 70,
        height: 70,
        resizeMode: "contain" as ImageResizeMode
    },
    resImgBoxWithText: {
        width: 80,
    },
    resImgBoxInlineText: {
        width: 30,
    },
    checkListTitle: {
        marginTop: 15,
        marginBottom: 5,
    },
    checkList: {
        padding: 5,
        paddingTop: 10,
        borderWidth: 1,
        borderStyle: "solid" as any,
        borderColor: "black",
        flexDirection: "row" as FlexDirection,
        flexWrap: "wrap" as any,
    },
    checkBoxWrapper: {
        flexGrow: 1,
        flexDirection: "row" as FlexDirection,
        height: 20,
    },
    checkBoxContainer: {
        flex: 1,
        height: 15,
    },
    checkBoxLabel: {
        fontSize: 12,
        color: "black"
    },
    checkBoxSelf: {
        width: 15,
        height: 15
    },
    checkBoxButton: {
        flex: 1,
        width: 100,
        height: 20,
        marginBottom: 5,
        alignItems: "center" as FlexJustifyType,
    } as ViewStyle,
    checkBoxButtonText: {
        width: 100,
        height: 20,
        lineHeight: 20,
        fontSize: 12,
        textAlign: "center" as any,
        backgroundColor: "yellow",
    },
    dropdownList: {
        width: 392,
        height: 200
    },
    dropdownListItem: {
        fontSize: 12,
        height: 200
    }
});

export const NavTop = StyleSheet.create({
    navBar: {
        height: 64
    },
});

export const Tab = StyleSheet.create({
    tabBar: {
        borderWidth: 1,
        borderStyle: "dotted" as any,
        borderColor: "#000000",
    },
    stateNormal: {
        color: "black",
    },
    stateSelected: {
        color: "red",
    },
    sceneContainer: {
        marginTop: 64,
        padding: 5,
    },
    pageContainer: {
        height: 612
    },
    pageDisplayArea: {
        height: 582,
        padding: 5
    }
});

export const ToolBoxTop = StyleSheet.create({
    container: {
        flexDirection: "row-reverse" as FlexDirection,
        height: 30
    },
    button: {
        width: 100,
        margin: 5,
        height: 20,
        alignItems: "flex-end" as FlexAlignType,
    } as ViewStyle,
    text: {
        width: 100,
        height: 20,
        lineHeight: 20,
        fontSize: 12,
        textAlign: "center",
        backgroundColor: "yellow",
    } as TextStyle
});

export const Landing = StyleSheet.create({
    footer: {
        position: "absolute" as any,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 8
    }
});

export const ServantList = StyleSheet.create({
    row: {
        flexDirection: "row" as FlexDirection,
        marginTop: 5,
        marginBottom: 5
    },
    cellBase: {
        flex: 1,
        width: 70,
        height: 70,
        marginLeft: 5,
        marginRight: 5,
    },
    cell: {
        borderWidth: 1,
        borderStyle: "solid" as any,
        borderColor: "black",
    },
    cellPlaceholder: {
        marginLeft: 6,
        marginRight: 6,
    },
});

export const ServantStory = StyleSheet.create({
    fixedText: {
        padding: 5,
        width: 310,
    }
});