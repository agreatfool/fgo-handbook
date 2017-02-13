import React, {Component} from "react";
import {Router, Scene} from "react-native-router-flux";
import thunk from "redux-thunk";
import {createStore, applyMiddleware, combineReducers} from "redux";
import {Provider} from "react-redux";

import Reducers from "../app/Reducers";
import PageOne from "../scene/page_one/App";
import PageTwo from "../scene/page_two/App";

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
                        <Scene key="pageOne" component={PageOne} title="PageOne" initial={true}/>
                        <Scene key="pageTwo" component={PageTwo} title="PageTwo"/>
                    </Scene>
                </Router>
            </Provider>
        );
    }
}