import React, {Component} from "react";
import {View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import * as Renderer from "./View";
import {SvtInfoBase, SvtInfoBaseCardInfo} from "../../../lib/model/MstInfo";
import MstUtil from "../../../lib/model/MstUtil";
import Const from "../../../lib/const/Const";
import {ResImage, ToolBoxWrapper, TabScene, TabPageScroll, Table} from "../main/View";

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

    prepareData(info: SvtInfoBase) {
        return [
            [
                Renderer.buildColumnDataSimple(
                    undefined,
                    <ResImage appVer={this._appVer}
                              type="face"
                              id={(this.props as State.Props).svtId}/>
                ),
                Renderer.buildColumnDataSimple("图鉴编号", info.collectionNo),
                Renderer.buildColumnDataSimple("星级", info.rarity),
                Renderer.buildColumnDataSimple("名称", info.name),
            ],
            [
                Renderer.buildColumnDataSimple("职阶", info.className),
                Renderer.buildColumnDataSimple("分类", info.classification),
                Renderer.buildColumnDataSimple("属性", info.policy),
                Renderer.buildColumnDataSimple("性别", info.gender),
            ],
            [
                Renderer.buildColumnDataSimple("特性", info.individuality.join(", ")),
            ],
            [
                Renderer.buildColumnDataSimple("从者编号", info.svtId),
                Renderer.buildColumnDataSimple("最高等级", info.maxLevel),
                Renderer.buildColumnDataSimple("职阶攻击补正", info.attackRate + "%"),
            ],
            [
                Renderer.buildColumnDataSimple("力量", info.powerRank.display),
                Renderer.buildColumnDataSimple("防御", info.defenseRank.display),
                Renderer.buildColumnDataSimple("敏捷", info.agilityRank.display),
                Renderer.buildColumnDataSimple("魔力", info.magicRank.display),
                Renderer.buildColumnDataSimple("幸运", info.luckRank.display),
                Renderer.buildColumnDataSimple("宝具", info.treasureRank.display),
            ],
            [
                Renderer.buildColumnDataSimple("最高血量", this.genHpAtkStr(info.hpAtkMax.hp)),
                Renderer.buildColumnDataSimple("最高攻击", this.genHpAtkStr(info.hpAtkMax.atk)),
                Renderer.buildColumnDataSimple("Lv.80 血量", this.genHpAtkStr(info.hpAtk80.hp)),
                Renderer.buildColumnDataSimple("Lv.80 攻击", this.genHpAtkStr(info.hpAtk80.atk)),
            ],
            [
                Renderer.buildColumnDataSimple("Lv.90 血量", this.genHpAtkStr(info.hpAtk90.hp)),
                Renderer.buildColumnDataSimple("Lv.90 攻击", this.genHpAtkStr(info.hpAtk90.atk)),
                Renderer.buildColumnDataSimple("Lv.100 血量", this.genHpAtkStr(info.hpAtk100.hp)),
                Renderer.buildColumnDataSimple("Lv.100 攻击", this.genHpAtkStr(info.hpAtk100.atk)),
            ],
            [
                Renderer.buildColumnDataSimple("蓝卡", this.genCmdCardStr(info.cardArt)),
                Renderer.buildColumnDataSimple("红卡", this.genCmdCardStr(info.cardBuster)),
                Renderer.buildColumnDataSimple("绿卡", this.genCmdCardStr(info.cardQuick)),
                Renderer.buildColumnDataSimple("Extra", this.genCmdCardStr(info.cardExtra)),
            ],
            [
                Renderer.buildColumnDataSimple("出星率", info.starRate + "%"),
                Renderer.buildColumnDataSimple("被即死率", info.deathRate + "%"),
                Renderer.buildColumnDataSimple("集星权重", info.criticalWeight),
            ],
            [
                Renderer.buildColumnDataSimple("蓝卡NP", info.npArt + "%"),
                Renderer.buildColumnDataSimple("红卡NP", info.npBuster + "%"),
                Renderer.buildColumnDataSimple("绿卡NP", info.npQuick + "%"),
                Renderer.buildColumnDataSimple("EX NP", info.npExtra + "%"),
                Renderer.buildColumnDataSimple("防御NP", info.npDefence + "%"),
            ],
        ];
    }

    render() {
        let info: SvtInfoBase = (this.props as State.Props).SceneServantInfo.baseInfo;
        if (MstUtil.isObjEmpty(info)) {
            // 数据未准备好，不要渲染页面
            return <View />;
        }

        let data = this.prepareData(info);

        return (
            <TabScene>
                <ToolBoxWrapper
                    pageName="ServantDetail"
                    buttons={[
                        {content: "编辑模式"}
                    ]}
                />
                <TabPageScroll>
                    <Table pageName="ServantDetail" data={data}/>
                </TabPageScroll>
            </TabScene>
        );
    }
}

export const App = injectIntoComponent(ServantDetail, State.StateName, Action.Actions);