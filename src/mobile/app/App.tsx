import React, {Component} from "react";
import thunk from "redux-thunk";
import {applyMiddleware, combineReducers, createStore} from "redux";
import {StackNavigator} from "react-navigation";
import {Provider} from "react-redux";
import {Root} from "native-base";
import Reducers from "../app/Reducers";
import {App as ServantList} from "../scene/servant/list/App";
import {App as ServantDetail} from "../scene/servant/detail/App";
import {App as ServantSkill} from "../scene/servant/skill/App";
import {App as ServantStory} from "../scene/servant/story/App";
import {App as ServantMaterial} from "../scene/servant/material/App";
import {App as ServantFilter} from "../scene/servant/filter/App";
import {App as GoalList} from "../scene/goal/list/App";
import {App as GoalEdit} from "../scene/goal/edit/App";
import {App as GoalServantPicker} from "../scene/goal/servant_picker/App";
import {App as GoalCompare} from "../scene/goal/compare/App";
import {App as GoalCompareServant} from "../scene/goal/compare_servant/App";
import {App as GoalCompareItem} from "../scene/goal/compare_item/App";
import {App as GoalExp} from "../scene/goal/exp/App";
import {App as GoalItemPicker} from "../scene/goal/item_picker/App";
import {App as GoalItemRequirement} from "../scene/goal/item_requirement/App";
import {App as Options} from "../scene/options/main/App";

(console as any).ignoredYellowBox = ["Remote debugger", "Task orphaned for request"];

const AppNavigator = StackNavigator({
    ServantList: {screen: ServantList},
    ServantDetail: {screen: ServantDetail},
    ServantSkill: {screen: ServantSkill},
    ServantStory: {screen: ServantStory},
    ServantMaterial: {screen: ServantMaterial},
    ServantFilter: {screen: ServantFilter},
    GoalList: {screen: GoalList},
    GoalEdit: {screen: GoalEdit},
    GoalServantPicker: {screen: GoalServantPicker},
    GoalCompare: {screen: GoalCompare},
    GoalCompareServant: {screen: GoalCompareServant},
    GoalCompareItem: {screen: GoalCompareItem},
    GoalExp: {screen: GoalExp},
    GoalItemPicker: {screen: GoalItemPicker},
    GoalItemRequirement: {screen: GoalItemRequirement},
    Options: {screen: Options},
}, {
    initialRouteName: "ServantList",
    headerMode: "none"
});

const store = createStore(
    combineReducers(Reducers),
    applyMiddleware(thunk)
);

export class App extends Component<any, any> {
    render() {
        return (
            <Root>
                <Provider store={store}>
                    <AppNavigator/>
                </Provider>
            </Root>
        );
    }
}