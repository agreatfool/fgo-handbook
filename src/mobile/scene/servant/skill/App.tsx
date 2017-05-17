import React, {Component} from "react";
import {View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import MstUtil from "../../../lib/utility/MstUtil";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import {ColCard, ColCentering, GridColCardWrapper, GridLine, RowCentering, TextCentering} from "../../../view/View";
import {
    SvtInfoPassiveSkill,
    SvtInfoSkill,
    SvtInfoSkillDetail,
    SvtInfoSkillEffect,
    SvtInfoTreasureDetail
} from "../../../lib/model/MstInfo";
import {SvtFooterTab, SvtFooterTabIndex} from "../../../component/servant_footer_tab/App";
import {Actions} from "react-native-router-flux";
import {Body, Button, Container, Content, Header, Icon, Left, Right, Thumbnail, Title} from "native-base";
import * as Styles from "../../../view/Styles";

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
            props.actions.updateSvtId(props.svtId);
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
        // let column = Renderer.buildColumnData("保有技能", []);
        // column.rows.push([
        //     <ResImage
        //         appVer={this._appVer}
        //         type="skill"
        //         id={skill.iconId}
        //         size="small"
        //     />,
        //     skill.name,
        //     this.genChargeTurnStr(skill.chargeTurn),
        //     skill.condition
        // ]);
        //
        // skill.skillEffects.forEach((effect: SvtInfoSkillEffect) => {
        //     column.rows.push([effect.description]);
        //     if (effect.effects.length > 0) {
        //         column.rows.push(effect.effects);
        //     }
        // });
        //
        // return [column];
    }

    preparePassiveSkillData(skills: Array<SvtInfoPassiveSkill>) {
        // let column = Renderer.buildColumnData("职阶技能", []);
        //
        // skills.forEach((skill: SvtInfoPassiveSkill) => {
        //     column.rows.push([
        //         <ResImage
        //             appVer={this._appVer}
        //             type="skill"
        //             id={skill.iconId}
        //             size="small"
        //         />,
        //         skill.name
        //     ]);
        //     let effects = [];
        //     skill.skillEffects.forEach((effect: SvtInfoSkillEffect) => {
        //         effects.push(effect.description + effect.effects.join(""));
        //     });
        //     column.rows.push([effects.join("\n")]);
        // });
        //
        // return [column];
    }

    prepareTreasureData(treasure: SvtInfoTreasureDetail) {
        //FIXME 宝具需要显示类型，否则红蓝绿完全就不知道了
        // let column = Renderer.buildColumnData("宝具", []);
        //
        // column.rows.push([
        //     treasure.name,
        //     treasure.rank,
        //     treasure.type,
        //     treasure.condition,
        //     this.genTreasureHitStr(treasure.hits),
        // ]);
        //
        // treasure.effects.forEach((effect: SvtInfoTreasureEffect) => {
        //     column.rows.push([effect.description]);
        //     if (effect.effects.length > 0) {
        //         column.rows.push(effect.effects);
        //     }
        // });
        //
        // return [column];
    }

    renderSkills(skillInfo: SvtInfoSkill) {
        let skills = [];
        skillInfo.skills.forEach((skill: SvtInfoSkillDetail, index) => {
            let effects = [];
            skill.skillEffects.forEach((effect: SvtInfoSkillEffect) => {
                effects.push(
                    <RowCentering>
                        <ColCentering><TextCentering>{effect.description}</TextCentering></ColCentering>
                    </RowCentering>
                );
                let effectNumbers = [];
                if (effect.effects.length > 0) {
                    effect.effects.forEach((effectNumber: string) => {
                        effectNumbers.push(<ColCentering><TextCentering>{effectNumber}</TextCentering></ColCentering>);
                    });
                    effects.push(<RowCentering>{effectNumbers}</RowCentering>);
                }
            });
            skills.push(
                <GridColCardWrapper key={`SkillInfo_${index}`}>
                    <RowCentering>
                        <ColCentering size={.5}>
                            <Thumbnail small square
                                       source={{uri: MstUtil.instance.getRemoteSkillUrl(this._appVer, skill.iconId)}}/>
                        </ColCentering>
                        <ColCentering><TextCentering>{skill.name}</TextCentering></ColCentering>
                        <ColCentering><TextCentering>{this.genChargeTurnStr(skill.chargeTurn)}</TextCentering></ColCentering>
                        <ColCentering><TextCentering>{skill.condition}</TextCentering></ColCentering>
                    </RowCentering>
                    {effects}
                </GridColCardWrapper>
            );
        });

        return (
            <View>
                <GridLine>
                    <ColCard items={["保有技能"]}/>
                </GridLine>
                {skills}
            </View>
        );
    }

    renderPassiveSkills(skillInfo: SvtInfoSkill) {

    }

    renderTreasures(skillInfo: SvtInfoSkill) {

    }

    render() {
        let props = this.props as State.Props;
        let state = props.SceneServantInfo;
        let info: SvtInfoSkill = state.skillInfo;
        if (MstUtil.isObjEmpty(info)) {
            return <View />;
        }

        let skills = this.renderSkills(info);
        let passiveSkills = this.renderPassiveSkills(info);
        let treasures = this.renderTreasures(info);

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => (Actions as any).pop()}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>{state.title}</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        {skills}
                        {passiveSkills}
                        {treasures}
                    </View>
                </Content>
                <SvtFooterTab activeIndex={SvtFooterTabIndex.Detail} svtId={state.svtId}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(ServantSkill, State.StateName, Action.Actions);