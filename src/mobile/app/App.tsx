import React, {Component} from "react";
import {Router, Scene} from "react-native-router-flux";
import thunk from "redux-thunk";
import {createStore, applyMiddleware, combineReducers} from "redux";
import {Provider} from "react-redux";
import {Text} from "react-native";
import * as Styles from "../style/Styles";
import Reducers from "../app/Reducers";
import {App as Initialization} from "../scene/init/App";
import {App as Servant} from "../scene/servant/main/App";
import {App as ServantDetail} from "../scene/servant/detail/App";
import {App as ServantSkill} from "../scene/servant/skill/App";
import {App as ServantStory} from "../scene/servant/story/App";
import {App as ServantMaterial} from "../scene/servant/material/App";
import {App as ServantFilter} from "../scene/servant/filter/App";
import {App as Material} from "../scene/material/main/App";
import {App as Options} from "../scene/options/main/App";

const store = createStore(
    combineReducers(Reducers),
    applyMiddleware(thunk)
);

export class App extends Component<any, any> {
    render() {
        return (
            <Provider store={store}>
                <Router navigationBarStyle={Styles.NavTop.navBar}>
                    <Scene key="root">
                        <Scene key="tabs" tabs={true} tabBarStyle={Styles.Tab.tabBar}>
                            <Scene key="servant" component={Servant} title="Servant" icon={TabButton}
                                   hideNavBar={false} renderBackButton={() => undefined} sceneStyle={Styles.Tab.sceneContainer} />
                            <Scene key="material" component={Material} title="Material" icon={TabButton}
                                   hideNavBar={false} renderBackButton={() => undefined} sceneStyle={Styles.Tab.sceneContainer} />
                            <Scene key="options" component={Options} title="Options" icon={TabButton}
                                   hideNavBar={false} renderBackButton={() => undefined} sceneStyle={Styles.Tab.sceneContainer} />
                        </Scene>
                        <Scene key="servant_info" tabs={true} tabBarStyle={Styles.Tab.tabBar}>
                            <Scene key="servant_detail" component={ServantDetail} title="Detail" icon={TabButton}
                                   hideNavBar={false} sceneStyle={Styles.Tab.sceneContainer} />
                            <Scene key="servant_skill" component={ServantSkill} title="Skill" icon={TabButton}
                                   hideNavBar={false} sceneStyle={Styles.Tab.sceneContainer} />
                            <Scene key="servant_story" component={ServantStory} title="Story" icon={TabButton}
                                   hideNavBar={false} sceneStyle={Styles.Tab.sceneContainer} />
                            <Scene key="servant_material" component={ServantMaterial} title="Material" icon={TabButton}
                                   hideNavBar={false} sceneStyle={Styles.Tab.sceneContainer} />
                        </Scene>
                        <Scene key="init" component={Initialization} title="Initialization" initial={true} hideNavBar={true}/>
                        <Scene key="servant_filter" component={ServantFilter} title="ServantFilter" hideNavBar={false} sceneStyle={Styles.Tab.sceneContainer}/>
                    </Scene>
                </Router>
            </Provider>
        );
    }
}

class TabButton extends Component<any, any> {
    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <Text style={this.props.selected ? Styles.Tab.stateSelected : Styles.Tab.stateNormal}>{this.props.title}</Text>
        );
    }
}