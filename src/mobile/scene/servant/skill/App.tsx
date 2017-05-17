import React, {Component} from "react";
import {Text, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import MstUtil from "../../../lib/utility/MstUtil";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import {
    SvtInfoPassiveSkill,
    SvtInfoSkill,
    SvtInfoSkillDetail,
    SvtInfoSkillEffect,
    SvtInfoTreasureDetail,
    SvtInfoTreasureEffect
} from "../../../lib/model/MstInfo";
import {SvtFooterTab, SvtFooterTabIndex} from "../../../component/servant_footer_tab/App";
import {Actions} from "react-native-router-flux";
import {Body, Button, Col, Container, Content, Header, Icon, Left, Right, Row, Thumbnail, Title} from "native-base";
import * as Styles from "../../../view/Styles";
import {ColCard, ColR, ColCentering, GridColCardWrapper, GridLine, RowCentering, TextCentering} from "../../../view/View";

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

    genTreasureColorCode(cardId: number) {
        // 1. Art; 2. Buster; 3. Quick;
        if (cardId === 1) {
            return "#0000ff";
        } else if (cardId === 2) {
            return "#ff0000";
        } else {
            return "#00ff00";
        }
    }

    renderSkills(skillInfo: SvtInfoSkill) {
        let skills = [];
        skillInfo.skills.forEach((skill: SvtInfoSkillDetail, index) => {
            let effects = [];
            skill.skillEffects.forEach((effect: SvtInfoSkillEffect, index) => {
                effects.push(
                    <RowCentering key={`SkillEffectDesc_${index}`}>
                        <ColR><Text>{effect.description}</Text></ColR>
                    </RowCentering>
                );
                let effectNumbers = [];
                if (effect.effects.length > 0) {
                    effect.effects.forEach((effectNumber: string, index) => {
                        effectNumbers.push(
                            <ColR key={`SkillEffectNumberDetail_${index}`}>
                                <Text>{effectNumber}</Text>
                            </ColR>
                        );
                    });
                    effects.push(<RowCentering key={`SkillEffectNumber_${index}`}>{effectNumbers}</RowCentering>);
                }
            });
            skills.push(
                <GridColCardWrapper key={`SkillInfo_${index}`}>
                    <Row>
                        <ColR size={.4}>
                            <Thumbnail small square
                                       source={{uri: MstUtil.instance.getRemoteSkillUrl(this._appVer, skill.iconId)}}/>
                        </ColR>
                        <ColCentering><TextCentering>{skill.name}</TextCentering></ColCentering>
                        <ColCentering><TextCentering>{this.genChargeTurnStr(skill.chargeTurn)}</TextCentering></ColCentering>
                        <ColCentering><TextCentering>{skill.condition}</TextCentering></ColCentering>
                    </Row>
                    {effects}
                </GridColCardWrapper>
            );
        });

        return (
            <View>
                <GridLine>
                    <ColCard items={["保有技能"]} backgroundColor="#CDE1F9"/>
                </GridLine>
                {skills}
            </View>
        );
    }

    renderPassiveSkills(skillInfo: SvtInfoSkill) {
        let skills = [];

        skillInfo.passiveSkills.forEach((skill: SvtInfoPassiveSkill, index) => {
            let effects = [];
            skill.skillEffects.forEach((effect: SvtInfoSkillEffect, index) => {
                effects.push(<Row key={`PasEffect_${index}`}><Text>{effect.description + effect.effects.join("")}</Text></Row>);
            });

            skills.push(
                <GridColCardWrapper key={`PasSkill_${index}`}>
                    <Row>
                        <ColR size={.4}>
                            <Thumbnail small square
                                       source={{uri: MstUtil.instance.getRemoteSkillUrl(this._appVer, skill.iconId)}}/>
                        </ColR>
                        <ColR size={1}><Text>{skill.name}</Text></ColR>
                        <ColR size={2}>{effects}</ColR>
                    </Row>
                </GridColCardWrapper>
            );
        });

        return (
            <View>
                <GridLine>
                    <ColCard items={["职阶技能"]} backgroundColor="#CDE1F9"/>
                </GridLine>
                {skills}
            </View>
        );
    }

    renderTreasures(skillInfo: SvtInfoSkill) {
        let skills = [];

        skillInfo.treasures.forEach((treasure: SvtInfoTreasureDetail, index) => {
            let effects = [];
            treasure.effects.forEach((effect: SvtInfoTreasureEffect, index) => {
                effects.push(
                    <RowCentering key={`TreEffectDesc_${index}`}>
                        <ColR><Text>{effect.description}</Text></ColR>
                    </RowCentering>
                );
                let effectNumbers = [];
                if (effect.effects.length > 0) {
                    effect.effects.forEach((effectNumber: string, index) => {
                        effectNumbers.push(
                            <ColR key={`TreEffectNumberDetail_${index}`}>
                                <Text>{effectNumber}</Text>
                            </ColR>
                        );
                    });
                    effects.push(<RowCentering key={`TreEffectNumber_${index}`}>{effectNumbers}</RowCentering>);
                }
            });
            skills.push(
                <GridColCardWrapper key={`TreSkill_${index}`}>
                    <Row style={[Styles.Common.VerticalCentering, {marginBottom: 5, height: 20}]}>
                        <ColR size={2}>
                            <Text style={{color: this.genTreasureColorCode(treasure.cardId)}}>
                                {treasure.name}
                            </Text>
                        </ColR>
                        <ColR size={.5}><Text>{treasure.rank}</Text></ColR>
                        <ColR size={1}><Text>{treasure.type}</Text></ColR>
                        <ColR size={1}><Text>{treasure.condition}</Text></ColR>
                        <ColR size={.8}><Text>{this.genTreasureHitStr(treasure.hits)}</Text></ColR>
                    </Row>
                    {effects}
                </GridColCardWrapper>
            );
        });

        return (
            <View>
                <GridLine>
                    <ColCard items={["宝具"]} backgroundColor="#CDE1F9"/>
                </GridLine>
                {skills}
            </View>
        );
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
                <SvtFooterTab activeIndex={SvtFooterTabIndex.Skill} svtId={state.svtId}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(ServantSkill, State.StateName, Action.Actions);