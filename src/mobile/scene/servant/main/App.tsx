import React, {Component} from "react";
import {View, StyleSheet, Image, FlexDirection, ImageResizeMode, ListView, ListViewDataSource} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as MstService from "../../../service/MstService";
import {MstSvt} from "../../../../model/master/Master";
import {MstSvtContainer} from "../../../../model/impl/MstContainer";
import MstLoader from "../../../lib/model/MstLoader";
import InjectedProps from "../../../../lib/react/InjectedProps";
import * as State from "./State";
import * as Action from "./Action";

export * from "./State";
export * from "./Action";

const styles = StyleSheet.create({
    row: {
        flexDirection: "row" as FlexDirection,
        marginTop: 5,
        marginBottom: 5
    },
    cell: {
        flex: 1,
        width: 70,
        height: 70,
        marginLeft: 5,
        marginRight: 5,
        borderWidth: 1,
        borderStyle: "solid" as any,
        borderColor: "black",
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
        MstLoader.instance.loadModel("MstSvt").then((container: MstSvtContainer) => {
            this._svtContainer = container;

            (this.props as Props).actions.updateRawData(
                this._service.sortSvtDataWithNo(
                    this._service.filterSvtRawData(container.getRaw())
                )
            );
            (this.props as Props).actions.updateDisplayData(
                this._dataSource.cloneWithRows(
                    this._service.divideRawSvtIntoRows(
                        (this.props as Props).SceneServantList.rawData
                    )
                )
            );
        });
    }

    renderRow(rowData, rowId) {
        return (
            <View style={styles.row}>
                <View style={styles.cell}>
                    <Image style={styles.image}
                           source={require("../../../../../database/0.0.1/images/face/100100.png")}/>
                </View>
                <View style={styles.cell}>
                    <Image style={styles.image}
                           source={require("../../../../../database/0.0.1/images/face/100100.png")}/>
                </View>
                <View style={styles.cell}>
                    <Image style={styles.image}
                           source={require("../../../../../database/0.0.1/images/face/100100.png")}/>
                </View>
                <View style={styles.cell}>
                    <Image style={styles.image}
                           source={require("../../../../../database/0.0.1/images/face/100100.png")}/>
                </View>
                <View style={styles.cell}>
                    <Image style={styles.image}
                           source={require("../../../../../database/0.0.1/images/face/100100.png")}/>
                </View>
            </View>
        );
    }

    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View style={{marginTop: 0, height: 612}}>
                <ListView
                    dataSource={this._dataSource.cloneWithRows((this.props as Props).SceneServantList.displayData)}
                    renderRow={(rowData, sectionId, rowId) => this.renderRow(rowData, rowId)}
                    showsVerticalScrollIndicator={false}
                    enableEmptySections={true}
                />
            </View>
        );
    }
}

export const App = injectIntoComponent(ServantList, State.StateName, Action.Actions);