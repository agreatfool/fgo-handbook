import {NavigationScreenProp} from "react-navigation";

interface InjectedProps {
    dispatch: Function;
    actions: any;
    navigation: NavigationScreenProp<any, any>;
}

export default InjectedProps;