import {StyleSheet, FlexDirection, FlexAlignType, ViewStyle, TextStyle} from "react-native";

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
        marginBottom: 5,
    },
    textCenter: {
        textAlign: "center",
    },
    centering: {
        alignItems: "center" as FlexAlignType,
        justifyContent: "center" as FlexAlignType,
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
    pageContainer: {
        marginTop: 64,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
    },
    stateNormal: {
        color: "black",
    },
    stateSelected: {
        color: "red",
    }
});

export const ToolBoxTop = StyleSheet.create({
    container: {
        height: 20
    },
    button: {
        flex: 1,
        marginRight: 5,
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