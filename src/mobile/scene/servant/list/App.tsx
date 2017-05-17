import React, {Component} from "react";
import {ListView, ListViewDataSource, Text} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import * as MstService from "../../../service/MstService";
import {MstSvt} from "../../../../model/master/Master";
import * as State from "./State";
import * as Action from "./Action";
import MstUtil from "../../../lib/utility/MstUtil";
import {Actions} from "react-native-router-flux";
import {SvtOrderDirections} from "../../../lib/model/MstInfo";
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
    List,
    ListItem,
    Right,
    Thumbnail,
    Title
} from "native-base";
import MstLoader from "../../../lib/model/MstLoader";
import {EmbeddedCodeConverted} from "../../../../model/master/EmbeddedCodeConverted";
import {AppFooterTab, AppFooterTabIndex} from "../../../component/app_footer_tab/App";
import * as Styles from "../../../view/Styles";
import {ColR} from "../../../view/View";

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

            props.actions.updateAppVer(this._appVer);
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

    onOrderDirectionChange() {
        let props = this.props as State.Props;
        let state = props.SceneServantList;
        let actions = props.actions;

        let direction = SvtOrderDirections.DESC;
        if (state.order.direction === SvtOrderDirections.DESC) {
            direction = SvtOrderDirections.ASC;
        }

        actions.updateOrder({
            order: state.order.order,
            direction: direction,
        } as State.SvtListOrder);
    }

    renderRow(data: MstSvt) {
        let props = this.props as State.Props;
        let state = props.SceneServantList;

        //noinspection TypeScriptUnresolvedFunction
        return (
            <ListItem onPress={() => (Actions as any).servant_detail({svtId: data.id})}>
                <Thumbnail square source={{uri: MstUtil.instance.getRemoteFaceUrl(this._appVer, data.id)}}/>
                <Grid style={{marginLeft: 10}}>
                    <ColR size={.5} style={Styles.Common.VerticalCentering}>
                        <Text>{data.collectionNo}</Text>
                    </ColR>
                    <ColR size={1}>
                        <Thumbnail square small
                                   source={{uri: MstUtil.instance.getRemoteClassUrl(this._appVer, data.classId)}}/>
                    </ColR>
                    <ColR size={3} style={Styles.Common.VerticalCentering}>
                        <Text>{state.transSvtName[data.id].name}</Text>
                    </ColR>
                </Grid>
            </ListItem>
        );
    }

    render() {
        //noinspection TypeScriptUnresolvedFunction
        return (
            <Container>
                <Header>
                    <Left />
                    <Body>
                        <Title>ServantList</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => (Actions as any).servant_filter()}>
                            <Icon name="funnel"/>
                        </Button>
                        <Button transparent onPress={() => this.onOrderDirectionChange.bind(this)()}>
                            <Icon name={this.genDirectionIconStr()}/>
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <List dataArray={(this.props as State.Props).SceneServantList.displayData}
                          renderRow={this.renderRow.bind(this)}>
                    </List>
                </Content>
                <AppFooterTab activeIndex={AppFooterTabIndex.Servant}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(ServantList, State.StateName, Action.Actions);