import React, {Component} from "react";
import {View, ListView, Image, TouchableOpacity, ListViewDataSource} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as MstService from "../../../service/MstService";
import {MstSvt} from "../../../../model/master/Master";
import {MstSvtContainer} from "../../../../model/impl/MstContainer";
import MstLoader from "../../../lib/model/MstLoader";
import * as State from "./State";
import * as Action from "./Action";
import MstUtil from "../../../lib/model/MstUtil";
import BaseContainer from "../../../../lib/container/base/BaseContainer";
import Const from "../../../lib/const/Const";
import {Actions} from "react-native-router-flux";
import * as Styles from "../../../style/Styles";
import {TabScene, ToolBoxWrapper, ResImage} from "./View";

export * from "./State";
export * from "./Action";

export class ServantList extends Component<State.Props, any> {
    private _appVer: string;
    private _service: MstService.Service;
    private _dataSource: ListViewDataSource;

    private _svtContainer: MstSvtContainer;

    constructor(props, context) {
        super(props, context);

        this._service = new MstService.Service();
        this._dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    componentDidMount() {
        let props = this.props as State.Props;
        MstUtil.instance.getAppVer().then((appVer) => {
            this._appVer = appVer;
            return MstLoader.instance.loadModel("MstSvt");
        }).then((container: BaseContainer<MstSvt>) => {
            this._svtContainer = container as MstSvtContainer;
            let rawData = this._service.sortSvtDataWithNoDesc(
                this._service.filterSvtRawData(this._svtContainer.getRaw())
            );
            let dividedData = this._service.divideRawSvtIntoRows(rawData);

            props.actions.updateRawData(rawData);
            props.actions.updateDisplayData(dividedData);
        });
    }

    // FIXME 需要按最新的View内的渲染方式进行重构，在做过滤器的时候重构即可
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
                <ToolBoxWrapper buttons={[
                    {content: "过滤器"}
                ]}/>
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