import React, {Component} from "react";
import {TouchableOpacity, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as State from "./State";
import * as Action from "./Action";
import {Actions} from "react-native-router-flux";
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
import {GridCardWrapper} from "../../../view/View";
import {MstItem} from "../../../../model/master/Master";
import MstUtil from "../../../lib/utility/MstUtil";

export * from "./State";
export * from "./Action";

interface GoalItemPickerProps extends State.Props {
}

class GoalItemPicker extends Component<GoalItemPickerProps, any> {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
    }

    selectItem(itemId: number) {
        //noinspection TypeScriptUnresolvedFunction
        (Actions as any).goal_item_requirement({
            itemId: itemId
        });
    }

    renderItemList() {
        let props = this.props as GoalItemPickerProps;
        const CELL_COUNT = 6;

        let items: Array<Array<MstItem>> = MstUtil.divideArrayIntoParts(props.SceneGoal.visibleItems, CELL_COUNT);

        let rows = [];
        items.forEach((rowData: Array<MstItem>, rowIndex) => {
            let cells = [];

            rowData.forEach((svtData: MstItem, cellIndex) => {
                cells.push(
                    <Col key={`Thumb_Cell_${rowIndex}_${cellIndex}`}
                         style={Styles.Common.HorizontalCentering}>
                        <TouchableOpacity onPress={() => this.selectItem(svtData.id)}>
                            <Thumbnail small square
                                       source={{
                                           uri: MstUtil.instance.getRemoteItemUrl(
                                               props.SceneGoal.appVer, svtData.id
                                           )
                                       }}/>
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
                    {rows}
                </GridCardWrapper>
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
                    <Title>选择目标道具</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        {this.renderItemList()}
                    </View>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Progress}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(GoalItemPicker, State.StateName, Action.Actions);