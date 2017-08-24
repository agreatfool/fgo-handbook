import React, {Component} from "react";
import {TouchableOpacity, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import MstUtil from "../../../lib/utility/MstUtil";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import {
    SvtInfoMaterial,
    SvtInfoMaterialDetail,
    SvtInfoMaterialLimit,
    SvtInfoMaterialSkill
} from "../../../lib/model/MstInfo";
import {Actions} from "react-native-router-flux";
import {Body, Button, Col, Container, Content, Grid, Header, Icon, Left, Right, Row, Title} from "native-base";
import * as Styles from "../../../view/Styles";
import {SvtFooterTab, SvtFooterTabIndex} from "../../../component/servant_footer_tab/App";
import {ColCard, ColCardWrapper, TextCentering, ThumbnailR} from "../../../view/View";

export * from "./State";
export * from "./Action";

class ServantMaterial extends Component<State.Props, any> {
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
            return this._service.buildSvtInfoMaterial(props.svtId);
        }).then((info) => {
            props.actions.updateSvtId(props.svtId);
            props.actions.updateSvtInfo({materialInfo: info});
        });
    }

    genLimitStr(index: number) {
        return `第${index}阶段`;
    }

    genItemCountStr(count: number) {
        return `x${count}`;
    }

    genQpStr(qp: number) {
        return `${qp / 10000}万QP`;
    }

    genSkillStr(index: number) {
        return `Lv.${index}\n->\nLv.${index + 1}`;
    }

    selectItem(itemId: number) {
        //noinspection TypeScriptUnresolvedFunction
        (Actions as any).goal_item_requirement({
            itemId: itemId
        });
    }

    renderCommon(elements: Array<SvtInfoMaterialLimit | SvtInfoMaterialSkill>, title: string, subTitleRender: Function) {
        let result = [];
        const CELL_COUNT = 4;

        let loopBase = elements;
        if (loopBase.length < 9) {
            // 这是一个灵基再临数据结构，需要删除最后的圣杯再临数据；P.S 技能只有9个升级项，故此按9判断
            loopBase = loopBase.slice(0, 4);
        }

        loopBase.forEach((element: SvtInfoMaterialLimit | SvtInfoMaterialSkill, index) => {
            let materials = [];

            element.items.forEach((item: SvtInfoMaterialDetail, index) => {
                materials.push(
                    <Col key={`ElementCell_${index}`}>
                        <Row style={Styles.Common.Centering}>
                            <Col>
                                <TouchableOpacity onPress={() => this.selectItem(item.itemId)}>
                                    <ThumbnailR small square
                                                source={{uri: MstUtil.instance.getRemoteItemUrl(this._appVer, item.itemId)}}/>
                                </TouchableOpacity>
                            </Col>
                            <Col>
                                <TextCentering>{this.genItemCountStr(item.count)}</TextCentering>
                            </Col>
                        </Row>
                    </Col>
                );
            });
            materials.push(
                <Col key={`ElementQP_${index}`} style={Styles.Common.Centering}>
                    <TextCentering>{this.genQpStr(element.qp)}</TextCentering>
                </Col>
            );
            if (materials.length < CELL_COUNT) {
                let appendCount = CELL_COUNT - materials.length;
                for (let loop = 0; loop < appendCount; loop++) {
                    materials.push(<Col key={`ElementPH_${index}_${loop}`}/>);
                }
            }

            result.push(
                <Row key={`Element_${index}`}>
                    <ColCard size={.3} items={[subTitleRender(index + 1)]} rowHeight={36}/>
                    <ColCardWrapper>
                        {materials}
                    </ColCardWrapper>
                </Row>
            )
        });

        return (
            <View>
                <Grid>
                    <ColCard items={[title]} backgroundColor="#CDE1F9"/>
                </Grid>
                <Grid>
                    {result}
                </Grid>
            </View>
        );
    }

    renderLimit(elements: Array<SvtInfoMaterialLimit>) {
        return this.renderCommon(elements, "灵基再临", this.genLimitStr);
    }

    renderSkill(elements: Array<SvtInfoMaterialSkill>) {
        return this.renderCommon(elements, "技能强化", this.genSkillStr);
    }

    render() {
        let props = this.props as State.Props;
        let state = props.SceneServantInfo;
        let info: SvtInfoMaterial = state.materialInfo;
        if (MstUtil.isObjEmpty(info)) {
            return <View />;
        }

        let limit = this.renderLimit(info.limit);
        let skill = this.renderSkill(info.skill);

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
                        {limit}
                        {skill}
                    </View>
                </Content>
                <SvtFooterTab activeIndex={SvtFooterTabIndex.Material} svtId={state.svtId}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(ServantMaterial, State.StateName, Action.Actions);