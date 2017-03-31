import React, {Component} from "react";
import {View, Text} from "react-native";
import {Actions} from "react-native-router-flux";
import {ToolBoxWrapper, TabScene, TabPageScroll, Table} from "../../../view/View";

import injectIntoComponent from "../../../../lib/react/Connect";

class GoalCompare extends Component<any, any> {
    render() {
        //noinspection TypeScriptUnresolvedVariable,TypeScriptUnresolvedFunction
        return (
            <TabScene>
                <ToolBoxWrapper
                    pageName="GoalList"
                    buttons={[
                        {content: "TOOL"},
                    ]}
                />
                <TabPageScroll>
                    <Text>GoalCompare</Text>
                    <Text>{JSON.stringify(this.props, null, 4)}</Text>
                </TabPageScroll>
            </TabScene>
        );
    }
}

export const App = injectIntoComponent(GoalCompare);