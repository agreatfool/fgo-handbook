import React, {Component} from "react";
import {Text, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import {CardWithRows, ContainerWhite} from "../../../view/View";
import {SvtInfoBase, SvtInfoBaseCardInfo} from "../../../lib/model/MstInfo";
import MstUtil from "../../../lib/utility/MstUtil";
import Const from "../../../lib/const/Const";
import {Body, Button, Col, Container, Content, Grid, Header, Icon, Left, Right, Thumbnail, Title} from "native-base";
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
        let state = props.navigation.state.params as State.NavState;

        MstUtil.instance.getAppVer().then((appVer) => {
            this._appVer = appVer;
            return this._service.buildSvtInfoBase(state.svtId);
        }).then((info: SvtInfoBase) => {
            props.actions.updateSvtId(state.svtId);
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
                        <Thumbnail square source={{uri: MstUtil.instance.getRemoteFaceUrl(this._appVer, info.svtId)}}/>
                    </Col>
                    <CardWithRows items={["图鉴编号", info.collectionNo]}/>
                    <CardWithRows items={["星级", <Text style={Styles.Common.Star}>{info.rarity}</Text>]}/>
                    <CardWithRows items={["名称", info.name]}/>
                </Grid>
                <Grid>
                    <CardWithRows items={["职阶", info.className]}/>
                    <CardWithRows items={["分类", info.classification]}/>
                    <CardWithRows items={["属性", info.policy]}/>
                    <CardWithRows items={["性别", info.gender]}/>
                </Grid>
                <Grid>
                    <CardWithRows items={["特性", info.individuality.join(", ")]}/>
                </Grid>
                <Grid>
                    <CardWithRows items={["从者编号", info.svtId]}/>
                    <CardWithRows items={["最高等级", info.maxLevel]}/>
                    <CardWithRows items={["职阶攻击补正", info.attackRate + "%"]}/>
                </Grid>
                <Grid>
                    <CardWithRows items={["力量", info.powerRank.display]}/>
                    <CardWithRows items={["防御", info.defenseRank.display]}/>
                    <CardWithRows items={["敏捷", info.agilityRank.display]}/>
                    <CardWithRows items={["魔力", info.magicRank.display]}/>
                    <CardWithRows items={["幸运", info.luckRank.display]}/>
                    <CardWithRows items={["宝具", info.treasureRank.display]}/>
                </Grid>
                <Grid>
                    <CardWithRows items={["最高血量", this.genHpAtkStr(info.hpAtkMax.hp)]}/>
                    <CardWithRows items={["最高攻击", this.genHpAtkStr(info.hpAtkMax.atk)]}/>
                    <CardWithRows items={["四星血量", this.genHpAtkStr(info.hpAtk80.hp)]}/>
                    <CardWithRows items={["四星攻击", this.genHpAtkStr(info.hpAtk80.atk)]}/>
                </Grid>
                <Grid>
                    <CardWithRows items={["五星血量", this.genHpAtkStr(info.hpAtk90.hp)]}/>
                    <CardWithRows items={["五星攻击", this.genHpAtkStr(info.hpAtk90.atk)]}/>
                    <CardWithRows items={["百级血量", this.genHpAtkStr(info.hpAtk100.hp)]}/>
                    <CardWithRows items={["百级攻击", this.genHpAtkStr(info.hpAtk100.atk)]}/>
                </Grid>
                <Grid>
                    <CardWithRows items={["蓝卡", this.genCmdCardStr(info.cardArt)]}/>
                    <CardWithRows items={["红卡", this.genCmdCardStr(info.cardBuster)]}/>
                    <CardWithRows items={["绿卡", this.genCmdCardStr(info.cardQuick)]}/>
                    <CardWithRows items={["Extra", this.genCmdCardStr(info.cardExtra)]}/>
                </Grid>
                <Grid>
                    <CardWithRows items={["出星率", info.starRate + "%"]}/>
                    <CardWithRows items={["被即死率", info.deathRate + "%"]}/>
                    <CardWithRows items={["集星权重", info.criticalWeight]}/>
                </Grid>
                <Grid>
                    <CardWithRows items={["蓝NP", info.npArt + "%"]}/>
                    <CardWithRows items={["红NP", info.npBuster + "%"]}/>
                    <CardWithRows items={["绿NP", info.npQuick + "%"]}/>
                    <CardWithRows items={["EXNP", info.npExtra + "%"]}/>
                    <CardWithRows items={["防NP", info.npDefence + "%"]}/>
                </Grid>
            </View>
        );
    }

    render() {
        let props = this.props as State.Props;
        let state = props.SceneServantInfo as State.State;

        let info: SvtInfoBase = state.baseInfo;
        if (MstUtil.isObjEmpty(info)) {
            return <View/>;
        }

        let detail = this.renderDetail(info);

        return (
            <ContainerWhite>
                <Header>
                    <Left>
                        <Button transparent onPress={() => props.navigation.goBack(null)}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>{state.title}</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    {detail}
                </Content>
                <SvtFooterTab activeIndex={SvtFooterTabIndex.Detail} svtId={state.svtId} navigation={props.navigation}/>
            </ContainerWhite>
        );
    }
}

export const App = injectIntoComponent(ServantDetail, State.StateName, Action.Actions);