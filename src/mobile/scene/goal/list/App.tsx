import React, {Component} from "react";
import {Alert, StyleSheet, Text, View} from "react-native";
import {CardWithRButton, CardWithRows, ContainerWhite, GridCardWrapper, TextCentering} from "../../../view/View";
import injectIntoComponent from "../../../../lib/react/Connect";
import MstLoader from "../../../lib/model/MstLoader";
import * as State from "./State";
import * as Action from "./Action";
import MstUtil from "../../../lib/utility/MstUtil";
import * as MstService from "../../../service/MstService";
import {MstSvt} from "../../../../model/master/Master";
import {
    MstCombineLimitContainer,
    MstCombineSkillContainer,
    MstSkillContainer,
    MstSvtSkillContainer
} from "../../../../model/impl/MstContainer";
import {
    Body,
    Button,
    Card,
    CardItem,
    Col,
    Container,
    Content,
    Grid,
    Header,
    Icon,
    Left,
    Picker,
    Right,
    Row,
    Title,
    Toast
} from "native-base";
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
    private _service: MstService.Service;

    constructor(props, context) {
        super(props, context);
        this._service = new MstService.Service();
    }

    componentWillMount() {
        let props = this.props as State.Props;

        let svtRawData: Array<MstSvt> = this._service.loadSvtRawDataConverted();
        let svtSkillData = MstLoader.instance.loadModel("MstSvtSkill") as MstSvtSkillContainer;
        let skillCombineData = MstLoader.instance.loadModel("MstCombineSkill") as MstCombineSkillContainer;
        let limitCombineData = MstLoader.instance.loadModel("MstCombineLimit") as MstCombineLimitContainer;
        let skillData = MstLoader.instance.loadModel("MstSkill") as MstSkillContainer;
        let visibleItems = [];

        let items = MstLoader.instance.loadVisibleItemList();
        let clonedItems = MstUtil.deepCopy(items);
        this._service.sortCompareResItems(items, clonedItems);
        visibleItems = items;

        MstLoader.instance.loadGoal().then((data: State.State) => {
            data.appVer = MstLoader.instance.getAppVer();
            data.svtRawData = svtRawData;
            data.svtSkillData = svtSkillData;
            data.skillCombineData = skillCombineData;
            data.limitCombineData = limitCombineData;
            data.skillData = skillData;
            data.visibleItems = visibleItems;
            data.selectedSvtIdsOnEdit = [];
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
            <GridCardWrapper>
                <Row style={{marginTop: 10, marginLeft: 10, marginRight: 10}}>
                    <Col size={.5} style={Styles.Common.VerticalCentering}>
                        <Text>选择进度比较</Text>
                    </Col>
                </Row>
                <Row style={{marginTop: 10, marginBottom: 10, marginLeft: 10, marginRight: 10}}>
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
                                props.navigation.navigate("GoalCompare", {
                                    sourceId: state.compareSourceId,
                                    targetId: state.compareTargetId
                                });
                            }}>
                        <Text>Go</Text>
                    </Button>
                </Row>
            </GridCardWrapper>
        );
    }

    renderGoalList() {
        let props = this.props as State.Props;
        let state = props.SceneGoal;

        let goals: Array<Goal> = state.goals;
        if (!goals || goals.length === 0) {
            return <View/>;
        }

        let goalList = [];
        goals.forEach((goal: Goal, index) => {
            //noinspection TypeScriptUnresolvedFunction
            goalList.push(
                <Row key={`Goal_${index}`}>
                    <GridCardWrapper>
                        <Row style={{marginTop: 5, marginBottom: 5, marginLeft: 10, marginRight: 10}}>
                            <Col size={1.2} style={Styles.Common.VerticalCentering}>
                                <Text>{goal.name}</Text>
                            </Col>
                            <Col size={.8} style={Styles.Common.VerticalCentering}>
                                <Text>{`从者 ${this.genItemCountStr(goal.servants.length)}`}</Text>
                            </Col>
                            <Col size={.9}>
                                <Button small info block bordered
                                        style={{marginLeft: 5}}
                                        onPress={() => props.navigation.navigate("GoalEdit", {
                                            mode: "edit", isCurrent: false, goalId: goal.id
                                        })}>
                                    <Text>编辑</Text>
                                </Button>
                            </Col>
                            <Col size={.9}>
                                <Button small success block bordered
                                        style={{marginLeft: 5}}
                                        onPress={() => props.navigation.navigate("GoalEdit", {
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
                    </GridCardWrapper>
                </Row>
            );
        });

        return (
            <Grid>
                {goalList}
            </Grid>
        );
    }

    render() {
        let props = this.props as State.Props;

        return (
            <ContainerWhite>
                <Header>
                    <Left>
                        <Button transparent onPress={() => props.navigation.goBack(null)}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>Progress List</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        <CardWithRButton
                            title="经验计算器"
                            buttons={["Go"]}
                            onPress={[() => props.navigation.navigate("GoalExp")]}/>
                        <CardWithRButton
                            title="按道具浏览需求"
                            buttons={["Go"]}
                            onPress={[() => props.navigation.navigate("GoalItemPicker")]}/>
                        <CardWithRButton
                            title="编辑当前进度"
                            buttons={["Extend", "Go"]}
                            onPress={[
                                () => props.navigation.navigate("GoalEdit", {
                                    mode: "extend", isCurrent: true, goalId: defaultCurrentGoal.id
                                }),
                                () => props.navigation.navigate("GoalEdit", {
                                    mode: "edit", isCurrent: true, goalId: undefined
                                })
                            ]}/>
                        <CardWithRButton
                            title="添加新进度目标"
                            buttons={["Go"]}
                            onPress={[() => props.navigation.navigate("GoalEdit", {
                                mode: "add", isCurrent: false, goalId: undefined
                            })]}/>
                        {this.renderCompareButton()}
                        <CardWithRows key="GoalServantList" items={["进度列表"]} backgroundColor="#CDE1F9"/>
                        {this.renderGoalList()}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress} navigation={props.navigation}/>
            </ContainerWhite>
        );
    }
}

export const App = injectIntoComponent(GoalList, State.StateName, Action.Actions);