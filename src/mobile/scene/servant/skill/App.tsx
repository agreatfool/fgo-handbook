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
import {Body, Button, Col, Container, Content, Grid, Header, Icon, Left, Right, Row, Title} from "native-base";
import * as Styles from "../../../view/Styles";
import {
    ColCard,
    ColCentering,
    GridColCardWrapper,
    RowCentering,
    TextCentering,
    ThumbnailR
} from "../../../view/View";

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
                        <Col><Text>{effect.description}</Text></Col>
                    </RowCentering>
                );
                let effectNumbers = [];
                if (effect.effects.length > 0) {
                    effect.effects.forEach((effectNumber: string, index) => {
                        effectNumbers.push(
                            <Col key={`SkillEffectNumberDetail_${index}`}>
                                <Text>{effectNumber}</Text>
                            </Col>
                        );
                    });
                    effects.push(<RowCentering key={`SkillEffectNumber_${index}`}>{effectNumbers}</RowCentering>);
                }
            });
            skills.push(
                <GridColCardWrapper key={`SkillInfo_${index}`}>
                    <Row>
                        <Col size={.4}>
                            <ThumbnailR small square
                                        source={{uri: MstUtil.instance.getRemoteSkillUrl(this._appVer, skill.iconId)}}/>
                        </Col>
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
                <Grid>
                    <ColCard items={["保有技能"]} backgroundColor="#CDE1F9"/>
                </Grid>
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
                        <Col size={.4}>
                            <ThumbnailR small square
                                        source={{uri: MstUtil.instance.getRemoteSkillUrl(this._appVer, skill.iconId)}}/>
                        </Col>
                        <Col size={1}><Text>{skill.name}</Text></Col>
                        <Col size={2}>{effects}</Col>
                    </Row>
                </GridColCardWrapper>
            );
        });

        return (
            <View>
                <Grid>
                    <ColCard items={["职阶技能"]} backgroundColor="#CDE1F9"/>
                </Grid>
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
                        <Col><Text>{effect.description}</Text></Col>
                    </RowCentering>
                );
                let effectNumbers = [];
                if (effect.effects.length > 0) {
                    effect.effects.forEach((effectNumber: string, index) => {
                        effectNumbers.push(
                            <Col key={`TreEffectNumberDetail_${index}`}>
                                <Text>{effectNumber}</Text>
                            </Col>
                        );
                    });
                    effects.push(<RowCentering key={`TreEffectNumber_${index}`}>{effectNumbers}</RowCentering>);
                }
            });
            skills.push(
                <GridColCardWrapper key={`TreSkill_${index}`}>
                    <Row style={[Styles.Common.VerticalCentering, {marginBottom: 5, height: 20}]}>
                        <Col size={2}>
                            <Text style={{color: this.genTreasureColorCode(treasure.cardId)}}>
                                {treasure.name}
                            </Text>
                        </Col>
                        <Col size={.5}><Text>{treasure.rank}</Text></Col>
                        <Col size={1}><Text>{treasure.type}</Text></Col>
                        <Col size={1}><Text>{treasure.condition}</Text></Col>
                        <Col size={.8}><Text>{this.genTreasureHitStr(treasure.hits)}</Text></Col>
                    </Row>
                    {effects}
                </GridColCardWrapper>
            );
        });

        return (
            <View>
                <Grid>
                    <ColCard items={["宝具"]} backgroundColor="#CDE1F9"/>
                </Grid>
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