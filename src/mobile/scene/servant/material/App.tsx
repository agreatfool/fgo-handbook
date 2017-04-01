import React, {Component} from "react";
import {View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import MstUtil from "../../../lib/utility/MstUtil";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import * as Renderer from "../../../view/View";
import {
    TabScene,
    ToolBoxWrapper,
    TabPageScroll,
    Table,
    ResImageWithElement,
    ResImageWithElementPlaceholder
} from "../../../view/View";
import {
    SvtInfoMaterial,
    SvtInfoMaterialLimit,
    SvtInfoMaterialSkill,
    SvtInfoMaterialDetail
} from "../../../lib/model/MstInfo";

export * from "./State";
export * from "./Action";

class ServantMaterial extends Component<State.Props, any> {
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
            return this._service.buildSvtInfoMaterial(props.svtId);
        }).then((info) => {
            props.actions.updateSvtInfo({materialInfo: info});
        });
    }

    genLimitStr(index: number) {
        return `第${index}阶段`;
    }

    genItemCountStr(count: number) {
        return `x${count}`;
    }

    genQpStr(qp: number) {
        return `${qp}QP`;
    }

    genSkillStr(index: number) {
        return `Lv.${index}\n->\nLv.${index + 1}`;
    }

    prepareRowData(elements: Array<SvtInfoMaterialLimit | SvtInfoMaterialSkill>, title: string, subTitleRenderer: Function) {
        let column = Renderer.buildColumnData(title, []);

        if (elements.length <= 0) {
            return [column];
        }

        const CELL_COUNT = 5;
        let loopBase = elements;
        if (loopBase.length < 9) {
            // 这是一个灵基再临数据结构，需要删除最后的圣杯再临数据；P.S 技能只有9个升级项，故此按9判断
            loopBase = loopBase.slice(0, 4);
        }
        loopBase.forEach((element: SvtInfoMaterialLimit | SvtInfoMaterialSkill, index) => {
            let cells = [];
            cells.push(subTitleRenderer(index + 1));
            element.items.forEach((item: SvtInfoMaterialDetail) => {
                cells.push(
                    <ResImageWithElement
                        appVer={this._appVer}
                        type="item"
                        id={item.itemId}
                        size="small"
                        text={this.genItemCountStr(item.count)}
                    />
                );
            });
            cells.push(
                <ResImageWithElementPlaceholder>
                    {this.genQpStr(element.qp)}
                </ResImageWithElementPlaceholder>);
            if (cells.length < CELL_COUNT) {
                let appendCount = CELL_COUNT - cells.length;
                for (let loop = 0; loop < appendCount; loop++) {
                    cells.push(<ResImageWithElementPlaceholder />);
                }
            }
            column.rows.push(cells);
        });

        return [column];
    }

    prepareData(info: SvtInfoMaterial) {
        let data = [];

        data.push(this.prepareRowData(info.limit, "灵基再临", this.genLimitStr));
        data.push(this.prepareRowData(info.skill, "技能强化", this.genSkillStr));

        return data;
    }

    render() {
        let info: SvtInfoMaterial = (this.props as State.Props).SceneServantInfo.materialInfo;
        if (MstUtil.isObjEmpty(info)) {
            // 数据未准备好，不要渲染页面
            return <View />;
        }

        let data = this.prepareData(info);

        return (
            <TabScene>
                <ToolBoxWrapper
                    pageName="ServantMaterial"
                    buttons={[
                        {content: "编辑模式"}
                    ]}
                />
                <TabPageScroll>
                    <Table pageName="ServantMaterial" data={data}/>
                </TabPageScroll>
            </TabScene>
        );
    }
}

export const App = injectIntoComponent(ServantMaterial, State.StateName, Action.Actions);