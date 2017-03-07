import React, {Component} from "react";
import {View, Text, TouchableOpacity, ScrollView} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import InjectedProps from "../../../../lib/react/InjectedProps";
import * as Styles from "../../../style/Styles";
import {SvtInfoBase, SvtInfoBaseCardInfo} from "../../../lib/model/MstInfo";
import MstUtil from "../../../lib/model/MstUtil";
import {CacheImage} from "../../../component/cache_image/App";
import Const from "../../../lib/const/Const";

export * from "./State";
export * from "./Action";

interface DataColumn {
    title: string | number;
    content: string | number;
}

interface Props extends InjectedProps {
    svtId: number;
    SceneServantInfo: State.State;
}

class ServantDetail extends Component<Props, any> {
    private _appVer: string;
    private _service: MstService.Service;

    constructor(props, context) {
        super(props, context);
        this._service = new MstService.Service();
    }

    componentWillMount() {
        MstUtil.instance.getAppVer().then((appVer) => {
            this._appVer = appVer;
            //noinspection TypeScriptUnresolvedVariable
            return this._service.buildSvtInfoBase(this.props.svtId);
        }).then((info) => {
            (this.props as Props).actions.updatePageTitle(info.name);
            (this.props as Props).actions.updateSvtInfo({baseInfo: info});
        });
    }

    buildDataColumn(title: string, content: string | number) {
        return {title: title, content: content};
    }

    buildHpAtkView(value: number) {
        return `${value}\n(${value + Const.MAX_VAL_WITH_UPGRADE})`
    }

    buildCmdCardView(card: SvtInfoBaseCardInfo) {
        return (card.count == 0 ? "" : `${card.count}张`) + `${card.hits}Hits`;
    }

    renderSvtImage(svtId) {
        return <CacheImage
            style={{width: 70, height: 70, resizeMode: "contain"}}
            url={MstUtil.instance.getRemoteFaceUrl(this._appVer, svtId)}/>;
    }

    renderFirstRow(columns: Array<DataColumn>) {
        let cells = [];
        columns.forEach((column: DataColumn, index) => {
            cells.push(this.renderColumn(column, index, 70));
        });
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View style={[
                    Styles.Common.flexRow,
                    Styles.Common.flexDefault,
                    Styles.Common.row,
                    {height: 70}
                ]}
                  key="row00">
                {this.renderSvtImage(this.props.svtId)}
                {cells}
            </View>
        );
    }

    renderRow(columns: Array<DataColumn>, index: number) {
        let cells = [];
        columns.forEach((column: DataColumn, index) => {
            cells.push(this.renderColumn(column, index));
        });
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View style={[
                    Styles.Common.flexRow,
                    Styles.Common.flexDefault,
                    Styles.Common.row,
                ]}
                  key={`row${index}`}>
                {cells}
            </View>
        );
    }

    renderColumn(column: DataColumn, index: number, height = 50) {
        return (
            <View style={[
                    Styles.Common.flexColumn,
                    Styles.Common.flexDefault,
                    {minHeight: height}
                ]}
                  key={`column${index}`}>
                <View style={[Styles.Common.centering, {height: 20}, Styles.Tab.tabBar]}>
                    <Text style={Styles.Common.textCenter}>{column.title}</Text>
                </View>
                <View style={[Styles.Common.centering, {minHeight: height - 20}, Styles.Tab.tabBar]}>
                    <Text style={Styles.Common.textCenter}>{column.content}</Text>
                </View>
            </View>
        );
    }

    renderPage(data: Array<Array<DataColumn>>) {
        let firstData = data.shift();
        let rows = [];
        data.forEach((data: Array<DataColumn>, index) => {
            rows.push(this.renderRow(data, index));
        });

        return (
            <View style={Styles.Tab.pageContainer}>
                <View style={Styles.ToolBoxTop.container}>
                    <TouchableOpacity style={Styles.ToolBoxTop.button}>
                        <Text style={Styles.ToolBoxTop.text}>
                            编辑模式
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={Styles.Tab.pageDisplayArea}>
                    <ScrollView style={Styles.Common.flexColumn}>
                        {this.renderFirstRow(firstData)}
                        {rows}
                    </ScrollView>
                </View>
            </View>
        );
    }

    render() {
        let info: SvtInfoBase = (this.props as Props).SceneServantInfo.baseInfo;
        if (MstUtil.isObjEmpty(info)) {
            // 数据未准备好，不要渲染页面
            return <View>{undefined}</View>
        }

        let rows = [
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
                this.buildDataColumn("最高血量", this.buildHpAtkView(info.hpAtkMax.hp)),
                this.buildDataColumn("最高攻击", this.buildHpAtkView(info.hpAtkMax.atk)),
                this.buildDataColumn("Lv.80 血量", this.buildHpAtkView(info.hpAtk80.hp)),
                this.buildDataColumn("Lv.80 攻击", this.buildHpAtkView(info.hpAtk80.atk)),
            ],
            [
                this.buildDataColumn("Lv.90 血量", this.buildHpAtkView(info.hpAtk90.hp)),
                this.buildDataColumn("Lv.90 攻击", this.buildHpAtkView(info.hpAtk90.atk)),
                this.buildDataColumn("Lv.100 血量", this.buildHpAtkView(info.hpAtk100.hp)),
                this.buildDataColumn("Lv.100 攻击", this.buildHpAtkView(info.hpAtk100.atk)),
            ],
            [
                this.buildDataColumn("蓝卡", this.buildCmdCardView(info.cardArt)),
                this.buildDataColumn("红卡", this.buildCmdCardView(info.cardBuster)),
                this.buildDataColumn("绿卡", this.buildCmdCardView(info.cardQuick)),
                this.buildDataColumn("Extra", this.buildCmdCardView(info.cardExtra)),
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

        return this.renderPage(rows);
    }
}

export const App = injectIntoComponent(ServantDetail, State.StateName, Action.Actions);