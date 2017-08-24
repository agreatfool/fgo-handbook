import React, {Component} from "react";
import {View} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import MstUtil from "../../../lib/utility/MstUtil";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import {CardWithRows} from "../../../view/View";
import * as Styles from "../../../view/Styles";
import {SvtInfoFSReq, SvtInfoStory} from "../../../lib/model/MstInfo";
import {Actions} from "react-native-router-flux";
import {Body, Button, Container, Content, Grid, Header, Icon, Left, Right, Row, Title} from "native-base";
import {SvtFooterTab, SvtFooterTabIndex} from "../../../component/servant_footer_tab/App";

export * from "./State";
export * from "./Action";

class ServantStory extends Component<State.Props, any> {
    private _appVer: string;
    private _service: MstService.Service;

    constructor(props, context) {
        super(props, context);
        this._service = new MstService.Service();
    }

    componentWillMount() {
        let props = this.props as State.Props;
        MstUtil.instance.getAppVer().then((appVer) => {
            this._appVer = appVer;
            return this._service.getServantName(props.svtId);
        }).then((name) => {
            props.actions.updatePageTitle(name);
            return this._service.buildSvtInfoStory(props.svtId);
        }).then((info) => {
            props.actions.updateSvtId(props.svtId);
            props.actions.updateSvtInfo({storyInfo: info});
        });
    }

    genFriendshipStr(value: SvtInfoFSReq) {
        return `${value.current}\n(${value.total})`;
    };

    renderFriendship(info: SvtInfoStory) {
        let data: Array<SvtInfoFSReq> = info.friendshipRequirements;

        return (
            <View>
                <CardWithRows items={["羁绊点数"]} backgroundColor="#CDE1F9"/>
                <Grid>
                    <Row>
                        <CardWithRows items={["羁绊一", this.genFriendshipStr(data[0])]}/>
                        <CardWithRows items={["羁绊二", this.genFriendshipStr(data[1])]}/>
                        <CardWithRows items={["羁绊三", this.genFriendshipStr(data[2])]}/>
                        <CardWithRows items={["羁绊四", this.genFriendshipStr(data[3])]}/>
                    </Row>
                    <Row>
                        <CardWithRows items={["羁绊五", this.genFriendshipStr(data[4])]}/>
                        <CardWithRows items={["羁绊六", this.genFriendshipStr(data[5])]}/>
                        <CardWithRows items={["羁绊七", this.genFriendshipStr(data[6])]}/>
                    </Row>
                    <Row>
                        <CardWithRows items={["羁绊八", this.genFriendshipStr(data[7])]}/>
                        <CardWithRows items={["羁绊九", this.genFriendshipStr(data[8])]}/>
                        <CardWithRows items={["羁绊十", this.genFriendshipStr(data[9])]}/>
                    </Row>
                </Grid>
            </View>
        );
    }

    renderStory(info: SvtInfoStory) {

        return (
            <View>
                <Grid>
                    <CardWithRows items={["角色故事"]} backgroundColor="#CDE1F9"/>
                </Grid>
                <Grid style={{flex: 1, flexDirection: "column"}}>
                    <CardWithRows items={["角色详细"]} isTextCentered={false}/>
                    <CardWithRows items={[info.detail]}
                                  isHorizontalCentered={false}
                                  isVerticalCentered={false}
                                  isTextCentered={false}/>
                </Grid>
                <Grid style={{flex: 1, flexDirection: "column"}}>
                    <CardWithRows items={["羁绊等级1"]} isTextCentered={false}/>
                    <CardWithRows items={[info.friendship1]}
                                  isHorizontalCentered={false}
                                  isVerticalCentered={false}
                                  isTextCentered={false}/>
                </Grid>
                <Grid style={{flex: 1, flexDirection: "column"}}>
                    <CardWithRows items={["羁绊等级2"]} isTextCentered={false}/>
                    <CardWithRows items={[info.friendship2]}
                                  isHorizontalCentered={false}
                                  isVerticalCentered={false}
                                  isTextCentered={false}/>
                </Grid>
                <Grid style={{flex: 1, flexDirection: "column"}}>
                    <CardWithRows items={["羁绊等级3"]} isTextCentered={false}/>
                    <CardWithRows items={[info.friendship3]}
                                  isHorizontalCentered={false}
                                  isVerticalCentered={false}
                                  isTextCentered={false}/>
                </Grid>
                <Grid style={{flex: 1, flexDirection: "column"}}>
                    <CardWithRows items={["羁绊等级4"]} isTextCentered={false}/>
                    <CardWithRows items={[info.friendship4]}
                                  isHorizontalCentered={false}
                                  isVerticalCentered={false}
                                  isTextCentered={false}/>
                </Grid>
                <Grid style={{flex: 1, flexDirection: "column"}}>
                    <CardWithRows items={["最终故事"]} isTextCentered={false}/>
                    <CardWithRows items={[info.lastStory]}
                                  isHorizontalCentered={false}
                                  isVerticalCentered={false}
                                  isTextCentered={false}/>
                </Grid>
            </View>
        );
    }

    render() {
        let props = this.props as State.Props;
        let state = props.SceneServantInfo;
        let info: SvtInfoStory = state.storyInfo;
        if (MstUtil.isObjEmpty(info)) {
            return <View/>;
        }

        let friendship = this.renderFriendship(info);
        let story = this.renderStory(info);

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => (Actions as any).pop()}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>{state.title}</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <View style={Styles.Box.Wrapper}>
                        {friendship}
                        {story}
                    </View>
                </Content>
                <SvtFooterTab activeIndex={SvtFooterTabIndex.Story} svtId={state.svtId}/>
            </Container>
        );
    }
}

export const App = injectIntoComponent(ServantStory, State.StateName, Action.Actions);