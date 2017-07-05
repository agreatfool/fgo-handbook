import React, {Component} from "react";
import {Text, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import {Actions} from "react-native-router-flux";
import {Body, Button, Container, Content, Header, Icon, Left, Right, Row, Title} from "native-base";
import * as Styles from "../../../view/Styles";
import {AppFooterTab, AppFooterTabIndex} from "../../../component/app_footer_tab/App";
import {ColCard, ColCardWrapper, ColR, GridLine, ThumbnailR} from "../../../view/View";
import {MstCombineLimit, MstCombineSkill} from "../../../../model/master/Master";
import MstUtil from "../../../lib/utility/MstUtil";
import {CompareResSvtItem} from "../list/State";
import {MstItemContainer} from "../../../../model/impl/MstContainer";
import MstLoader from "../../../lib/model/MstLoader";
import BaseContainer from "../../../../lib/container/base/BaseContainer";
import {ElementType, renderRowCellsOfElements} from "../compare/App";

export * from "./State";
export * from "./Action";

interface GoalItemRequirementProps extends State.Props {
    itemId: number;
}
interface GoalItemRequirementState {
    itemName: string;
    total: number;
    limitTotal: number;
    skillTotal: number;
    limit: Array<CompareResSvtItem>;
    skill: Array<CompareResSvtItem>;
}

class GoalItemRequirement extends Component<GoalItemRequirementProps, any> {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        let props = this.props as GoalItemRequirementProps;
        let targetId = props.itemId;

        let limits: Array<MstCombineLimit> = props.SceneGoal.limitCombineData.getRaw();
        let skills: Array<MstCombineSkill> = props.SceneGoal.skillCombineData.getRaw();

        let itemName: string = "";
        let reqLimitTotal: number = 0;
        let reqSkillTotal: number = 0;
        let reqLimit: Array<CompareResSvtItem> = [];
        let reqSkill: Array<CompareResSvtItem> = [];

        MstLoader.instance.loadModel("MstItem").then((container: BaseContainer<any>) => {
            itemName = (container as MstItemContainer).get(targetId).name;

            limits.forEach((limit: MstCombineLimit) => {
                let index = limit.itemIds.indexOf(targetId);
                if (index !== -1) {
                    let svtId = limit.id;
                    let reqCount = limit.itemNums[index];
                    reqLimitTotal += reqCount;
                    this.updateCompareResSvtItem(reqLimit, svtId, reqCount);
                }
            });

            skills.forEach((skill: MstCombineSkill) => {
                let index = skill.itemIds.indexOf(targetId);
                if (index !== -1) {
                    let svtId = skill.id;
                    let reqCount = skill.itemNums[index] * 3; // 三个技能
                    reqSkillTotal += reqCount;
                    this.updateCompareResSvtItem(reqSkill, svtId, reqCount);
                }
            });

            this.setState({
                itemName: itemName,
                total: reqLimitTotal + reqSkillTotal,
                limitTotal: reqLimitTotal,
                skillTotal: reqSkillTotal,
                limit: reqLimit,
                skill: reqSkill
            });
        });
    }

    updateCompareResSvtItem(dataSet: Array<CompareResSvtItem>, svtId: number, count: number) {
        let found: CompareResSvtItem = undefined;
        dataSet.forEach((data: CompareResSvtItem, index: number) => {
            if (data.svtId === svtId) {
                found = data;
                data.count += count;
                dataSet[index] = data;
            }
        });

        if (found === undefined) {
            dataSet.push({
                svtId: svtId,
                count: count
            } as CompareResSvtItem);
        }
    }

    renderTitle() {
        let props = this.props as GoalItemRequirementProps;
        let state = this.state as GoalItemRequirementState;

        return (
            <GridLine>
                <ColCardWrapper backgroundColor="#CDE1F9">
                    <Row>
                        <ColR size={.2}>
                            <ThumbnailR small square
                                        source={{
                                            uri: MstUtil.instance.getRemoteItemUrl(
                                                props.SceneGoal.appVer, props.itemId
                                            )
                                        }}/>
                        </ColR>
                        <ColR style={Styles.Common.VerticalCentering}>
                            <Text>{`${state.itemName}  x${state.total}`}</Text>
                        </ColR>
                    </Row>
                </ColCardWrapper>
            </GridLine>
        );
    }

    render() {
        if (!this.state
            || this.state["limit"] === undefined
            || this.state["skill"] === undefined
            || this.state["itemName"] === undefined) {
            return <View />;
        }

        let props = this.props as GoalItemRequirementProps;
        let state = this.state as GoalItemRequirementState;

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => Actions.pop()}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>{state.itemName}</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        {this.renderTitle()}
                        <GridLine>
                            <ColCard items={[`灵基再临  x${state.limitTotal}`]} backgroundColor="#CDE1F9"/>
                        </GridLine>
                        {renderRowCellsOfElements(props.SceneGoal.appVer, "",
                            ElementType.SvtItem, 5, state.limit)}
                        <GridLine>
                            <ColCard items={[`技能升级  x${state.skillTotal}`]} backgroundColor="#CDE1F9"/>
                        </GridLine>
                        {renderRowCellsOfElements(props.SceneGoal.appVer, "",
                            ElementType.SvtItem, 5, state.skill)}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(GoalItemRequirement, State.StateName, Action.Actions);