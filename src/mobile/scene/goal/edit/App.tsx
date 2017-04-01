import React, {Component} from "react";
import {View, Text, Picker, ViewStyle, TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import {ToolBoxWrapper, TabScene, TabPageScroll, Table, ResImage} from "../../../view/View";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import MstUtil from "../../../lib/utility/MstUtil";
import * as Styles from "../../../view/Styles";
import {Goal, GoalSvt, GoalSvtSkill} from "../../../lib/model/MstGoal";
import * as LibUuid from "uuid";
import * as Renderer from "../../../view/View";
import * as MstService from "../../../service/MstService";
import {MstSvt, MstSkill, MstSvtSkill} from "../../../../model/master/Master";

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
            currentGoal = this.getGoalWithId(props.goalId);
        }

        this.setState({
            selectedSvtId: props.SceneGoal.svtRowData[0].id,
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

    getGoalWithId(goalId: string): Goal {
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

    genServantDropButton() {
        return (
            <TouchableOpacity>

            </TouchableOpacity>
        );
    }

    genServantLine(goalSvt: GoalSvt) {
        let props = this.props as GoalEditProps;
        let appVer = props.SceneGoal.appVer;

        let svtInfo = this.searchSvtInfo(goalSvt.svtId);
        let skills = this.searchSvtSkills(goalSvt.svtId);

        return [
            <ResImage appVer={appVer}
                      type="face"
                      size="small"
                      id={goalSvt.svtId}/>,
            <ResImage appVer={appVer}
                      type="skill"
                      size="small"
                      id={skills[0].iconId}/>,
            <ResImage appVer={appVer}
                      type="skill"
                      size="small"
                      id={skills[1].iconId}/>,
            <ResImage appVer={appVer}
                      type="skill"
                      size="small"
                      id={skills[2].iconId}/>,
        ];
    }

    addSvtIntoGoal() {
        let state = this.state as GoalEditState;
        let svtId = state.selectedSvtId;

        let skills = this.searchSvtSkills(svtId);
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

        let currentGoal = Object.assign({}, state.goal);
        currentGoal.servants.push(goalSvt);
        this.setState({goal: currentGoal});
    }

    searchSvtSkills(svtId: number): Array<MstSkill> {
        let result = [] as Array<MstSkill>;

        let props = this.props as GoalEditProps;
        let svtSkillData = props.SceneGoal.svtSkillData;
        let skillData = props.SceneGoal.skillData;

        let skills: Map<number, MstSvtSkill> = svtSkillData.getGroup(svtId);
        for (let skill of skills.values()) {
            result.push(skillData.get(skill.skillId));
        }

        return result;
    }

    searchSvtInfo(svtId: number): MstSvt {
        let target = {} as MstSvt;
        (this.props as GoalEditProps).SceneGoal.svtRowData.forEach((svt: MstSvt) => {
            if (svt.id === svtId) {
                target = svt;
            }
        });
        return target;
    }

    prepareData() {
        let props = this.props as GoalEditProps;
        let state = this.state as GoalEditState;

        let columnServant = Renderer.buildColumnData(`编辑从者目标`, []);
        state.goal.servants.forEach((goalSvt: GoalSvt) => {
            columnServant.rows.push(this.genServantLine(goalSvt));
        });

        let columnAddServant = Renderer.buildColumnData("添加从者目标", []);
        columnAddServant.rows.push([
            <ServantDropList
                svtRowData={props.SceneGoal.svtRowData}
                selectedSvtId={state.selectedSvtId}
                onValueChange={(svtId) => this.setState({selectedSvtId: svtId})}
            />
        ],
        [
            <ServantDropButton onPress={() => this.addSvtIntoGoal()}>
                添加目标
            </ServantDropButton>
        ]);

        return [[columnServant], [columnAddServant]];
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
                        {content: "保存改动", onPress: () => {}},
                    ]}
                />
                <TabPageScroll>
                    <Table pageName="GoalEdit" data={this.prepareData()}/>
                </TabPageScroll>
            </TabScene>
        );
    }
}

interface ServantDropListProps extends Renderer.Props {
    svtRowData: Array<MstSvt>;
    selectedSvtId: number;
    onValueChange: (svtId: number) => void;
}

class ServantDropList extends Component<ServantDropListProps, any> {
    render() {
        let props = this.props as ServantDropListProps;
        let svtItems = [];

        let svtRowData = props.svtRowData as Array<MstSvt>;

        svtRowData.forEach((svt: MstSvt) => {
            //noinspection TypeScriptUnresolvedVariable
            svtItems.push(
                <Picker.Item key={`SvtPicker_${svt.id}`} label={`${svt.collectionNo}: ${svt.name}`} value={svt.id} />
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

interface ServantDropButtonProps extends Renderer.Props {
    onPress: () => void;
}

class ServantDropButton extends Component<ServantDropButtonProps, any> {
    render() {
        let props = this.props as ServantDropButtonProps;
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

export const App = injectIntoComponent(GoalEdit, State.StateName, Action.Actions);