import React, {Component} from "react";
import {Router, Scene} from "react-native-router-flux";
import thunk from "redux-thunk";
import {createStore, applyMiddleware, combineReducers} from "redux";
import {Provider} from "react-redux";

import Reducers from "../app/Reducers";
import {App as PageOneApp} from "../scene/page_one/App";
import {App as PageTwoApp} from "../scene/page_two/App";

const store = createStore(
    combineReducers(Reducers),
    applyMiddleware(thunk)
);

export class App extends Component<any, any> {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Scene key="root">
                        <Scene key="pageOne" component={PageOneApp} title="PageOne" initial={true}/>
                        <Scene key="pageTwo" component={PageTwoApp} title="PageTwo"/>
                    </Scene>
                </Router>
            </Provider>
        );
    }
}