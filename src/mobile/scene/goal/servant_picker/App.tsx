import React, {Component} from "react";
import {TouchableOpacity, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import {Actions} from "react-native-router-flux";
import {Body, Button, Container, Content, Header, Icon, Left, Right, Row, Title} from "native-base";
import * as Styles from "../../../view/Styles";
import {AppFooterTab, AppFooterTabIndex} from "../../../component/app_footer_tab/App";
import {ColCardWrapper, ColR, GridLine, ThumbnailR} from "../../../view/View";
import {MstSvt} from "../../../../model/master/Master";
import MstUtil from "../../../lib/utility/MstUtil";

export * from "./State";
export * from "./Action";

interface GoalServantPickerProps extends State.Props {
}

class GoalServantPicker extends Component<GoalServantPickerProps, any> {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
    }

    selectSvt(svtId: number) {
        let props = this.props as GoalServantPickerProps;
        props.actions.updateSvtIdOnEdit(svtId);
        Actions.pop();
    }

    renderServantList() {
        let props = this.props as GoalServantPickerProps;
        const CELL_COUNT = 6;

        let servants: Array<Array<MstSvt>> = MstUtil.divideArrayIntoParts(props.SceneGoal.svtRawData, CELL_COUNT);

        let rows = [];
        servants.forEach((rowData: Array<MstSvt>, rowIndex) => {
            let cells = [];

            rowData.forEach((svtData: MstSvt, cellIndex) => {
                cells.push(
                    <ColR key={`Thumb_Cell_${rowIndex}_${cellIndex}`}
                          style={Styles.Common.HorizontalCentering}>
                        <TouchableOpacity onPress={() => this.selectSvt(svtData.id)}>
                            <ThumbnailR small square
                                        source={{
                                            uri: MstUtil.instance.getRemoteFaceUrl(
                                                props.SceneGoal.appVer, svtData.id
                                            )
                                        }}/>
                        </TouchableOpacity>
                    </ColR>
                );
            });
            if (cells.length < CELL_COUNT) {
                let appendCount = CELL_COUNT - cells.length;
                for (let loop = 0; loop < appendCount; loop++) {
                    cells.push(<ColR key={`Thumb_PH_${rowIndex}_${loop}`}/>);
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
                <GridLine>
                    <ColCardWrapper>
                        {rows}
                    </ColCardWrapper>
                </GridLine>
            </View>
        );
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => Actions.pop()}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>选择目标从者</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        {this.renderServantList()}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(GoalServantPicker, State.StateName, Action.Actions);