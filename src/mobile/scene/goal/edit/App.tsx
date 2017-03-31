import React, {Component} from "react";
import {View, Text} from "react-native";
import {Actions} from "react-native-router-flux";
import {ToolBoxWrapper, TabScene, TabPageScroll, Table} from "../../../view/View";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import MstUtil from "../../../lib/utility/MstUtil";
import * as Styles from "../../../view/Styles";

export * from "./State";
export * from "./Action";

interface GoalEditProps extends State.Props {
    mode: string;
    goalId: string;
    isCurrent: boolean;
}

class GoalEdit extends Component<GoalEditProps, any> {
    render() {
        //noinspection TypeScriptUnresolvedVariable,TypeScriptUnresolvedFunction
        return (
            <TabScene>
                <ToolBoxWrapper
                    pageName="GoalEdit"
                    buttons={[
                        {content: "保存改动"},
                    ]}
                />
                <TabPageScroll>
                    <Text>GoalEdit</Text>
                    <Text>{JSON.stringify(this.props, null, 4)}</Text>
                </TabPageScroll>
            </TabScene>
        );
    }
}

export const App = injectIntoComponent(GoalEdit, State.StateName, Action.Actions);