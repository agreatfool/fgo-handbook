import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import * as Styles from "../../../view/Styles";
import {Body, Button, Col, Container, Content, Grid, Header, Icon, Left, Picker, Right, Row, Title} from "native-base";
import {AppFooterTab, AppFooterTabIndex} from "../../../component/app_footer_tab/App";
import {CardWithRows, ContainerWhite, GridCardWrapper, TextCentering} from "../../../view/View";
import {MstSvtExpContainer} from "../../../../model/impl/MstContainer";
import MstLoader from "../../../lib/model/MstLoader";
import {MstSvtExp} from "../../../../model/master/Master";
import BaseContainer from "../../../../lib/container/base/BaseContainer";

export * from "./State";
export * from "./Action";

interface GoalExpState {
    exp: Map<number, MstSvtExp>;
    sourceLv: string;
    targetLv: string;
    cardCountBonus: number;
    cardCount: number;
}

class GoalExp extends Component<State.Props, any> {
    private _expType: number = 5; // expType是用来描述成长曲线的，和exp本身是没有关系的，所有从者的exp需求都一致，这里用青王的type
    private _fireExpBonus: number = 32400; // 职阶符合; 这里只用猛火作为计算单位，只有猛火有实际使用意义
    private _fireExp: number = 27000; // 职阶不符

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        let container: BaseContainer<any> = MstLoader.instance.loadModel("MstSvtExp");

        this.setState({
            exp: (container as MstSvtExpContainer).getGroup(this._expType),
        });

        this.setState({
            sourceLv: "1",
            targetLv: "1",
            cardCountBonus: 0,
            cardCount: 0,
        });
    }

    calcExp() {
        let state = this.state as GoalExpState;
        let sourceLv = parseInt(state.sourceLv);
        let targetLv = parseInt(state.targetLv);

        if (targetLv <= sourceLv) {
            return; // no need to calc
        }

        let sourceExp = state.exp.get(sourceLv - 1);
        let targetExp = state.exp.get(targetLv - 1);
        let exp = targetExp.exp - sourceExp.exp;

        this.setState({
            cardCountBonus: this.calcExpCardRequirement(exp, true),
            cardCount: this.calcExpCardRequirement(exp, false),
        });
    }

    calcExpCardRequirement(exp: number, hasBonus: boolean) {
        let cardExp = this._fireExp;
        if (hasBonus) {
            cardExp = this._fireExpBonus;
        }

        return Math.ceil(exp / cardExp);
    }

    renderLvPicker(header: string, selectedValue: string, onChange: (value: string) => void) {
        let pickerItems = [];
        for (let index = 100; index >= 1; index--) {
            pickerItems.push(<Picker.Item key={`PickerItem_${header}_${index}`}
                                          label={`${index}`}
                                          value={index}/>);
        }

        return (
            <Button small info block bordered style={StyleSheet.flatten(Styles.Common.VerticalCentering)}>
                <Picker
                    iosHeader={header}
                    mode="dropdown"
                    textStyle={{fontSize: 14}}
                    selectedValue={selectedValue}
                    onValueChange={(value: string) => onChange(value)}>
                    {pickerItems}
                </Picker>
            </Button>
        );
    }

    renderCalc() {
        let state = this.state as GoalExpState;

        return (
            <View>
                <CardWithRows items={["操作选择"]} backgroundColor="#CDE1F9"/>
                <GridCardWrapper>
                    <Row style={{marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5}}>
                        <Col size={.5} style={Styles.Common.VerticalCentering}>
                            <TextCentering>现在</TextCentering>
                        </Col>
                        <Col>
                            {this.renderLvPicker("现在等级", state.sourceLv,
                                (value: string) => this.setState({sourceLv: value}))}
                        </Col>
                        <Col size={.5} style={Styles.Common.VerticalCentering}>
                            <TextCentering>目标</TextCentering>
                        </Col>
                        <Col>
                            {this.renderLvPicker("目标等级", state.targetLv,
                                (value: string) => this.setState({targetLv: value}))}
                        </Col>
                        <Button small info bordered style={{marginLeft: 5}}
                                onPress={() => this.calcExp()}>
                            <Text>Go</Text>
                        </Button>
                    </Row>
                </GridCardWrapper>
            </View>
        );
    }

    renderResult() {
        let state = this.state as GoalExpState;

        return (
            <View>
                <CardWithRows items={["猛火需求"]} backgroundColor="#CDE1F9"/>
                <GridCardWrapper>
                    <Col style={{marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5}}>
                        <Row>
                            <Col><Text>现在等级</Text></Col>
                            <Col><Text>{state.sourceLv}</Text></Col>
                            <Col><Text>目标等级</Text></Col>
                            <Col><Text>{state.targetLv}</Text></Col>
                        </Row>
                        <Row>
                            <Col><Text>同职阶</Text></Col>
                            <Col><Text>{state.cardCountBonus}</Text></Col>
                            <Col><Text>非同职阶</Text></Col>
                            <Col><Text>{state.cardCount}</Text></Col>
                        </Row>
                    </Col>
                </GridCardWrapper>
            </View>
        );
    }

    render() {
        let props = this.props as State.Props;
        let state = this.state as GoalExpState;
        if (!state || !state.hasOwnProperty("exp") || !state.exp) {
            return <View/>;
        }

        return (
            <ContainerWhite>
                <Header>
                    <Left>
                        <Button transparent onPress={() => props.navigation.goBack(null)}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>Exp Calc</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        {this.renderCalc()}
                        {this.renderResult()}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress} navigation={props.navigation}/>
            </ContainerWhite>
        );
    }
}

export const App = injectIntoComponent(GoalExp, State.StateName, Action.Actions);