import React, {Component} from "react";
import {Image, ListView, ListViewDataSource, Text, TouchableOpacity, View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as MstService from "../../../service/MstService";
import {MstSvt} from "../../../../model/master/Master";
import * as State from "./State";
import {SvtListOrder} from "./State";
import * as Action from "./Action";
import MstUtil from "../../../lib/utility/MstUtil";
import Const from "../../../lib/const/Const";
import {Actions} from "react-native-router-flux";
import * as Styles from "../../../view/Styles";
import {ResImage} from "../../../view/View";
import {SvtOrderDirections} from "../../../lib/model/MstInfo";
import {
    Body,
    Button,
    Container,
    Content,
    Footer,
    Header,
    Icon,
    Left,
    List,
    ListItem,
    Right,
    Thumbnail,
    Title,
    FooterTab,
    Grid,
    Col
} from "native-base";
import MstLoader from "../../../lib/model/MstLoader";
import {EmbeddedCodeConverted} from "../../../../model/master/EmbeddedCodeConverted";

export * from "./State";
export * from "./Action";

export class ServantList extends Component<State.Props, any> {
    private _appVer: string;
    private _service: MstService.Service;
    private _dataSource: ListViewDataSource;

    constructor(props, context) {
        super(props, context);

        this._service = new MstService.Service();
        this._dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    componentDidMount() {
        let props = this.props as State.Props;
        let state = props.SceneServantList;

        MstUtil.instance.getAppVer().then((appVer) => {
            this._appVer = appVer;
            return MstLoader.instance.loadEmbeddedCode();
        }).then((embeddedCode: EmbeddedCodeConverted) => {
            props.actions.updateTransName(embeddedCode.transSvtName);

            return this._service.loadSvtRawData();
        }).then((rawData: Array<MstSvt>) => {
            let displayData = MstService.Service.buildSvtDisplayData(rawData, state.filter, state.order);

            props.actions.updateRawData(rawData);
            props.actions.updateDisplayData(displayData);
        });
    }

    genDirectionIconStr(): string {
        let props = this.props as State.Props;
        let state = props.SceneServantList;

        let orderDirectionIcon = "";
        if (state.order.direction === SvtOrderDirections.DESC) {
            orderDirectionIcon = "arrow-down";
        } else {
            orderDirectionIcon = "arrow-up";
        }

        return orderDirectionIcon;
    }

    genDirectionStr(direction: number) {
        return direction === SvtOrderDirections.DESC ? "降序" : "升序";
    }

    genButtonsData(app: ServantList) {
        let props = app.props as State.Props;
        let state = props.SceneServantList;

        //noinspection TypeScriptUnresolvedFunction
        return [
            {
                content: app.genDirectionStr(state.order.direction),
                onPress: () => app.onOrderDirection(app)
            },
            {
                content: "过滤器",
                onPress: () => (Actions as any).servant_filter()
            }
        ];
    }

    onOrderDirection(app: ServantList) {
        let props = app.props as State.Props;
        let state = props.SceneServantList;
        let actions = props.actions;

        let direction = SvtOrderDirections.DESC;
        if (state.order.direction === SvtOrderDirections.DESC) {
            direction = SvtOrderDirections.ASC;
        }

        actions.updateOrder({
            order: state.order.order,
            direction: direction,
        } as SvtListOrder);
    }

    renderRow(data: MstSvt) {
        let props = this.props as State.Props;
        let state = props.SceneServantList;

        return (
            <ListItem>
                <Thumbnail square size={50} source={{uri: MstUtil.instance.getRemoteFaceUrl(this._appVer, data.id)}}/>
                <Grid style={{marginLeft: 10}}>
                    <Col size={1}><Text>{data.collectionNo}</Text></Col>
                    <Col size={1}><Thumbnail square size={30} source={{uri: MstUtil.instance.getRemoteClassUrl(this._appVer, data.classId)}}/></Col>
                    <Col size={3}><Text>{state.transSvtName[data.id].name}</Text></Col>
                </Grid>
            </ListItem>
        );
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left />
                    <Body>
                        <Title>ServantList</Title>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Icon name="funnel" />
                        </Button>
                        <Button transparent>
                            <Icon name={this.genDirectionIconStr()} />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <List dataArray={(this.props as State.Props).SceneServantList.displayData}
                          renderRow={this.renderRow.bind(this)}>
                    </List>
                </Content>
            </Container>
        );
    }
}

export const App = injectIntoComponent(ServantList, State.StateName, Action.Actions);