import React, {Component} from "react";
import {View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import * as Renderer from "./View";
import * as Styles from "../../../style/Styles";
import {SvtInfoBase, SvtInfoBaseCardInfo} from "../../../lib/model/MstInfo";
import MstUtil from "../../../lib/model/MstUtil";
import Const from "../../../lib/const/Const";
import {ColumnData} from "../main/View";

export * from "./State";
export * from "./Action";

class ServantDetail extends Component<State.Props, any> {
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
            return this._service.buildSvtInfoBase(props.svtId);
        }).then((info) => {
            props.actions.updatePageTitle(info.name);
            props.actions.updateSvtInfo({baseInfo: info});
        });
    }

    buildDataColumn(title: string, content: string | number): ColumnData {
        return {title: title, content: content};
    }

    genHpAtkStr(value: number) {
        return `${value}\n(${value + Const.MAX_VAL_WITH_UPGRADE})`
    }

    genCmdCardStr(card: SvtInfoBaseCardInfo) {
        return (card.count == 0 ? "" : `${card.count}张`) + `${card.hits}Hits`;
    }

    renderFirstRow(columns: Array<ColumnData>) {
        let props = this.props as State.Props;
        let cells = [];
        columns.forEach((column: ColumnData) => {
            cells.push(Renderer.renderColumn(column, {height: 70}));
        });
        return Renderer.renderRow(cells, Renderer.renderResourceImg(this._appVer, "face", props.svtId));
    }

    renderRow(columns: Array<ColumnData>) {
        let cells = [];
        columns.forEach((column: ColumnData) => {
            cells.push(Renderer.renderColumn(column));
        });
        return Renderer.renderRow(cells);
    }

    renderPage(data: Array<Array<ColumnData>>) {
        let firstData = data.shift();
        let rows = [this.renderFirstRow(firstData)];
        data.forEach((data: Array<ColumnData>) => {
            rows.push(this.renderRow(data));
        });

        return (
            <View style={Styles.Tab.pageContainer}>
                {Renderer.renderToolBoxTop([{text: "编辑模式"}])}
                {Renderer.renderPageAreaWithoutToolBox(rows)}
            </View>
        );
    }

    prepareRowData(info: SvtInfoBase) {
        return [
            [
                this.buildDataColumn("图鉴编号", info.collectionNo),
                this.buildDataColumn("星级", info.rarity),
                this.buildDataColumn("名称", info.name),
            ],
            [
                this.buildDataColumn("职阶", info.className),
                this.buildDataColumn("分类", info.classification),
                this.buildDataColumn("属性", info.policy),
                this.buildDataColumn("性别", info.gender),
            ],
            [
                this.buildDataColumn("特性", info.individuality.join(", ")),
            ],
            [
                this.buildDataColumn("从者编号", info.svtId),
                this.buildDataColumn("最高等级", info.maxLevel),
                this.buildDataColumn("职阶攻击补正", info.attackRate + "%"),
            ],
            [
                this.buildDataColumn("最高血量", this.genHpAtkStr(info.hpAtkMax.hp)),
                this.buildDataColumn("最高攻击", this.genHpAtkStr(info.hpAtkMax.atk)),
                this.buildDataColumn("Lv.80 血量", this.genHpAtkStr(info.hpAtk80.hp)),
                this.buildDataColumn("Lv.80 攻击", this.genHpAtkStr(info.hpAtk80.atk)),
            ],
            [
                this.buildDataColumn("Lv.90 血量", this.genHpAtkStr(info.hpAtk90.hp)),
                this.buildDataColumn("Lv.90 攻击", this.genHpAtkStr(info.hpAtk90.atk)),
                this.buildDataColumn("Lv.100 血量", this.genHpAtkStr(info.hpAtk100.hp)),
                this.buildDataColumn("Lv.100 攻击", this.genHpAtkStr(info.hpAtk100.atk)),
            ],
            [
                this.buildDataColumn("蓝卡", this.genCmdCardStr(info.cardArt)),
                this.buildDataColumn("红卡", this.genCmdCardStr(info.cardBuster)),
                this.buildDataColumn("绿卡", this.genCmdCardStr(info.cardQuick)),
                this.buildDataColumn("Extra", this.genCmdCardStr(info.cardExtra)),
            ],
            [
                this.buildDataColumn("出星率", info.starRate + "%"),
                this.buildDataColumn("被即死率", info.deathRate + "%"),
                this.buildDataColumn("集星权重", info.criticalWeight),
            ],
            [
                this.buildDataColumn("蓝卡NP", info.npArt + "%"),
                this.buildDataColumn("红卡NP", info.npBuster + "%"),
                this.buildDataColumn("绿卡NP", info.npQuick + "%"),
                this.buildDataColumn("EX NP", info.npExtra + "%"),
                this.buildDataColumn("防御NP", info.npDefence + "%"),
            ],
        ];
    }

    render() {
        let info: SvtInfoBase = (this.props as State.Props).SceneServantInfo.baseInfo;
        if (MstUtil.isObjEmpty(info)) {
            // 数据未准备好，不要渲染页面
            return <View>{undefined}</View>
        }

        return this.renderPage(this.prepareRowData(info));
    }
}

export const App = injectIntoComponent(ServantDetail, State.StateName, Action.Actions);