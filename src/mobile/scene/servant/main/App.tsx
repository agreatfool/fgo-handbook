import React, {Component} from "react";
import {View, StyleSheet, FlexDirection, ImageResizeMode, ListView, Image, TouchableOpacity, ListViewDataSource} from "react-native";
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

export * from "./State";
export * from "./Action";

const styles = StyleSheet.create({
    row: {
        flexDirection: "row" as FlexDirection,
        marginTop: 5,
        marginBottom: 5
    },
    cellBase: {
        flex: 1,
        width: 70,
        height: 70,
        marginLeft: 5,
        marginRight: 5,
    },
    cell: {
        borderWidth: 1,
        borderStyle: "solid" as any,
        borderColor: "black",
    },
    cellPlaceholder: {
        marginLeft: 6,
        marginRight: 6,
    },
    image: {
        flex: 1,
        width: 70,
        resizeMode: "contain" as ImageResizeMode
    }
});

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

    renderRow(rowData, app) {
        let placeholder = [];
        let placeholderCount = Const.SERVANT_IN_ROW - rowData.length;
        if (placeholderCount > 0) {
            for (let loop = 0; loop < placeholderCount; loop++) {
                placeholder.push(
                    <View style={[styles.cellBase, styles.cellPlaceholder]} key={`placeholder${loop}`}>
                        <Image style={styles.image} source={undefined}/>
                    </View>
                );
            }
        }

        return (
            <View style={styles.row}>
                {rowData.map((element) => {
                    let svtId = (element as MstSvt).id;
                    let svtImageUrl = MstUtil.instance.getRemoteFaceUrl(app._appVer, svtId);
                    //noinspection TypeScriptValidateJSTypes,TypeScriptUnresolvedFunction
                    return (
                        <TouchableOpacity key={svtId} onPress={() => (Actions as any).servant_info({svtId: svtId})}>
                            <View style={[styles.cell, styles.cellBase]}>
                                <CacheImage style={styles.image} url={svtImageUrl} />
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
            <View style={{height: 612}}>
                <ListView
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