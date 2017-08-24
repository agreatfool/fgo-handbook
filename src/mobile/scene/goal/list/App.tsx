import React, {Component} from "react";
import {Alert, StyleSheet, Text, View} from "react-native";
import {ColCard, ColCardWithRightButton, ColCardWrapper, GridLine, TextCentering} from "../../../view/View";
import injectIntoComponent from "../../../../lib/react/Connect";
import MstLoader from "../../../lib/model/MstLoader";
import * as State from "./State";
import * as Action from "./Action";
import MstUtil from "../../../lib/utility/MstUtil";
import * as MstService from "../../../service/MstService";
import {MstItem, MstSvt} from "../../../../model/master/Master";
import BaseContainer from "../../../../lib/container/base/BaseContainer";
import {
    MstCombineLimitContainer,
    MstCombineSkillContainer,
    MstSkillContainer,
    MstSvtSkillContainer
} from "../../../../model/impl/MstContainer";
import {Actions} from "react-native-router-flux";
import {Body, Button, Col, Container, Content, Header, Icon, Left, Picker, Right, Row, Title, Toast} from "native-base";
import * as Styles from "../../../view/Styles";
import {AppFooterTab, AppFooterTabIndex} from "../../../component/app_footer_tab/App";
import {defaultCurrentGoal, Goal} from "../../../lib/model/MstGoal";

export * from "./State";
export * from "./Action";

interface GoalListState {
    compareSourceId: string; // UUID of one Goal
    compareTargetId: string; // UUID of one Goal
}

class GoalList extends Component<State.Props, any> {
    private _appVer: string;
    private _service: MstService.Service;

    constructor(props, context) {
        super(props, context);
        this._service = new MstService.Service();
    }

    componentWillMount() {
        let props = this.props as State.Props;

        let svtRawData = [];
        let svtSkillData = null;
        let skillCombineData = null;
        let limitCombineData = null;
        let skillData = null;
        let visibleItems = [];
        MstUtil.instance.getAppVer().then((appVer) => {
            this._appVer = appVer;
            return this._service.loadSvtRawDataConverted();
        }).then((rawData: Array<MstSvt>) => {
            svtRawData = rawData;
            return MstLoader.instance.loadModel("MstSvtSkill");
        }).then((container: BaseContainer<any>) => {
            svtSkillData = container as MstSvtSkillContainer;
            return MstLoader.instance.loadModel("MstCombineSkill");
        }).then((container: BaseContainer<any>) => {
            skillCombineData = container as MstCombineSkillContainer;
            return MstLoader.instance.loadModel("MstCombineLimit");
        }).then((container: BaseContainer<any>) => {
            limitCombineData = container as MstCombineLimitContainer;
            return MstLoader.instance.loadModel("MstSkill");
        }).then((container: BaseContainer<any>) => {
            skillData = container as MstSkillContainer;
            return MstLoader.instance.loadVisibleItemList();
        }).then((items: Array<MstItem>) => {
            let clonedItems = JSON.parse(JSON.stringify(items));
            this._service.sortCompareResItems(items, clonedItems);
            visibleItems = items;
            return MstLoader.instance.loadGoal();
        }).then((data: State.State) => {
            data.appVer = this._appVer;
            data.svtRawData = svtRawData;
            data.svtSkillData = svtSkillData;
            data.skillCombineData = skillCombineData;
            data.limitCombineData = limitCombineData;
            data.skillData = skillData;
            data.visibleItems = visibleItems;
            data.compareResult = undefined;
            props.actions.updateAll(data);

            if (data.goals && data.goals.length > 0) {
                this.setState({
                    compareTargetId: (data.goals[0] as Goal).id,
                });
            }
        });

        this.setState({
            compareSourceId: defaultCurrentGoal.id,
            compareTargetId: defaultCurrentGoal.id,
        });
    }

    genItemCountStr(count: number) {
        return `x${count}`;
    }

    renderGoalsPicker(header: string, goals: Array<Goal>, selectedValue: string, onChange: (value: string) => void) {
        let props = this.props as State.Props;
        let state = props.SceneGoal;

        let pickerGoalItems = [
            <Picker.Item key={`PickerItem_${header}_Current`} label={state.current.name} value={state.current.id}/>
        ];
        goals.forEach((goal: Goal, index) => {
            pickerGoalItems.push(<Picker.Item key={`PickerItem_${header}_${index}`} label={goal.name}
                                              value={goal.id}/>);
        });

        return (
            <Button small info block bordered style={StyleSheet.flatten(Styles.Common.VerticalCentering)}>
                <Picker
                    iosHeader={header}
                    mode="dropdown"
                    textStyle={{fontSize: 14}}
                    selectedValue={selectedValue}
                    onValueChange={(value: string) => onChange(value)}>
                    {pickerGoalItems}
                </Picker>
            </Button>
        );
    }

