import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import {Actions} from "react-native-router-flux";
import * as Styles from "../../../view/Styles";
import {Body, Button, Container, Content, Header, Icon, Left, Picker, Right, Row, Title} from "native-base";
import {AppFooterTab, AppFooterTabIndex} from "../../../component/app_footer_tab/App";
import {ColCard, ColCardWrapper, ColR, GridLine, TextCentering} from "../../../view/View";
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
        MstLoader.instance.loadModel("MstSvtExp").then((container: BaseContainer<any>) => {
            this.setState({
                exp: (container as MstSvtExpContainer).getGroup(this._expType),
            });
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
            <Button outline small info block bordered style={StyleSheet.flatten(Styles.Common.VerticalCentering)}>
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
                <GridLine>
                    <ColCard items={["操作选择"]} backgroundColor="#CDE1F9"/>
                </GridLine>
                <GridLine>
                    <ColCardWrapper>
                        <Row>
                            <ColR size={.5} style={Styles.Common.VerticalCentering}>
                                <TextCentering>现在</TextCentering>
                            </ColR>
                            <ColR>
                                {this.renderLvPicker("现在等级", state.sourceLv,
                                    (value: string) => this.setState({sourceLv: value}))}
                            </ColR>
                            <ColR size={.5} style={Styles.Common.VerticalCentering}>
                                <TextCentering>目标</TextCentering>
                            </ColR>
                            <ColR>
                                {this.renderLvPicker("目标等级", state.targetLv,
                                    (value: string) => this.setState({targetLv: value}))}
                            </ColR>
                            <Button outline small info bordered style={{marginLeft: 5}}
                                    onPress={() => this.calcExp()}>
                                <Text>Go</Text>
                            </Button>
                        </Row>
                    </ColCardWrapper>
                </GridLine>
            </View>
        );
    }

    renderResult() {
        let state = this.state as GoalExpState;

        return (
            <View>
                <GridLine>
                    <ColCard items={["猛火需求"]} backgroundColor="#CDE1F9"/>
                </GridLine>
                <GridLine>
                    <ColCardWrapper>
                        <Row>
                            <ColR><Text>现在等级</Text></ColR>
                            <ColR><Text>{state.sourceLv}</Text></ColR>
                            <ColR><Text>目标等级</Text></ColR>
                            <ColR><Text>{state.targetLv}</Text></ColR>
                        </Row>
                        <Row>
                            <ColR><Text>同职阶</Text></ColR>
                            <ColR><Text>{state.cardCountBonus}</Text></ColR>
                            <ColR><Text>非同职阶</Text></ColR>
                            <ColR><Text>{state.cardCount}</Text></ColR>
                        </Row>
                    </ColCardWrapper>
                </GridLine>
            </View>
        );
    }

    render() {
        let state = this.state as GoalExpState;
        if (!state || !state.hasOwnProperty("exp") || !state.exp) {
            return <View/>;
        }

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => (Actions as any).pop()}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Exp Calc</Title>
                    </Body>
                    <Right />
                </Header>
                <Content scrollEnabled={false}>
                    <View style={Styles.Box.Wrapper}>
                        {this.renderCalc()}
                        {this.renderResult()}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(GoalExp, State.StateName, Action.Actions);