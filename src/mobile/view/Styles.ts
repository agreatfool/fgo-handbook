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
    Row: {
        marginBottom: 10,
    },
    TextCentering: {
        textAlign: "center" as any,
    },
    Centering: {
        alignItems: "center" as FlexAlignType,
        justifyContent: "center" as FlexJustifyType,
    },
    HorizontalCentering: {
        alignItems: "center" as FlexAlignType,
    },
    VerticalCentering: {
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
    },
    Star: {
        color: "#FFD500",
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
        textShadowColor: "#000000",
    }
});

export const Box = StyleSheet.create({
    Wrapper: {
        padding: 10,
    }
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

export const ServantStory = StyleSheet.create({
    fixedText: {
        padding: 5,
        width: 310,
    }
});