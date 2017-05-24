import React, {Component} from "react";
import {Router, Scene} from "react-native-router-flux";
import thunk from "redux-thunk";
import {createStore, applyMiddleware, combineReducers} from "redux";
import {Provider} from "react-redux";
import Reducers from "../app/Reducers";
import {App as Initialization} from "../scene/init/App";
import {App as ServantList} from "../scene/servant/list/App";
import {App as ServantDetail} from "../scene/servant/detail/App";
import {App as ServantSkill} from "../scene/servant/skill/App";
import {App as ServantStory} from "../scene/servant/story/App";
import {App as ServantMaterial} from "../scene/servant/material/App";
import {App as ServantFilter} from "../scene/servant/filter/App";
import {App as GoalList} from "../scene/goal/list/App";
import {App as GoalEdit} from "../scene/goal/edit/App";
import {App as GoalCompare} from "../scene/goal/compare/App";
import {App as GoalCompareServant} from "../scene/goal/compare_servant/App";
import {App as GoalCompareItem} from "../scene/goal/compare_item/App";
import {App as GoalExp} from "../scene/goal/exp/App";
import {App as Options} from "../scene/options/main/App";

const store = createStore(
    combineReducers(Reducers),
    applyMiddleware(thunk)
);

export class App extends Component<any, any> {
    render() {
        return (
            <Provider store={store}>
                <Router hideNavBar={true}>
                    <Scene key="root">
                        <Scene key="init" component={Initialization} title="Initialization" initial={true} />
                        <Scene key="servant_list" component={ServantList} title="ServantList" />
                        <Scene key="servant_detail" component={ServantDetail} title="Detail" />
                        <Scene key="servant_skill" component={ServantSkill} title="Skill" />
                        <Scene key="servant_story" component={ServantStory} title="Story" />
                        <Scene key="servant_material" component={ServantMaterial} title="Material" />
                        <Scene key="servant_filter" component={ServantFilter} title="ServantFilter" />
                        <Scene key="goal_list" component={GoalList} title="GoalList" />
                        <Scene key="goal_edit" component={GoalEdit} title="GoalEdit" />
                        <Scene key="goal_compare" component={GoalCompare} title="GoalCompare" />
                        <Scene key="goal_compare_svt" component={GoalCompareServant} title="GoalCompareServant" />
                        <Scene key="goal_compare_item" component={GoalCompareItem} title="GoalCompareItem" />
                        <Scene key="goal_exp" component={GoalExp} title="GoalExp" />
                        <Scene key="options" component={Options} title="Options" />
                    </Scene>
                </Router>
            </Provider>
        );
    }
}