import React, {Component} from "react";
import {Router, Scene} from "react-native-router-flux";
import thunk from "redux-thunk";
import {createStore, applyMiddleware, combineReducers} from "redux";
import {Provider} from "react-redux";

import {name, Reducers} from "./mobile/component/text_input/app";
import PageOne from "./mobile/scene/page_one/app";
import PageTwo from "./mobile/scene/page_two/app";

const store = createStore(
    combineReducers({
        [name]: Reducers
    }),
    applyMiddleware(thunk)
);

export default class App extends Component<any, any> {
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