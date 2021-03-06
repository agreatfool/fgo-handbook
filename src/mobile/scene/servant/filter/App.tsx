import React, {Component} from "react";
import {Text, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import MstUtil from "../../../lib/utility/MstUtil";
import {SvtListFilter} from "../list/State";
import {
    Body,
    Button,
    CheckBox,
    Col,
    Container,
    Content,
    Grid,
    Header,
    Icon,
    Left,
    Right,
    Row,
    Title
} from "native-base";
import * as Styles from "../../../view/Styles";
import {CardWithRows, ContainerWhite, GridCardWrapper, TextCentering, Thumbnail} from "../../../view/View";
import Const from "../../../lib/const/Const";

export * from "./State";
export * from "./Action";

export class ServantFilter extends Component<State.Props, any> {
    private _service: MstService.Service;

    constructor(props, context) {
        super(props, context);

        this._service = new MstService.Service();
    }

    isChecked(id: number, propName: string): boolean {
        let props = this.props as State.Props;
        let state = props.SceneServantList;

        let search = id + "";

        return (state.filter[propName] as Array<string>).indexOf(search) !== -1;
    }

    onCheck(id: number, propName: string, dataSet: { [key: number]: string }) {
        let props = this.props as State.Props;
        let filter = Object.assign({}, props.SceneServantList.filter) as SvtListFilter;
        let filterSet = filter[propName] as Array<string>;
        let dataIds = Object.keys(dataSet);

        if (id === 0) {
            // 全选
            filterSet = dataIds;
        } else if (id === -1) {
            // 清空
            filterSet = [];
        } else {
            let idStrVer = id + "";
            if (filterSet.indexOf(idStrVer) !== -1) {
                filterSet = MstUtil.removeValueFromArr(filterSet, idStrVer);
            } else {
                filterSet.push(idStrVer);
            }
        }

        filter[propName] = filterSet;
        props.actions.updateFilter(filter);
    }

    renderCommon(title: string, propName: string, dataSet: { [key: number]: string }) {
        let props = this.props as State.Props;
        let state = props.SceneServantList;

        let checkItems = [];
        Object.keys(dataSet).forEach((index) => {
            let id = parseInt(index);

            let display = <TextCentering>{dataSet[index]}</TextCentering>;
            if (propName === "classId") {
                display = <Thumbnail type="class" id={id}/>;
            }

            checkItems.push(
                <Col key={`CheckItem_${propName}_${id}`}>
                    <Row style={Styles.Common.Centering}>
                        <Col>
                            {display}
                        </Col>
                        <Col>
                            <CheckBox
                                checked={this.isChecked(id, propName)}
                                onPress={() => this.onCheck(id, propName, dataSet)}/>
                        </Col>
                    </Row>
                </Col>
            );
        });

        let rows = [];
        let countInRow = 5;
        if (propName === "classId") {
            countInRow = 4;
        }
        MstUtil.divideArrayIntoParts(checkItems, countInRow).forEach((itemsInRow: Array<any>, index) => {
            let cells = itemsInRow;

            if (cells.length < countInRow) {
                let appendCount = countInRow - cells.length;
                for (let loop = 0; loop < appendCount; loop++) {
                    cells.push(<Col key={`CheckItem_PH_${index}_${loop}`}/>);
                }
            }

            rows.push(
                <Row key={`CheckRow_${propName}_${index}`}
                     style={[Styles.Common.Centering, {minHeight: 25, marginBottom: 5}]}>
                    {cells}
                </Row>
            );
        });

        return (
            <View>
                <CardWithRows items={[title]} backgroundColor="#CDE1F9"/>
                <GridCardWrapper>
                    <Col style={{paddingTop: 5, paddingLeft: 10, paddingRight: 10}}>
                        {rows}
                    </Col>
                </GridCardWrapper>
                <GridCardWrapper>
                    <Row style={{paddingTop: 5, paddingBottom: 5}}>
                        <Col style={{marginLeft: 10, marginRight: 10}}>
                            <Button block info bordered small
                                    onPress={() => this.onCheck(0, propName, dataSet)}>
                                <Text>全选</Text>
                            </Button>
                        </Col>
                        <Col style={{marginLeft: 10, marginRight: 10}}>
                            <Button block info bordered small
                                    onPress={() => this.onCheck(-1, propName, dataSet)}>
                                <Text>清空</Text>
                            </Button>
                        </Col>
                    </Row>
                </GridCardWrapper>
            </View>
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
                    <Title>ServantFilter</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        {this.renderCommon("职阶选择", "classId", Const.SERVANT_CLASS_NAMES)}
                        {this.renderCommon("星级选择", "rarity", Const.SERVANT_RARITY_NAMES)}
                        {this.renderCommon("性别选择", "genderType", Const.SERVANT_GENDER_TYPES)}
                    </View>
                </Content>
            </ContainerWhite>
        );
    }
}

export const App = injectIntoComponent(ServantFilter, State.StateName, Action.Actions);