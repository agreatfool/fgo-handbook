import React, {Component} from "react";
import {View, Text, ListView, Image, TouchableOpacity, ListViewDataSource} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as MstService from "../../../service/MstService";
import {MstSvt} from "../../../../model/master/Master";
import {MstSvtContainer} from "../../../../model/impl/MstContainer";
import MstLoader from "../../../lib/model/MstLoader";
import InjectedProps from "../../../../lib/react/InjectedProps";
import * as State from "./State";
import * as Action from "./Action";
import MstUtil from "../../../lib/model/MstUtil";
import {CacheImage} from "../../../component/cache_image/App";
import BaseContainer from "../../../../lib/container/base/BaseContainer";
import Const from "../../../lib/const/Const";
import {Actions} from "react-native-router-flux";
import * as Styles from "../../../style/Styles";

export * from "./State";
export * from "./Action";

interface Props extends InjectedProps {
    SceneServantList: State.State;
}

export class ServantList extends Component<Props, any> {
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
        MstUtil.instance.getAppVer().then((appVer) => {
            this._appVer = appVer;
            return MstLoader.instance.loadModel("MstSvt");
        }).then((container: BaseContainer<MstSvt>) => {
            this._svtContainer = container as MstSvtContainer;

            (this.props as Props).actions.updateRawData(
                this._service.sortSvtDataWithNoDesc(
                    this._service.filterSvtRawData(this._svtContainer.getRaw())
                )
            );
            (this.props as Props).actions.updateDisplayData(
                this._service.divideRawSvtIntoRows(
                    (this.props as Props).SceneServantList.rawData
                )
            );
        });
    }

    // FIXME 需要按最新的View内的渲染方式进行重构，在做过滤器的时候重构即可
    renderRow(rowData, app) {
        let placeholder = [];
        let placeholderCount = Const.SERVANT_IN_ROW - rowData.length;
        if (placeholderCount > 0) {
            for (let loop = 0; loop < placeholderCount; loop++) {
                placeholder.push(
                    <View style={[Styles.ServantList.cellBase, Styles.ServantList.cellPlaceholder]}
                          key={`placeholder${loop}`}>
                        <Image style={Styles.ServantList.image} source={undefined}/>
                    </View>
                );
            }
        }

        return (
            <View style={Styles.ServantList.row}>
                {rowData.map((element) => {
                    let svtId = (element as MstSvt).id;
                    let svtImageUrl = MstUtil.instance.getRemoteFaceUrl(app._appVer, svtId);
                    //noinspection TypeScriptValidateJSTypes,TypeScriptUnresolvedFunction
                    return (
                        <TouchableOpacity key={svtId} onPress={() => (Actions as any).servant_info({svtId: svtId})}>
                            <View style={[Styles.ServantList.cell, Styles.ServantList.cellBase]}>
                                <CacheImage style={Styles.ServantList.image} url={svtImageUrl}/>
                            </View>
                        </TouchableOpacity>
                    );
                })}
                {placeholder}
            </View>
        );
    }

    // FIXME 添加过滤器功能，界面、Actions、Reducer都需要调整
    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View style={Styles.Tab.pageContainer}>
                <View style={Styles.ToolBoxTop.container}>
                    <TouchableOpacity style={Styles.ToolBoxTop.button}>
                        <Text style={Styles.ToolBoxTop.text}>
                            过滤器
                        </Text>
                    </TouchableOpacity>
                </View>
                <ListView
                    style={Styles.Tab.pageDisplayArea}
                    dataSource={this._dataSource.cloneWithRows((this.props as Props).SceneServantList.displayData)}
                    renderRow={(rowData, sectionId, rowId) => this.renderRow(rowData, this)}
                    showsVerticalScrollIndicator={false}
                    enableEmptySections={true}
                />
            </View>
        );
    }
}

export const App = injectIntoComponent(ServantList, State.StateName, Action.Actions);