    renderCompareButton() {
        let props = this.props as State.Props;
        let state = this.state as GoalListState;

        let goals: Array<Goal> = props.SceneGoal.goals;
        let buttons = [];
        buttons.push(
            <Col key="CompareSource">
                {this.renderGoalsPicker(
                    "选择比对源", goals, state.compareSourceId,
                    (value: string) => this.setState({compareSourceId: value}))}
            </Col>
        );
        buttons.push(
            <Col key="CompareVS" size={.2} style={Styles.Common.VerticalCentering}>
                <TextCentering>VS</TextCentering>
            </Col>
        );
        buttons.push(
            <Col key="CompareTarget">
                {this.renderGoalsPicker(
                    "选择比对目标", goals, state.compareTargetId,
                    (value: string) => this.setState({compareTargetId: value}))}
            </Col>
        );

        return (
            <GridLine>
                <ColCardWrapper>
                    <Row>
                        <Col size={.5} style={Styles.Common.VerticalCentering}>
                            <Text>选择进度比较</Text>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 10}}>
                        {buttons}
                        <Button small info bordered style={{marginLeft: 5}}
                                onPress={() => {
                                    if (state.compareSourceId === state.compareTargetId) {
                                        Toast.show({
                                            text: "比对双方不得为同一个进度！",
                                            position: "bottom",
                                            buttonText: "OK",
                                            type: "warning",
                                            duration: 3000
                                        });
                                        return;
                                    }
                                    //noinspection TypeScriptUnresolvedFunction
                                    (Actions as any).goal_compare({
                                        sourceId: state.compareSourceId,
                                        targetId: state.compareTargetId
                                    });
                                }}>
                            <Text>Go</Text>
                        </Button>
                    </Row>
                </ColCardWrapper>
            </GridLine>
        );
    }

    renderGoalList() {
        let props = this.props as State.Props;
        let state = props.SceneGoal;

        let goals: Array<Goal> = state.goals;
        if (!goals || goals.length === 0) {
            return <View />;
        }

        let goalList = [];
        goals.forEach((goal: Goal, index) => {
            //noinspection TypeScriptUnresolvedFunction
            goalList.push(
                <Row key={`Goal_${index}`}>
                    <ColCardWrapper>
                        <Row>
                            <Col size={1.2} style={Styles.Common.VerticalCentering}>
                                <Text>{goal.name}</Text>
                            </Col>
                            <Col size={.8} style={Styles.Common.VerticalCentering}>
                                <Text>{`从者 ${this.genItemCountStr(goal.servants.length)}`}</Text>
                            </Col>
                            <Col size={.9}>
                                <Button small info block bordered
                                        style={{marginLeft: 5}}
                                        onPress={() => (Actions as any).goal_edit({
                                            mode: "edit", isCurrent: false, goalId: goal.id
                                        })}>
                                    <Text>编辑</Text>
                                </Button>
                            </Col>
                            <Col size={.9}>
                                <Button small success block bordered
                                        style={{marginLeft: 5}}
                                        onPress={() => (Actions as any).goal_edit({
                                            mode: "extend", isCurrent: false, goalId: goal.id
                                        })}>
                                    <Text>扩展</Text>
                                </Button>
                            </Col>
                            <Col size={.9}>
                                <Button small danger block bordered
                                        style={{marginLeft: 5}}
                                        onPress={() => {
                                            Alert.alert(
                                                "确定要删除该进度吗？",
                                                null,
                                                [
                                                    {text: "取消"},
                                                    {text: "删除", onPress: () => props.actions.deleteGoal(goal.id)},
                                                ]
                                            );
                                        }}>
                                    <Text>删除</Text>
                                </Button>
                            </Col>
                        </Row>
                    </ColCardWrapper>
                </Row>
            );
        });

        return (
            <GridLine>
                {goalList}
            </GridLine>
        );
    }

    render() {
        //noinspection TypeScriptUnresolvedFunction
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => (Actions as any).pop()}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>Progress List</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        <GridLine>
                            <ColCardWithRightButton
                                title="经验计算器"
                                button="Go"
                                onPress={() => (Actions as any).goal_exp()}/>
                        </GridLine>
                        <GridLine>
                            <ColCardWithRightButton
                                title="按道具浏览需求"
                                button="Go"
                                onPress={() => (Actions as any).goal_item_picker()}/>
                        </GridLine>
                        <GridLine>
                            <ColCardWrapper>
                                <Row>
                                    <Col style={Styles.Common.VerticalCentering}>
                                        <Text>编辑当前进度</Text>
                                    </Col>
                                    <Col size={.4} style={[Styles.Common.VerticalCentering, {
                                        marginRight: 5,
                                        alignItems: "flex-end"
                                    }]}>
                                        <Button small block info bordered
                                                onPress={() => (Actions as any).goal_edit({
                                                    mode: "extend", isCurrent: true, goalId: defaultCurrentGoal.id
                                                })}>
                                            <Text>Extend</Text>
                                        </Button>
                                    </Col>
                                    <Col size={.4} style={[Styles.Common.VerticalCentering, {alignItems: "flex-end"}]}>
                                        <Button small block info bordered
                                                onPress={() => (Actions as any).goal_edit({
                                                    mode: "edit", isCurrent: true, goalId: undefined
                                                })}>
                                            <Text>Go</Text>
                                        </Button>
                                    </Col>
                                </Row>
                            </ColCardWrapper>
                        </GridLine>
                        <GridLine>
                            <ColCardWithRightButton
                                title="添加新进度目标"
                                button="Go"
                                onPress={() => (Actions as any).goal_edit({
                                    mode: "add", isCurrent: false, goalId: undefined
                                })}/>
                        </GridLine>
                        {this.renderCompareButton()}
                        <GridLine key="GoalServantList">
                            <ColCard items={["进度列表"]} backgroundColor="#CDE1F9"/>
                        </GridLine>
                        {this.renderGoalList()}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(GoalList, State.StateName, Action.Actions);