import React, {Component} from "react";
import {View, Text, TouchableOpacity} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import {Props, TabScene, TabPageScroll} from "../main/View";
import CheckBox from "react-native-checkbox";
import MstUtil from "../../../lib/model/MstUtil";
import {SvtListFilter} from "../main/State";
import * as Styles from "../../../style/Styles"
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

    isRarityChecked(rarityId: number): boolean {
        let props = this.props as State.Props;
        let state = props.SceneServantList;

        let search = rarityId + "";

        return state.filter.rarity.indexOf(search) !== -1;
    }

    checkRarity(rarityId: number): void {
        let props = this.props as State.Props;
        let filter = Object.assign({}, props.SceneServantList.filter) as SvtListFilter;
        let search = rarityId + "";

        if (filter.rarity.indexOf(search) !== -1) {
            filter.rarity = MstUtil.removeValueFromArr(filter.rarity, search);
        } else {
            filter.rarity.push(search);
        }

        props.actions.updateFilter(filter);
    }

    getRarityButtonText(): string {
        let props = this.props as State.Props;
        let state = props.SceneServantList;
        let stateLength = state.filter.rarity.length;
        let rarityLength = Object.keys(Const.SERVANT_RARITY_NAMES).length;

        let text = "";
        if (stateLength === 0) {
            text = "全选";
        } else if (stateLength === rarityLength) {
            text = "反选";
        } else {
            text = "反选";
        }

        return text;
    }

    touchRarityButton(): void {
        let props = this.props as State.Props;
        let filter = Object.assign({}, props.SceneServantList.filter) as SvtListFilter;
        let rarity = filter.rarity as Array<string>;
        let rarityIds = Object.keys(Const.SERVANT_RARITY_NAMES);

        if (rarity.length === 0) {
            rarity = rarityIds;
        } else if (rarity.length === rarityIds.length) {
            rarity = [];
        } else {
            rarityIds.forEach((rarityId) => {
                if (rarity.indexOf(rarityId) !== -1) {
                    rarity = MstUtil.removeValueFromArr(rarity, rarityId);
                } else {
                    rarity.push(rarityId);
                }
            });
        }

        filter.rarity = rarity;
        props.actions.updateFilter(filter);
    }

    renderRarityChecks() {
        return Object.keys(Const.SERVANT_RARITY_NAMES).map((index) => {
            let rarityId = parseInt(index);
            let rarityName = Const.SERVANT_RARITY_NAMES[index];

            return (
                <CheckBoxWrapper
                    key={`CheckBox_Rarity_${rarityId}`}
                    label={rarityName}
                    checked={this.isRarityChecked(rarityId)}
                    onChange={(checked) => this.checkRarity(rarityId)}
                />
            );
        });
    }

    render() {
        return (
            <TabScene>
                <TabPageScroll>
                    <CheckListTitle>Rarity</CheckListTitle>
                    <CheckListBox>
                        {this.renderRarityChecks()}
                    </CheckListBox>
                    <CheckListBox>
                        <CheckBoxButton onPress={this.touchRarityButton.bind(this)}>
                            {this.getRarityButtonText()}
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

class CheckBoxWrapper extends Component<Props, any> {
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