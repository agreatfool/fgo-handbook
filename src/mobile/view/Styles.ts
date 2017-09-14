import {FlexAlignType, StyleSheet} from "react-native";

export const Common = StyleSheet.create({
    Row: {
        marginBottom: 10,
    },
    TextCentering: {
        textAlign: "center" as any,
    },
    Centering: {
        alignItems: "center" as FlexAlignType,
        justifyContent: "center",
    },
    HorizontalCentering: {
        alignItems: "center" as FlexAlignType,
    },
    VerticalCentering: {
        justifyContent: "center",
    },
    Star: {
        color: "#FFD500",
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1,
        textShadowColor: "#000000",
    },
    Card: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 2,
        marginRight: 2,
        flex: 1,
        borderLeftWidth: 0.333,
        borderRightWidth: 0.333,
        borderTopWidth: 0.333,
        borderBottomWidth: 0.333,
        borderColor: "#CCCCCC",
        flexWrap: "wrap",
        backgroundColor: "#FFFFFF",
        shadowColor: "#000000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        elevation: 3,
    },
    ThumbBig: {
        width: 56,
        height: 56,
    },
    ThumbIcon: {
        width: 36,
        height: 36,
    }
});

export const Box = StyleSheet.create({
    Wrapper: {
        padding: 10,
    }
});