import React, {Component} from "react";
import {View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import * as Renderer from "./View";
import * as Styles from "../../../style/Styles";
import {SvtInfoBase, SvtInfoBaseCardInfo, SvtInfoRank} from "../../../lib/model/MstInfo";
import MstUtil from "../../../lib/model/MstUtil";
import Const from "../../../lib/const/Const";
import {ColumnData, ResImage, ToolBoxWrapper} from "../main/View";

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
            cells.push(Renderer.renderColumn(column));
        });
        return Renderer.renderRow(cells, <ResImage appVer={this._appVer} type="face" id={props.svtId} />);
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
                <ToolBoxWrapper buttons={[
                    {content: "编辑模式"}
                ]} />
                {Renderer.renderPageAreaWithoutToolBox(rows)}
            </View>
        );
    }

    prepareRowData(info: SvtInfoBase) {
        return [
            [
                Renderer.buildColumnStructSimple("图鉴编号", info.collectionNo),
                Renderer.buildColumnStructSimple("星级", info.rarity),
                Renderer.buildColumnStructSimple("名称", info.name),
            ],
            [
                Renderer.buildColumnStructSimple("职阶", info.className),
                Renderer.buildColumnStructSimple("分类", info.classification),
                Renderer.buildColumnStructSimple("属性", info.policy),
                Renderer.buildColumnStructSimple("性别", info.gender),
            ],
            [
                Renderer.buildColumnStructSimple("特性", info.individuality.join(", ")),
            ],
            [
                Renderer.buildColumnStructSimple("从者编号", info.svtId),
                Renderer.buildColumnStructSimple("最高等级", info.maxLevel),
                Renderer.buildColumnStructSimple("职阶攻击补正", info.attackRate + "%"),
            ],
            [
                Renderer.buildColumnStructSimple("力量", info.powerRank.display),
                Renderer.buildColumnStructSimple("防御", info.defenseRank.display),
                Renderer.buildColumnStructSimple("敏捷", info.agilityRank.display),
                Renderer.buildColumnStructSimple("魔力", info.magicRank.display),
                Renderer.buildColumnStructSimple("幸运", info.luckRank.display),
                Renderer.buildColumnStructSimple("宝具", info.treasureRank.display),
            ],
            [
                Renderer.buildColumnStructSimple("最高血量", this.genHpAtkStr(info.hpAtkMax.hp)),
                Renderer.buildColumnStructSimple("最高攻击", this.genHpAtkStr(info.hpAtkMax.atk)),
                Renderer.buildColumnStructSimple("Lv.80 血量", this.genHpAtkStr(info.hpAtk80.hp)),
                Renderer.buildColumnStructSimple("Lv.80 攻击", this.genHpAtkStr(info.hpAtk80.atk)),
            ],
            [
                Renderer.buildColumnStructSimple("Lv.90 血量", this.genHpAtkStr(info.hpAtk90.hp)),
                Renderer.buildColumnStructSimple("Lv.90 攻击", this.genHpAtkStr(info.hpAtk90.atk)),
                Renderer.buildColumnStructSimple("Lv.100 血量", this.genHpAtkStr(info.hpAtk100.hp)),
                Renderer.buildColumnStructSimple("Lv.100 攻击", this.genHpAtkStr(info.hpAtk100.atk)),
            ],
            [
                Renderer.buildColumnStructSimple("蓝卡", this.genCmdCardStr(info.cardArt)),
                Renderer.buildColumnStructSimple("红卡", this.genCmdCardStr(info.cardBuster)),
                Renderer.buildColumnStructSimple("绿卡", this.genCmdCardStr(info.cardQuick)),
                Renderer.buildColumnStructSimple("Extra", this.genCmdCardStr(info.cardExtra)),
            ],
            [
                Renderer.buildColumnStructSimple("出星率", info.starRate + "%"),
                Renderer.buildColumnStructSimple("被即死率", info.deathRate + "%"),
                Renderer.buildColumnStructSimple("集星权重", info.criticalWeight),
            ],
            [
                Renderer.buildColumnStructSimple("蓝卡NP", info.npArt + "%"),
                Renderer.buildColumnStructSimple("红卡NP", info.npBuster + "%"),
                Renderer.buildColumnStructSimple("绿卡NP", info.npQuick + "%"),
                Renderer.buildColumnStructSimple("EX NP", info.npExtra + "%"),
                Renderer.buildColumnStructSimple("防御NP", info.npDefence + "%"),
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