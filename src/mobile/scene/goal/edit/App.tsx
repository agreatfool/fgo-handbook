import React, {Component} from "react";
import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {ColCard, ColR, GridColCardWrapper, GridLine, TextCentering, ThumbnailR} from "../../../view/View";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import {defaultCurrentGoal, Goal, GoalSvt, GoalSvtSkill} from "../../../lib/model/MstGoal";
import * as LibUuid from "uuid";
import {MstSkill, MstSvt, MstSvtSkill} from "../../../../model/master/Master";
import {MstSkillContainer, MstSvtSkillContainer} from "../../../../model/impl/MstContainer";
import MstUtil from "../../../lib/utility/MstUtil";
import {Actions} from "react-native-router-flux";
import {
    ActionSheet,
    Body,
    Button,
    Container,
    Content,
    Header,
    Icon,
    Input,
    Item,
    Left,
    Right,
    Row,
    Title
} from "native-base";
import * as Styles from "../../../view/Styles";
import {AppFooterTab, AppFooterTabIndex} from "../../../component/app_footer_tab/App";
import {getMstSvt} from "../compare/App";

export * from "./State";
export * from "./Action";

interface GoalEditProps extends State.Props {
    mode: string;
    goalId: string;
    isCurrent: boolean;
}

interface GoalEditState {
    goal: Goal;
}

class GoalEdit extends Component<GoalEditProps, any> {
    private defaultProgressGoalName: string = "目标进度";

    componentDidMount() {
        let props = this.props as GoalEditProps;

        let goal = {} as Goal;
        switch (props.mode) {
            case "add":
                goal = this.createNewGoal();
                break;
            case "edit":
                goal = this.getGoalFromStore(props.goalId);
                break;
            case "extend":
                goal = this.getGoalFromStore(props.goalId);
                goal.id = LibUuid.v4();
                goal.name = this.defaultProgressGoalName;
                break;
        }

        props.actions.updateSvtIdOnEdit(props.SceneGoal.svtRawData[0].id);
        this.setState({
            goal: goal
        });
    }

    createNewGoal(): Goal {
        return {
            id: LibUuid.v4(),
            name: this.defaultProgressGoalName,
            servants: [],
        } as Goal;
    }

    getSvtInfo(svtId: number): MstSvt {
        let result = {} as MstSvt;

        let props = this.props as GoalEditProps;
        props.SceneGoal.svtRawData.forEach((svtInfo: MstSvt) => {
            if (svtInfo.id === svtId) {
                result = svtInfo;
            }
        });

        return result;
    }

    getGoalFromStore(goalId: string): Goal {
        let goal = {} as Goal;
        let props = this.props as GoalEditProps;

        if (props.isCurrent === false) {
            // 查找目标列表中的内容
            props.SceneGoal.goals.forEach((element: Goal) => {
                if (element.id === goalId) {
                    goal = MstUtil.deepCopy(element);
                }
            });
        } else {
            // 获取玩家当前状态
            if (props.SceneGoal.current) {
                goal = MstUtil.deepCopy(props.SceneGoal.current);
            } else {
                goal = this.createNewGoal();
                goal.id = goal.name = "current";
            }
        }

        return goal;
    }

    updateSkillLv(svtId: number, skillId: number, lv: number): void {
        let state = this.state as GoalEditState;

        if (lv <= 0) {
            lv = 1;
        } else if (lv > 10) {
            lv = 10;
        }

        let goal = MstUtil.deepCopy(state.goal);
        goal.servants.forEach((svt: GoalSvt, svtIndex) => {
            if (svt.svtId !== svtId) {
                return;
            }
            svt.skills.forEach((skill: GoalSvtSkill) => {
                if (skill.skillId !== skillId) {
                    return;
                }
                skill.level = lv;
            });
            goal.servants[svtIndex] = svt;
        });

        this.setState({goal: goal});
    }

