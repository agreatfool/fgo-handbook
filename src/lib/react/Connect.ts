import {bindActionCreators} from "redux";
import {connect, ComponentDecorator} from "react-redux";

/**
 * @param StateName
 * @param Actions Object of ActionCreator, e.g { ACTUpdateText }
 * @param Application Application extends Component<any, any>
 * @returns ComponentDecorator
 */
export default function injectIntoComponent(StateName: string,
                                            Actions: any,
                                            Application: any) {
    //noinspection TypeScriptValidateTypes
    return connect(
        // bind state
        (state) => ({
            [StateName]: state[StateName]
        }),
        // bind dispatch action
        (dispatch) => ({
            actions: bindActionCreators(Actions, dispatch)
        })
    )(Application);
};