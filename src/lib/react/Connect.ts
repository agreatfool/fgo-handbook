import {bindActionCreators} from "redux";
import {connect, ComponentDecorator} from "react-redux";

/**
 * @param Application Application extends Component<any, any>
 * @param StateName
 * @param Actions Object of ActionCreator, e.g { ACTUpdateText }
 * @returns ComponentDecorator
 */
export default function injectIntoComponent(Application: any,
                                            StateName?: string,
                                            Actions?: any) {
    //noinspection TypeScriptValidateTypes
    return connect(
        // bind state
        (state) => {
            if (StateName) {
                return {[StateName]: state[StateName]};
            } else {
                return {};
            }
        },
        // bind dispatch action
        (dispatch) => {
            if (Actions) {
                return {
                    actions: bindActionCreators(Actions, dispatch),
                    dispatch
                };
            } else {
                return {dispatch};
            }
        }
    )(Application);
};