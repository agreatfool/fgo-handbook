import {FlexAlignType, FlexJustifyType, StyleSheet} from "react-native";

export const Common = StyleSheet.create({
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