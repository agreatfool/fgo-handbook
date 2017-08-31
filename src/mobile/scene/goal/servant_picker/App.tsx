import React, {Component} from "react";
import {TouchableOpacity, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import {
    Body,
    Button,
    Col,
    Container,
    Content,
    Grid,
    Header,
    Icon,
    Left,
    Right,
    Row,
    Thumbnail,
    Title
} from "native-base";
import * as Styles from "../../../view/Styles";
import {AppFooterTab, AppFooterTabIndex} from "../../../component/app_footer_tab/App";
import {ContainerWhite, GridCardWrapper} from "../../../view/View";
import {MstSvt} from "../../../../model/master/Master";
import MstUtil from "../../../lib/utility/MstUtil";

export * from "./State";
export * from "./Action";

interface NavState {
    selectedIds: Array<number>;
}

interface GoalServantPickerState {
    selected: Array<number>;
}

class GoalServantPicker extends Component<State.Props, any> {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        this.setState({selected: []});
    }

    isSelected(svtId: number): boolean {
        let props = this.props as State.Props;
        let state = this.state as GoalServantPickerState;

        let navState = props.navigation.state.params as NavState;

        if (navState.selectedIds.indexOf(svtId) !== -1 || state.selected.indexOf(svtId) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    selectSvt(svtId: number) {
        let selected = MstUtil.deepCopy((this.state as GoalServantPickerState).selected);
        let index = selected.indexOf(svtId);
        if (index === -1) {
            selected.push(svtId);
        } else {
            selected = MstUtil.removeFromArrAtIndex(selected, index);
        }

        this.setState({selected: selected});
    }

    finishSelect() {
        let props = this.props as State.Props;
        let state = this.state as GoalServantPickerState;

        props.actions.updateSvtIdsOnEdit(state.selected);
        props.navigation.goBack(null);
    }

    renderCell(svtId: number) {
        let view = undefined;

        let props = this.props as State.Props;

        if (this.isSelected(svtId)) {
            view = <Icon key={`servant_icon_${svtId}`} name="md-checkmark"/>;
        } else {
            view = <Thumbnail key={`servant_thumb_${svtId}`} small square
                              source={{
                                  uri: MstUtil.instance.getRemoteFaceUrl(props.SceneGoal.appVer, svtId)
                              }}/>;
        }

        return view;
    }

    renderServantList() {
        let props = this.props as State.Props;
        const CELL_COUNT = 6;

        let servants: Array<Array<MstSvt>> = MstUtil.divideArrayIntoParts(props.SceneGoal.svtRawData, CELL_COUNT);

        let rows = [];
        servants.forEach((rowData: Array<MstSvt>, rowIndex) => {
            let cells = [];

            rowData.forEach((svtData: MstSvt, cellIndex) => {
                cells.push(
                    <Col key={`Thumb_Cell_${rowIndex}_${cellIndex}`}
                         style={[Styles.Common.HorizontalCentering, Styles.Common.VerticalCentering]}>
                        <TouchableOpacity onPress={() => this.selectSvt(svtData.id)}>
                            {this.renderCell(svtData.id)}
                        </TouchableOpacity>
                    </Col>
                );
            });
            if (cells.length < CELL_COUNT) {
                let appendCount = CELL_COUNT - cells.length;
                for (let loop = 0; loop < appendCount; loop++) {
                    cells.push(<Col key={`Thumb_PH_${rowIndex}_${loop}`}/>);
                }
            }

            rows.push(
                <Row key={`Thumb_Row_${rowIndex}`} style={{marginBottom: 5}}>
                    {cells}
                </Row>
            );
        });

        return (
            <View>
                <GridCardWrapper>
                    <Col style={{paddingTop: 5}}>
                        {rows}
                    </Col>
                </GridCardWrapper>
            </View>
        );
    }

    render() {
        let props = this.props as State.Props;
        let state = this.state as GoalServantPickerState;
        if (state === undefined || state === null || !state.hasOwnProperty("selected") || !state.selected) {
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
                    <Title>选择目标从者</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.finishSelect()}>
                            <Icon name="md-checkmark"/>
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        {this.renderServantList()}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress} navigation={props.navigation}/>
            </ContainerWhite>
        );
    }
}

export const App = injectIntoComponent(GoalServantPicker, State.StateName, Action.Actions);