    updateSvtLimit(svtId: number, limit: number): void {
        let state = this.state as GoalEditState;

        let goal = MstUtil.deepCopy(state.goal);
        goal.servants.forEach((svt: GoalSvt, svtIndex) => {
            if (svt.svtId !== svtId) {
                return;
            }
            svt.limit = limit;
            goal.servants[svtIndex] = svt;
        });

        this.setState({goal: goal});
    }

    updateGoalName(name: string): void {
        let state = this.state as GoalEditState;

        let goal = MstUtil.deepCopy(state.goal);
        goal.name = name;
        this.setState({goal: goal});
    }

    saveGoal(): void {
        let props = this.props as GoalEditProps;
        let state = this.state as GoalEditState;

        if (props.mode === "add" || props.mode === "extend") {
            props.actions.addGoal(state.goal);
        } else {
            if (props.isCurrent) {
                props.actions.updateCurrentStatus(state.goal);
            } else {
                props.actions.updateGoal(state.goal);
            }
        }
        Actions.pop();
    }

    leaveEdit(): void {
        Alert.alert(
            "需要在离开之前保存吗？",
            null,
            [
                {text: "离开", onPress: () => Actions.pop()},
                {text: "保存", onPress: () => this.saveGoal()},
            ]
        );
    }

    removeSvtFromGoal(svtId: number): void {
        let exec = () => {
            let state = this.state as GoalEditState;

            let foundPos = -1;
            state.goal.servants.forEach((svt: GoalSvt, index) => {
                if (svt.svtId === svtId) {
                    foundPos = index;
                }
            });

            if (foundPos !== -1) {
                let goal = MstUtil.deepCopy(state.goal);
                goal.servants = MstUtil.removeFromArrAtIndex(goal.servants, foundPos);
                this.setState({goal: goal});
            }
        };

        Alert.alert(
            "确定从进度中删除该从者吗？",
            null,
            [
                {text: "取消"},
                {text: "确定", onPress: () => exec()},
            ]
        );
    }

    addSvtIntoGoal(): void {
        let props = this.props as GoalEditProps;
        let state = this.state as GoalEditState;
        let svtId = props.SceneGoal.selectedSvtIdOnEdit;

        // 检查目标从者是否已存在
        let alreadyExists = false;
        state.goal.servants.forEach((svt: GoalSvt) => {
            if (svt.svtId === svtId) {
                alreadyExists = true;
            }
        });
        if (alreadyExists) {
            return;
        }

        // 构造技能数据
        let skills = this.searchMstSkillArr(svtId);
        let skillsResult = skills.map((skill: MstSkill) => {
            return {
                skillId: skill.id,
                level: 1,
            } as GoalSvtSkill
        });

        let info = this.getSvtInfo(svtId);
        let goalSvt = {
            svtId: svtId,
            limit: 0, // 灵基再临 0破
            skills: skillsResult,
            collectionNo: info.collectionNo,
            classId: info.classId,
        } as GoalSvt;

        // 更新目标
        let currentGoal = MstUtil.deepCopy(state.goal);
        currentGoal.servants.push(goalSvt);
        this.setState({goal: currentGoal});
    }

    switchSvtListPosition(startIndex: number, delta: number) {
        let state = this.state as GoalEditState;

        if (delta === 0 // no movement
            || (startIndex === 0 && delta < 0) // no lower position to swap
            || (startIndex === (state.goal.servants.length - 1) && delta > 0) // no bigger position to swap
        ) {
            return;
        }

        let targetIndex = startIndex + delta;

        // 更新目标
        let currentGoal = MstUtil.deepCopy(state.goal);
        let tmp = currentGoal.servants[startIndex];
        currentGoal.servants[startIndex] = currentGoal.servants[targetIndex];
        currentGoal.servants[targetIndex] = tmp;
        this.setState({goal: currentGoal});
    }

