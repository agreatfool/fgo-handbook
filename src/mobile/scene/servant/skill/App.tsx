import React, {Component} from "react";
import {View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import MstUtil from "../../../lib/utility/MstUtil";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import * as Renderer from "../../../view/View";
import {
    SvtInfoSkill, SvtInfoSkillDetail, SvtInfoSkillEffect, SvtInfoPassiveSkill,
    SvtInfoTreasureDetail, SvtInfoTreasureEffect
} from "../../../lib/model/MstInfo";
import {ToolBoxWrapper, TabScene, TabPageScroll, ResImage, Table} from "../../../view/View";

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

    genChargeTurnStr(chargeTurn: number) {
        return `冷却${chargeTurn}回合`;
    }

    genTreasureHitStr(hits: number) {
        return `${hits} Hits`;
    }

    prepareSkillData(skill: SvtInfoSkillDetail) {
        let column = Renderer.buildColumnData("保有技能", []);
        column.rows.push([
            <ResImage
                appVer={this._appVer}
                type="skill"
                id={skill.iconId}
                size="small"
            />,
            skill.name,
            this.genChargeTurnStr(skill.chargeTurn),
            skill.condition
        ]);

        skill.skillEffects.forEach((effect: SvtInfoSkillEffect) => {
            column.rows.push([effect.description]);
            if (effect.effects.length > 0) {
                column.rows.push(effect.effects);
            }
        });

        return [column];
    }

    preparePassiveSkillData(skills: Array<SvtInfoPassiveSkill>) {
        let column = Renderer.buildColumnData("职阶技能", []);

        skills.forEach((skill: SvtInfoPassiveSkill) => {
            column.rows.push([
                <ResImage
                    appVer={this._appVer}
                    type="skill"
                    id={skill.iconId}
                    size="small"
                />,
                skill.name
            ]);
            let effects = [];
            skill.skillEffects.forEach((effect: SvtInfoSkillEffect) => {
                effects.push(effect.description + effect.effects.join(""));
            });
            column.rows.push([effects.join("\n")]);
        });

        return [column];
    }

    prepareTreasureData(treasure: SvtInfoTreasureDetail) {
        let column = Renderer.buildColumnData("宝具", []);

        column.rows.push([
            treasure.name,
            treasure.rank,
            treasure.type,
            treasure.condition,
            this.genTreasureHitStr(treasure.hits),
        ]);

        treasure.effects.forEach((effect: SvtInfoTreasureEffect) => {
            column.rows.push([effect.description]);
            if (effect.effects.length > 0) {
                column.rows.push(effect.effects);
            }
        });

        return [column];
    }

    prepareData(info: SvtInfoSkill) {
        let data = [];

        info.skills.forEach((skill: SvtInfoSkillDetail) => {
            data.push(this.prepareSkillData(skill));
        });
        info.treasures.forEach((treasure: SvtInfoTreasureDetail) => {
            data.push(this.prepareTreasureData(treasure));
        });
        data.push(this.preparePassiveSkillData(info.passiveSkills));

        return data;
    }

    render() {
        let info: SvtInfoSkill = (this.props as State.Props).SceneServantInfo.skillInfo;
        if (MstUtil.isObjEmpty(info)) {
            // 数据未准备好，不要渲染页面
            return <View />;
        }

        let data = this.prepareData(info);

        return (
            <TabScene>
                <ToolBoxWrapper
                    pageName="ServantSkill"
                    buttons={[
                        {content: "编辑模式"}
                    ]}
                />
                <TabPageScroll>
                    <Table pageName="ServantSkill" data={data} />
                </TabPageScroll>
            </TabScene>
        );
    }
}

export const App = injectIntoComponent(ServantSkill, State.StateName, Action.Actions);