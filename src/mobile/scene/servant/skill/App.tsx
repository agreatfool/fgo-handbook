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
import {ToolBoxWrapper, TabScene, TabPage, TableColumnData} from "../main/View";

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

    renderPage(data: Array<Array<TableColumnData>>) {
        return (
            <TabScene>
                <ToolBoxWrapper buttons={[
                    {content: "编辑模式"}
                ]} />
                <TabPage>
                    {data}
                </TabPage>
            </TabScene>
        );
    }

    prepareRowData(info: SvtInfoSkill) {
        return [];
    }

    render() {
        let info: SvtInfoSkill = (this.props as State.Props).SceneServantInfo.skillInfo;
        if (MstUtil.isObjEmpty(info)) {
            // 数据未准备好，不要渲染页面
            return <View />;
        }

        return this.renderPage(this.prepareRowData(info));
    }
}

export const App = injectIntoComponent(ServantSkill, State.StateName, Action.Actions);