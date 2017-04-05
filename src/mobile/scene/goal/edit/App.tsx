import React, {Component} from "react";
import {View, Text, Picker, ViewStyle, TouchableOpacity, TextInput, Alert} from "react-native";
import * as Renderer from "../../../view/View";
import {ToolBoxWrapper, TabScene, TabPageScroll, Table, ResImage, ResImageWithElement} from "../../../view/View";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import {Goal, GoalSvt, GoalSvtSkill} from "../../../lib/model/MstGoal";
import * as LibUuid from "uuid";
import {MstSvt, MstSkill, MstSvtSkill} from "../../../../model/master/Master";
import {MstSvtSkillContainer, MstSkillContainer} from "../../../../model/impl/MstContainer";
import * as Styles from "../../../view/Styles";
import MstUtil from "../../../lib/utility/MstUtil";

export * from "./State";
export * from "./Action";

interface GoalEditProps extends State.Props {
    mode: string;
    goalId: string;
    isCurrent: boolean;
}

interface GoalEditState {
    selectedSvtId: number;
    goal: Goal;
}

class GoalEdit extends Component<GoalEditProps, any> {
    componentDidMount() {
        let props = this.props as GoalEditProps;

        let currentGoal = {} as Goal;
        if (props.mode === "add") {
            currentGoal = this.createNewGoal();
        } else {
            currentGoal = this.getGoalFromStore(props.goalId);
        }

        this.setState({
            selectedSvtId: props.SceneGoal.svtRawData[0].id,
            goal: currentGoal
        });
    }

    createNewGoal(): Goal {
        return {
            id: LibUuid.v4(),
            name: "",
            servants: [],
        } as Goal;
    }

    getGoalFromStore(goalId: string): Goal {
        let goal = {} as Goal;
        let props = this.props as GoalEditProps;

        if (props.isCurrent === false) {
            // 查找目标列表中的内容
            props.SceneGoal.goals.forEach((element: Goal) => {
                if (element.id === goalId) {
                    goal = Object.assign({}, element);
                }
            });
        } else {
            // 获取玩家当前状态
            goal = Object.assign({}, props.SceneGoal.current);
        }

        return goal;
    }

    updateSkillLv(svtId: number, skillId: number, lv: number): void {
        let state = this.state as GoalEditState;

        let goal = Object.assign({}, state.goal);
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

    updateGoalName(name: string): void {
        let state = this.state as GoalEditState;

        let goal = Object.assign({}, state.goal);
        goal.name = name;
        this.setState({goal: goal});
    }

    //TODO:
    // 2. saveGoal实现；需要检查database文件的创建和修改是否正确
    // 3. 点击从者头像删除从者数据
    // 4. ResImgTextInputAppend样式优化
    // 5. 所有按钮上的文字，需要检查，部分应该按模式会有变化
    saveGoal(): void {

    }

    genServantLine(goalSvt: GoalSvt) {
        let props = this.props as GoalEditProps;
        let appVer = props.SceneGoal.appVer;

        let skills = this.searchMstSkillArr(goalSvt.svtId);

        let skillElements = [];
        skills.forEach((skill: MstSkill, index) => {
            skillElements.push(
                <ResImageWithElement appVer={appVer}
                                     type="skill"
                                     size="small"
                                     width={110}
                                     id={skill.iconId}>
                    <ResImgSvtSkillLvInput
                        value={`${goalSvt.skills[index].level}`}
                        onEndingEditing={(text) => {
                            this.updateSkillLv(goalSvt.svtId, goalSvt.skills[index].skillId, parseInt(text));
                        }}
                    />
                </ResImageWithElement>
            );
        });

        return [
            <TouchableOpacity onPress={() => this.removeSvtFromGoal(goalSvt.svtId)}>
                <ResImageWithElement appVer={appVer}
                                     type="face"
                                     size="small"
                                     width={55}
                                     text="  "
                                     id={goalSvt.svtId}/>
            </TouchableOpacity>,
            ...skillElements
        ];
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
                let goal = Object.assign({}, state.goal);
                goal.servants = MstUtil.removeFromArrAtIndex(goal.servants, foundPos);
                this.setState({goal: goal});
            }
        };

