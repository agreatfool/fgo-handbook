import React, {Component} from "react";
import {View, ListView, Image, TouchableOpacity, ListViewDataSource} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as MstService from "../../../service/MstService";
import {MstSvt} from "../../../../model/master/Master";
import {MstSvtContainer} from "../../../../model/impl/MstContainer";
import MstLoader from "../../../lib/model/MstLoader";
import * as State from "./State";
import * as Action from "./Action";
import MstUtil from "../../../lib/utility/MstUtil";
import BaseContainer from "../../../../lib/container/base/BaseContainer";
import Const from "../../../lib/const/Const";
import {Actions} from "react-native-router-flux";
import * as Styles from "../../../view/Styles";
import {TabScene, ToolBoxWrapper, ResImage} from "../../../view/View";
import {SvtOrderDirections} from "./State";
import {SvtListOrder} from "./State";

export * from "./State";
export * from "./Action";

export class ServantList extends Component<State.Props, any> {
    private _appVer: string;
    private _service: MstService.Service;
    private _dataSource: ListViewDataSource;

    constructor(props, context) {
        super(props, context);

        this._service = new MstService.Service();
        this._dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    componentDidMount() {
        let props = this.props as State.Props;
        let state = props.SceneServantList;

        MstUtil.instance.getAppVer().then((appVer) => {
            this._appVer = appVer;
            return this._service.loadSvtRawData();
        }).then((rawData: Array<MstSvt>) => {
            let displayData = MstService.Service.buildSvtDisplayData(rawData, state.filter, state.order);

            props.actions.updateRawData(rawData);
            props.actions.updateDisplayData(displayData);
        });
    }

    genDirectionStr(direction: number) {
        return direction === State.SvtOrderDirections.DESC ? "降序" : "升序";
    }

    genButtonsData(app: ServantList) {
        let props = app.props as State.Props;
        let state = props.SceneServantList;

        //noinspection TypeScriptUnresolvedFunction
        return [
            {
                content: app.genDirectionStr(state.order.direction),
                onPress: () => app.onOrderDirection(app)
            },
            {
                content: "过滤器",
                onPress: () => (Actions as any).servant_filter()
            }
        ];
    }

    onOrderDirection(app: ServantList) {
        let props = app.props as State.Props;
        let state = props.SceneServantList;
        let actions = props.actions;

        let direction = SvtOrderDirections.DESC;
        if (state.order.direction === SvtOrderDirections.DESC) {
            direction = SvtOrderDirections.ASC;
        }

        actions.updateOrder({
            order: state.order.order,
            direction: direction,
        } as SvtListOrder);
    }

    renderRow(rowData, rowId, app) {
        let placeholder = [];
        let placeholderCount = Const.SERVANT_IN_ROW - rowData.length;
        if (placeholderCount > 0) {
            for (let loop = 0; loop < placeholderCount; loop++) {
                placeholder.push(
                    <ImagePlaceholder key={`ImagePlaceholder_${rowId}_${loop}`}/>
                );
            }
        }

        let rowCells = [];
        rowData.forEach((element) => {
            let svtId = (element as MstSvt).id;
            rowCells.push(
                <ImageCell
                    key={`ImageCell_${svtId}`}
                    appVer={app._appVer}
                    svtId={svtId}/>
            );
        });

        return (
            <View style={Styles.ServantList.row}>
                {rowCells}
                {placeholder}
            </View>
        );
    }

    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <TabScene>
                <ToolBoxWrapper
                    pageName="ServantList"
                    buttons={this.genButtonsData(this)}
                />
                <ListView
                    style={Styles.Tab.pageDisplayArea}
                    dataSource={this._dataSource.cloneWithRows((this.props as State.Props).SceneServantList.displayData)}
                    renderRow={(rowData, sectionId, rowId) => this.renderRow(rowData, rowId, this)}
                    showsVerticalScrollIndicator={false}
                    enableEmptySections={true}
                />
            </TabScene>
        );
    }
}

class ImagePlaceholder extends Component<any, any> {
    render() {
        return (
            <View style={[Styles.ServantList.cellBase, Styles.ServantList.cellPlaceholder]}>
                <Image style={Styles.Common.resImgBig} source={undefined}/>
            </View>
        );
    }
}

interface ImageCellProps {
    appVer: string;
    svtId: number;
}

class ImageCell extends Component<ImageCellProps, any> {
    render() {
        let props = this.props as ImageCellProps;

        //noinspection TypeScriptUnresolvedFunction
        return (
            <TouchableOpacity
                onPress={() => (Actions as any).servant_info({svtId: props.svtId})}>
                <View style={[Styles.ServantList.cell, Styles.ServantList.cellBase]}>
                    <ResImage
                        appVer={props.appVer}
                        type="face"
                        id={props.svtId}/>
                </View>
            </TouchableOpacity>
        );
    }
}

export const App = injectIntoComponent(ServantList, State.StateName, Action.Actions);