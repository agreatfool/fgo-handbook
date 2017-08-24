import React, {Component} from "react";
import {Text, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import {ColCard, ThumbnailR} from "../../../view/View";
import {SvtInfoBase, SvtInfoBaseCardInfo} from "../../../lib/model/MstInfo";
import MstUtil from "../../../lib/utility/MstUtil";
import Const from "../../../lib/const/Const";
import {Actions} from "react-native-router-flux";
import {Body, Button, Col, Container, Content, Grid, Header, Icon, Left, Right, Title} from "native-base";
import * as Styles from "../../../view/Styles";
import {SvtFooterTab, SvtFooterTabIndex} from "../../../component/servant_footer_tab/App";

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
        }).then((info: SvtInfoBase) => {
            props.actions.updateSvtId(props.svtId);
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

    renderDetail(info: SvtInfoBase) {
        return (
            <View style={Styles.Box.Wrapper}>
                <Grid>
                    <Col size={.6} style={Styles.Common.Centering}>
                        <ThumbnailR square source={{uri: MstUtil.instance.getRemoteFaceUrl(this._appVer, info.svtId)}}/>
                    </Col>
                    <ColCard items={["图鉴编号", info.collectionNo]}/>
                    <ColCard items={["星级", <Text style={Styles.Common.Star}>{info.rarity}</Text>]}/>
                    <ColCard items={["名称", info.name]}/>
                </Grid>
                <Grid>
                    <ColCard items={["职阶", info.className]}/>
                    <ColCard items={["分类", info.classification]}/>
                    <ColCard items={["属性", info.policy]}/>
                    <ColCard items={["性别", info.gender]}/>
                </Grid>
                <Grid>
                    <ColCard items={["特性", info.individuality.join(", ")]}/>
                </Grid>
                <Grid>
                    <ColCard items={["从者编号", info.svtId]}/>
                    <ColCard items={["最高等级", info.maxLevel]}/>
                    <ColCard items={["职阶攻击补正", info.attackRate + "%"]}/>
                </Grid>
                <Grid>
                    <ColCard items={["力量", info.powerRank.display]}/>
                    <ColCard items={["防御", info.defenseRank.display]}/>
                    <ColCard items={["敏捷", info.agilityRank.display]}/>
                    <ColCard items={["魔力", info.magicRank.display]}/>
                    <ColCard items={["幸运", info.luckRank.display]}/>
                    <ColCard items={["宝具", info.treasureRank.display]}/>
                </Grid>
                <Grid>
                    <ColCard items={["最高血量", this.genHpAtkStr(info.hpAtkMax.hp)]}/>
                    <ColCard items={["最高攻击", this.genHpAtkStr(info.hpAtkMax.atk)]}/>
                    <ColCard items={["Lv.80血量", this.genHpAtkStr(info.hpAtk80.hp)]}/>
                    <ColCard items={["Lv.80攻击", this.genHpAtkStr(info.hpAtk80.atk)]}/>
                </Grid>
                <Grid>
                    <ColCard items={["Lv.90血量", this.genHpAtkStr(info.hpAtk90.hp)]}/>
                    <ColCard items={["Lv.90攻击", this.genHpAtkStr(info.hpAtk90.atk)]}/>
                    <ColCard items={["百级血量", this.genHpAtkStr(info.hpAtk100.hp)]}/>
                    <ColCard items={["百级攻击", this.genHpAtkStr(info.hpAtk100.atk)]}/>
                </Grid>
                <Grid>
                    <ColCard items={["蓝卡", this.genCmdCardStr(info.cardArt)]}/>
                    <ColCard items={["红卡", this.genCmdCardStr(info.cardBuster)]}/>
                    <ColCard items={["绿卡", this.genCmdCardStr(info.cardQuick)]}/>
                    <ColCard items={["Extra", this.genCmdCardStr(info.cardExtra)]}/>
                </Grid>
                <Grid>
                    <ColCard items={["出星率", info.starRate + "%"]}/>
                    <ColCard items={["被即死率", info.deathRate + "%"]}/>
                    <ColCard items={["集星权重", info.criticalWeight]}/>
                </Grid>
                <Grid>
                    <ColCard items={["蓝NP", info.npArt + "%"]}/>
                    <ColCard items={["红NP", info.npBuster + "%"]}/>
                    <ColCard items={["绿NP", info.npQuick + "%"]}/>
                    <ColCard items={["EXNP", info.npExtra + "%"]}/>
                    <ColCard items={["防NP", info.npDefence + "%"]}/>
                </Grid>
            </View>
        );
    }

    render() {
        let props = this.props as State.Props;
        let state = props.SceneServantInfo;

        let info: SvtInfoBase = state.baseInfo;
        if (MstUtil.isObjEmpty(info)) {
            return <View />;
        }

        let detail = this.renderDetail(info);

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
                    {detail}
                </Content>
                <SvtFooterTab activeIndex={SvtFooterTabIndex.Detail} svtId={state.svtId}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(ServantDetail, State.StateName, Action.Actions);