        Alert.alert(
            "确定从目标中删除从者信息吗？",
            null,
            [
                {text: "取消"},
                {text: "确定", onPress: () => exec()},
            ]
        );
    }

    addSvtIntoGoal(): void {
        let state = this.state as GoalEditState;
        let svtId = state.selectedSvtId;

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

        let goalSvt = {
            svtId: svtId,
            skills: skillsResult,
        } as GoalSvt;

        // 更新目标
        let currentGoal = Object.assign({}, state.goal);
        currentGoal.servants.push(goalSvt);
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

    prepareData() {
        let props = this.props as GoalEditProps;
        let state = this.state as GoalEditState;

        let columnName = Renderer.buildColumnData("编辑目标名称", []);
        columnName.rows.push([
            <GoalNameInput
                value={state.goal.name ? state.goal.name : "目标"}
                onEndingEditing={(text) => {
                    this.updateGoalName(text);
                }}
            />
        ]);

        let columnServant = Renderer.buildColumnData("编辑从者目标", []);
        state.goal.servants.forEach((goalSvt: GoalSvt) => {
            columnServant.rows.push(this.genServantLine(goalSvt));
        });

        let columnAddServant = Renderer.buildColumnData("添加从者目标", []);
        columnAddServant.rows.push([
                <ServantListDropdown
                    svtRawData={props.SceneGoal.svtRawData}
                    selectedSvtId={state.selectedSvtId}
                    onValueChange={(svtId) => this.setState({selectedSvtId: svtId})}
                />
            ],
            [
                <TableLineButton onPress={() => this.addSvtIntoGoal()}>
                    添加目标
                </TableLineButton>
            ]);

        return [[columnName], [columnServant], [columnAddServant]];
    }

    render() {
        if (!this.state || !this.state.hasOwnProperty("goal") || this.state["goal"] === undefined) {
            return <View />;
        }

        return (
            <TabScene>
                <ToolBoxWrapper
                    pageName="GoalEdit"
                    buttons={[
                        {content: "保存改动", onPress: () => this.saveGoal()},
                    ]}
                />
                <TabPageScroll>
                    <Table pageName="GoalEdit" data={this.prepareData()}/>
                </TabPageScroll>
            </TabScene>
        );
    }
}

class GoalNameInput extends Component<TextInputProps, any> {
    render() {
        let props = this.props as TextInputProps;
        return (
            <TextInput
                style={[{flex: 1, textAlign: "center", width: 392}, Styles.Tab.tabBar]}
                onEndEditing={(event) => props.onEndingEditing(event.nativeEvent.text)}
                defaultValue={props.value}
                multiline={false}
                editable={true}
                maxLength={20}
            />
        );
    }
}

interface ServantListDropdownProps extends Renderer.Props {
    svtRawData: Array<MstSvt>;
    selectedSvtId: number;
    onValueChange: (svtId: number) => void;
}

class ServantListDropdown extends Component<ServantListDropdownProps, any> {
    render() {
        let props = this.props as ServantListDropdownProps;
        let svtItems = [];

        let svtRawData = props.svtRawData as Array<MstSvt>;

        svtRawData.forEach((svt: MstSvt) => {
            //noinspection TypeScriptUnresolvedVariable
            svtItems.push(
                <Picker.Item key={`SvtPicker_${svt.id}`} label={`${svt.collectionNo}: ${svt.name}`} value={svt.id}/>
            );
        });

        //noinspection TypeScriptUnresolvedVariable
        return (
            <Picker
                style={{width: 392, height: 200}}
                itemStyle={{fontSize: 12, height: 200} as ViewStyle}
                selectedValue={props.selectedSvtId}
                onValueChange={props.onValueChange}>
                {svtItems}
            </Picker>
        );
    }
}

interface TableLineButtonProps extends Renderer.Props {
    onPress: () => void;
}

class TableLineButton extends Component<TableLineButtonProps, any> {
    render() {
        let props = this.props as TableLineButtonProps;
        return (
            <TouchableOpacity
                style={[
                    Styles.Common.verticalCentering,
                    {width: 392, height: Renderer.TABLE_CONTENT_HEIGHT_DEFAULT},
                    {backgroundColor: "yellow"}
                ]}
                onPress={props.onPress}
            >
                <Text style={[
                    Styles.Common.textCenter,
                ]}>{props.children}</Text>
            </TouchableOpacity>
        );
    }
}

interface TextInputProps extends Renderer.Props {
    value: string;
    onEndingEditing: (text: string) => void;
}

class ResImgSvtSkillLvInput extends Component<TextInputProps, any> {
    render() {
        let props = this.props as TextInputProps;
        return (
            <View style={{flex: 1, flexDirection: "row" as any}}>
                <Text style={{flex: 1, textAlign: "center"}}>Lv.</Text>
                <View style={{flex: 1, flexDirection: "row", borderColor: "gray", borderBottomWidth: 1, marginRight: 2}}>
                    <TextInput
                        style={{flex: 1, textAlign: "center"}}
                        onEndEditing={(event) => props.onEndingEditing(event.nativeEvent.text)}
                        defaultValue={props.value}
                        multiline={false}
                        editable={true}
                        maxLength={3}
                    />
                </View>
            </View>
        );
    }
}

export const App = injectIntoComponent(GoalEdit, State.StateName, Action.Actions);