    searchMstSkillArr(svtId: number): Array<MstSkill> {
        let result = [] as Array<MstSkill>;

        let props = this.props as GoalEditProps;
        let svtSkillData: MstSvtSkillContainer = props.SceneGoal.svtSkillData;
        let skillData: MstSkillContainer = props.SceneGoal.skillData;

        let skills: Map<number, MstSvtSkill> = svtSkillData.getGroup(svtId);
        for (let skill of skills.values()) {
            result.push(skillData.get(skill.skillId));
        }

        return result;
    }

    showSvtLimitActionSheet(onSelect: (btnIndex: number) => void): void {
        let buttons = [
            "0破", "1破", "2破", "3破", "满破",
            "Cancel",
        ];
        ActionSheet.show(
            {
                options: buttons,
                cancelButtonIndex: buttons.length - 1,
                title: "选择灵基再临阶段"
            },
            (btnIndex) => {
                if (btnIndex === buttons.length - 1) {
                    return; // canceled
                }
                onSelect(btnIndex)
            }
        );
    }

    showSkillLvActionSheet(onSelect: (btnIndex: number) => void): void {
        let buttons = [
            "Lv.1", "Lv.2", "Lv.3", "Lv.4", "Lv.5",
            "Lv.6", "Lv.7", "Lv.8", "Lv.9", "Lv.10",
            "Cancel",
        ];
        ActionSheet.show(
            {
                options: buttons,
                cancelButtonIndex: buttons.length - 1,
                title: "选择技能等级"
            },
            (btnIndex) => {
                if (btnIndex === buttons.length - 1) {
                    return; // canceled
                }
                onSelect(btnIndex)
            }
        );
    }

    sortSvtByClass(svts: Array<GoalSvt>) {
        let sortByCollectionNo = (elemA: GoalSvt, elemB: GoalSvt) => {
            return elemB["collectionNo"] - elemA["collectionNo"];
        };
        let sortByClass = (elemA: GoalSvt, elemB: GoalSvt) => {
            return elemA["classId"] - elemB["classId"];
        };
        return svts.sort(sortByCollectionNo).sort(sortByClass);
    }

    renderTitle() {
        let props = this.props as GoalEditProps;
        let state = this.state as GoalEditState;

        let goalName = "";
        if (props.mode === "edit" && props.isCurrent) {
            goalName = defaultCurrentGoal.name;
        } else {
            goalName = state.goal.name ? state.goal.name : this.defaultProgressGoalName;
        }
        let updateName = (text) => {
            if (text === "") {
                return;
            }
            this.updateGoalName(text);
        };

        let nameEditDisabled = false;
        if (props.isCurrent) {
            nameEditDisabled = true;
        }

        return (
            <GridColCardWrapper>
                <Row>
                    <ColR size={.5} style={Styles.Common.VerticalCentering}><Text>编辑名称</Text></ColR>
                    <ColR>
                        <Item underline>
                            <Input style={{height: 24}}
                                   disabled={nameEditDisabled}
                                   placeholder="输入当前进度名称"
                                   onChange={(event) => updateName(event.nativeEvent.text)}
                                   defaultValue={goalName}
                            />
                        </Item>
                    </ColR>
                </Row>
            </GridColCardWrapper>
        );
    }

    renderServantSelect() {
        let props = this.props as GoalEditProps;

        //noinspection TypeScriptUnresolvedFunction
        return (
            <GridColCardWrapper>
                <Row>
                    <ColR size={.5} style={Styles.Common.VerticalCentering}>
                        <Text>选择目标从者</Text>
                    </ColR>
                    <ColR size={1}>
                        <Button outline small info block bordered
                                style={{marginRight: 5, justifyContent: "center"}}
                                onPress={() => (Actions as any).goal_servant_picker()}>
                            <Text>
                                {getMstSvt(props.SceneGoal.selectedSvtIdOnEdit, props.SceneGoal.svtRawData).name}
                            </Text>
                        </Button>
                    </ColR>
                    <ColR size={.3}>
                        <Button outline small info block bordered
                                style={StyleSheet.flatten(Styles.Common.VerticalCentering)}
                                onPress={() => this.addSvtIntoGoal()}>
                            <TextCentering>+</TextCentering>
                        </Button>
                    </ColR>
                </Row>
            </GridColCardWrapper>
        );
    }

