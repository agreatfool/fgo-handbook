import React, {Component} from "react";
import {View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import MstUtil from "../../../lib/model/MstUtil";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import * as Renderer from "./View";
import * as Styles from "../../../style/Styles";
import {SvtInfoSkill} from "../../../lib/model/MstInfo";
import {ColumnData, ToolBoxWrapper} from "../main/View";

export * from "./State";
export * from "./Action";

class ServantSkill extends Component<State.Props, any> {
    private _appVer: string;
    private _service: MstService.Service;

    constructor(props, context) {
        super(props, context);
        this._service = new MstService.Service();
    }

    componentWillMount() {
        let props = this.props as State.Props;
        MstUtil.instance.getAppVer().then((appVer) => {
            this._appVer = appVer;
            return this._service.getServantName(props.svtId);
        }).then((name) => {
            props.actions.updatePageTitle(name);
            return this._service.buildSvtInfoSkill(props.svtId);
        }).then((info) => {
            props.actions.updateSvtInfo({skillInfo: info});
        });
    }

    renderRow(columns: Array<ColumnData>) {
        let cells = [];
        columns.forEach((column: ColumnData) => {
            cells.push(Renderer.renderColumn(column));
        });
        return Renderer.renderRow(cells);
    }

    renderPage(data: Array<Array<ColumnData>>) {
        let rows = [];
        data.forEach((data: Array<ColumnData>) => {
            rows.push(this.renderRow(data));
        });

        return (
            <View style={Styles.Tab.pageContainer}>
                <ToolBoxWrapper buttons={[
                    {content: "编辑模式"}
                ]} />
                {Renderer.renderPageAreaWithoutToolBox(rows)}
            </View>
        );
    }

    prepareRowData(info: SvtInfoSkill) {
        return [];
    }

    render() {
        let info: SvtInfoSkill = (this.props as State.Props).SceneServantInfo.skillInfo;
        if (MstUtil.isObjEmpty(info)) {
            // 数据未准备好，不要渲染页面
            return <View>{undefined}</View>
        }

        return this.renderPage(this.prepareRowData(info));
    }
}

export const App = injectIntoComponent(ServantSkill, State.StateName, Action.Actions);