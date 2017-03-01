import React, {Component} from "react";
import {Router, Scene} from "react-native-router-flux";
import thunk from "redux-thunk";
import {createStore, applyMiddleware, combineReducers} from "redux";
import {Provider} from "react-redux";
import {Text, StyleSheet} from "react-native";
import Reducers from "../app/Reducers";
import {App as Initialization} from "../scene/init/App";
import {App as Servant} from "../scene/servant/main/App";
import {App as ServantDetail} from "../scene/servant/detail/App";
import {App as ServantSkill} from "../scene/servant/skill/App";
import {App as ServantStory} from "../scene/servant/story/App";
import {App as ServantMaterial} from "../scene/servant/material/App";
import {App as Material} from "../scene/material/main/App";
import {App as Options} from "../scene/options/main/App";

const store = createStore(
    combineReducers(Reducers),
    applyMiddleware(thunk)
);

const styles = StyleSheet.create({
    navigation: {
        height: 64,
    },
    container: {
        marginTop: 64,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
    },
    tabBar: {
        borderWidth: 1,
        borderStyle: "dotted" as any,
        borderColor: "#000000",
    },
    tabSelected: {
        color: "red",
    },
    tab: {
        color: "black",
    }
});

export class App extends Component<any, any> {
    render() {
        return (
            <Provider store={store}>
                <Router navigationBarStyle={styles.navigation}>
                    <Scene key="root">
                        <Scene key="tabs" tabs={true} tabBarStyle={styles.tabBar}>
                            <Scene key="servant" component={Servant} title="Servant" icon={TabButton}
                                   hideNavBar={false} renderBackButton={() => undefined} sceneStyle={styles.container} />
                            <Scene key="material" component={Material} title="Material" icon={TabButton}
                                   hideNavBar={false} renderBackButton={() => undefined} sceneStyle={styles.container} />
                            <Scene key="options" component={Options} title="Options" icon={TabButton}
                                   hideNavBar={false} renderBackButton={() => undefined} sceneStyle={styles.container} />
                        </Scene>
                        <Scene key="servant_info" tabs={true} tabBarStyle={styles.tabBar}>
                            <Scene key="servant_detail" component={ServantDetail} title="Detail" icon={TabButton}
                                   hideNavBar={false} sceneStyle={styles.container} />
                            <Scene key="servant_skill" component={ServantSkill} title="Skill" icon={TabButton}
                                   hideNavBar={false} sceneStyle={styles.container} />
                            <Scene key="servant_story" component={ServantStory} title="Story" icon={TabButton}
                                   hideNavBar={false} sceneStyle={styles.container} />
                            <Scene key="servant_material" component={ServantMaterial} title="Material" icon={TabButton}
                                   hideNavBar={false} sceneStyle={styles.container} />
                        </Scene>
                        <Scene key="init" component={Initialization} title="Initialization" initial={true} hideNavBar={true}/>
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
            <Text style={this.props.selected ? styles.tabSelected : styles.tab}>{this.props.title}</Text>
        );
    }
}