    renderServantList() {
        let props = this.props as GoalEditProps;
        let state = this.state as GoalEditState;
        let appVer = props.SceneGoal.appVer;

        let view = [];

        this.sortSvtByClass(state.goal.servants).forEach((goalSvt: GoalSvt, svtIndex: number) => {
            let skills = this.searchMstSkillArr(goalSvt.svtId);
            let skillElements = [];
            skills.forEach((skill: MstSkill, index) => {
                skillElements.push(
                    <ColR key={`GoalSvt_${goalSvt.svtId}_Skill_${index}`}>
                        <TouchableOpacity
                            onPress={() => {
                                this.showSkillLvActionSheet((btnIndex) => {
                                    this.updateSkillLv(goalSvt.svtId, skill.id, btnIndex + 1)
                                });
                            }}>
                            <GridLine>
                                <Row style={Styles.Common.Centering}>
                                    <ThumbnailR small square
                                                source={{uri: MstUtil.instance.getRemoteSkillUrl(appVer, skill.iconId)}}/>
                                </Row>
                                <Row style={Styles.Common.Centering}>
                                    <TextCentering>{`Lv.${goalSvt.skills[index].level}`}</TextCentering>
                                </Row>
                            </GridLine>
                        </TouchableOpacity>
                    </ColR>
                );
            });

            view.push(
                <GridColCardWrapper key={`GoalSvt_${goalSvt.svtId}`}>
                    <Row>
                        <ColR>
                            <TouchableOpacity
                                style={Styles.Common.VerticalCentering}
                                onPress={() => {
                                    this.showSvtLimitActionSheet((btnIndex) => {
                                        this.updateSvtLimit(goalSvt.svtId, btnIndex)
                                    });
                                }}>
                                <GridLine>
                                    <Row style={Styles.Common.Centering}>
                                        <ThumbnailR small square
                                                    source={{uri: MstUtil.instance.getRemoteFaceUrl(appVer, goalSvt.svtId)}}/>
                                    </Row>
                                    <Row style={Styles.Common.Centering}>
                                        <TextCentering>{`灵.${goalSvt.limit}`}</TextCentering>
                                    </Row>
                                </GridLine>
                            </TouchableOpacity>
                        </ColR>
                        {skillElements}
                        <ColR size={.8} style={[Styles.Common.VerticalCentering, {marginRight: 5}]}>
                            <Button outline small danger block bordered
                                    onPress={() => this.removeSvtFromGoal(goalSvt.svtId)}>
                                <Text>-</Text>
                            </Button>
                        </ColR>
                        <ColR size={.8} style={[Styles.Common.VerticalCentering, {marginRight: 5}]}>
                            <Button outline small danger block bordered
                                    onPress={() => this.switchSvtListPosition(svtIndex, -1)}>
                                <Text>{"<"}</Text>
                            </Button>
                        </ColR>
                        <ColR size={.8} style={Styles.Common.VerticalCentering}>
                            <Button outline small danger block bordered
                                    onPress={() => this.switchSvtListPosition(svtIndex, 1)}>
                                <Text>{">"}</Text>
                            </Button>
                        </ColR>
                    </Row>
                </GridColCardWrapper>
            );
        });

        return view;
    }

    render() {
        if (!this.state || !this.state.hasOwnProperty("goal") || this.state["goal"] === undefined) {
            return <View />;
        }

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.leaveEdit()}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Progress Edit</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.saveGoal()}>
                            <Icon name="md-checkmark"/>
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        {this.renderTitle()}
                        {this.renderServantSelect()}
                        <GridLine key="GoalServantList">
                            <ColCard items={["从者列表"]} backgroundColor="#CDE1F9"/>
                        </GridLine>
                        {this.renderServantList()}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(GoalEdit, State.StateName, Action.Actions);