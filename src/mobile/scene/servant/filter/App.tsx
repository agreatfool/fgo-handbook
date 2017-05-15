import React, {Component} from "react";
import {View, Text, TouchableOpacity} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import {Props, TabScene, TabPageScroll} from "../../../view/View";
import CheckBox from "react-native-checkbox";
import MstUtil from "../../../lib/utility/MstUtil";
import {SvtListFilter} from "../list/State";
import * as Styles from "../../../view/Styles";
import Const from "../../../lib/const/Const";

export * from "./State";
export * from "./Action";

export class ServantFilter extends Component<State.Props, any> {
    private _service: MstService.Service;

    constructor(props, context) {
        super(props, context);

        this._service = new MstService.Service();
    }

    componentDidMount() {
        let props = this.props as State.Props;
        let state = props.SceneServantList;
    }

    isChecked(id: number, propName: string): boolean {
        let props = this.props as State.Props;
        let state = props.SceneServantList;

        let search = id + "";

        return (state.filter[propName] as Array<string>).indexOf(search) !== -1;
    }

    checkItem(id: number, propName: string): void {
        let props = this.props as State.Props;
        let filter = Object.assign({}, props.SceneServantList.filter) as SvtListFilter;
        let prop = filter[propName] as Array<string>;
        let search = id + "";

        if (prop.indexOf(search) !== -1) {
            prop = MstUtil.removeValueFromArr(prop, search);
        } else {
            prop.push(search);
        }

        filter[propName] = prop;
        props.actions.updateFilter(filter);
    }

    getButtonText(propName: string, dataSet: {[key: number]: string}): string {
        let props = this.props as State.Props;
        let state = props.SceneServantList;
        let stateLength = (state.filter[propName] as Array<string>).length;
        let filterLength = Object.keys(dataSet).length;

        let text = "";
        if (stateLength === 0) {
            text = "全选";
        } else if (stateLength === filterLength) {
            text = "反选";
        } else {
            text = "反选";
        }

        return text;
    }

    touchButton(propName: string, dataSet: {[key: number]: string}): void {
        let props = this.props as State.Props;
        let filter = Object.assign({}, props.SceneServantList.filter) as SvtListFilter;
        let filterSet = filter[propName] as Array<string>;
        let dataIds = Object.keys(dataSet);

        if (filterSet.length === 0) {
            filterSet = dataIds;
        } else if (filterSet.length === dataIds.length) {
            filterSet = [];
        } else {
            dataIds.forEach((id) => {
                if (filterSet.indexOf(id) !== -1) {
                    filterSet = MstUtil.removeValueFromArr(filterSet, id);
                } else {
                    filterSet.push(id);
                }
            });
        }

        filter[propName] = filterSet;
        props.actions.updateFilter(filter);
    }

    renderChecks(propName: string, dataSet: {[key: number]: string}) {
        return Object.keys(dataSet).map((index) => {
            let id = parseInt(index);
            let name = dataSet[index];

            return (
                <CheckBoxWrapper
                    key={`CheckBox_Rarity_${id}`}
                    label={name}
                    checked={this.isChecked(id, propName)}
                    onChange={(checked) => this.checkItem(id, propName)}
                />
            );
        });
    }

    render() {
        return (
            <TabScene>
                <TabPageScroll>
                    <CheckListTitle>星级</CheckListTitle>
                    <CheckListBox>
                        {this.renderChecks("rarity", Const.SERVANT_RARITY_NAMES)}
                    </CheckListBox>
                    <CheckListBox>
                        <CheckBoxButton
                            onPress={() => this.touchButton.bind(this)("rarity", Const.SERVANT_RARITY_NAMES)}>
                            {this.getButtonText("rarity", Const.SERVANT_RARITY_NAMES)}
                        </CheckBoxButton>
                    </CheckListBox>
                    <CheckListTitle>职阶</CheckListTitle>
                    <CheckListBox>
                        {this.renderChecks("classId", Const.SERVANT_CLASS_NAMES)}
                    </CheckListBox>
                    <CheckListBox>
                        <CheckBoxButton
                            onPress={() => this.touchButton.bind(this)("classId", Const.SERVANT_CLASS_NAMES)}>
                            {this.getButtonText("classId", Const.SERVANT_CLASS_NAMES)}
                        </CheckBoxButton>
                    </CheckListBox>
                    <CheckListTitle>性别</CheckListTitle>
                    <CheckListBox>
                        {this.renderChecks("genderType", Const.SERVANT_GENDER_TYPES)}
                    </CheckListBox>
                    <CheckListBox>
                        <CheckBoxButton
                            onPress={() => this.touchButton.bind(this)("genderType", Const.SERVANT_GENDER_TYPES)}>
                            {this.getButtonText("genderType", Const.SERVANT_GENDER_TYPES)}
                        </CheckBoxButton>
                    </CheckListBox>
                </TabPageScroll>
            </TabScene>
        );
    }
}

class CheckListTitle extends Component<Props, any> {
    render() {
        let props = this.props as Props;
        return (
            <View style={Styles.Common.checkListTitle}>
                <Text>{props.children}</Text>
            </View>
        );
    }
}

class CheckListBox extends Component<Props, any> {
    render() {
        let props = this.props as Props;
        return (
            <View style={Styles.Common.checkList}>
                {props.children}
            </View>
        );
    }
}

interface CheckBoxWrapperProps extends Props {
    label?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}

class CheckBoxWrapper extends Component<CheckBoxWrapperProps, any> {
    render() {
        return (
            <View style={Styles.Common.checkBoxWrapper}>
                <CheckBox
                    containerStyle={Styles.Common.checkBoxContainer}
                    labelStyle={Styles.Common.checkBoxLabel}
                    checkboxStyle={Styles.Common.checkBoxSelf}
                    {...this.props}
                />
            </View>
        );
    }
}

interface CheckBoxButtonProps extends Props {
    onPress: () => void;
}

class CheckBoxButton extends Component<CheckBoxButtonProps, any> {
    render() {
        let props = this.props as CheckBoxButtonProps;
        return (
            <TouchableOpacity style={Styles.Common.checkBoxButton} onPress={props.onPress}>
                <Text style={Styles.Common.checkBoxButtonText}>{props.children}</Text>
            </TouchableOpacity>
        );
    }
}

export const App = injectIntoComponent(ServantFilter, State.StateName, Action.Actions);