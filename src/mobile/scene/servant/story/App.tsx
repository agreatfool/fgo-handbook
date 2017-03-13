import React, {Component} from "react";
import {View, Text} from "react-native";
import injectIntoComponent from "../../../../lib/react/Connect";
import MstUtil from "../../../lib/model/MstUtil";
import * as MstService from "../../../service/MstService";
import * as State from "./State";
import * as Action from "./Action";
import * as Renderer from "./View";
import * as Styles from "../../../style/Styles";
import {SvtInfoStory, SvtInfoFSReq} from "../../../lib/model/MstInfo";
import {TabScene, ToolBoxWrapper, TabPageScroll, Table} from "../main/View";

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
            props.actions.updateSvtInfo({storyInfo: info});
        });
    }

    genFriendshipStr(value: SvtInfoFSReq) {
        return `${value.current}\n(${value.total})`;
    };

    prepareStoryData(info: SvtInfoStory) {
        let column = Renderer.buildColumnData("角色故事", []);

        column.rows.push([
            <ViewFixedTitle>{"角色详细"}</ViewFixedTitle>,
            <ViewFixedText>{info.detail}</ViewFixedText>
        ]);
        column.rows.push([
            <ViewFixedTitle>{"羁绊等级1"}</ViewFixedTitle>,
            <ViewFixedText>{info.friendship1}</ViewFixedText>
        ]);
        column.rows.push([
            <ViewFixedTitle>{"羁绊等级2"}</ViewFixedTitle>,
            <ViewFixedText>{info.friendship2}</ViewFixedText>
        ]);
        column.rows.push([
            <ViewFixedTitle>{"羁绊等级3"}</ViewFixedTitle>,
            <ViewFixedText>{info.friendship3}</ViewFixedText>
        ]);
        column.rows.push([
            <ViewFixedTitle>{"羁绊等级4"}</ViewFixedTitle>,
            <ViewFixedText>{info.friendship4}</ViewFixedText>
        ]);
        column.rows.push([
            <ViewFixedTitle>{"羁绊等级5"}</ViewFixedTitle>,
            <ViewFixedText>{info.friendship5}</ViewFixedText>
        ]);
        column.rows.push([
            <ViewFixedTitle>{"最终故事"}</ViewFixedTitle>,
            <ViewFixedText>{info.lastStory}</ViewFixedText>
        ]);

        return [column];
    }

    prepareFriendshipData(data: Array<SvtInfoFSReq>) {
        let column = Renderer.buildColumnData("羁绊需求(累计)", []);

        column.rows.push([
            this.genFriendshipStr(data[0]),
            this.genFriendshipStr(data[1]),
            this.genFriendshipStr(data[2]),
            this.genFriendshipStr(data[3]),
            this.genFriendshipStr(data[4]),
        ]);
        column.rows.push([
            this.genFriendshipStr(data[5]),
            this.genFriendshipStr(data[6]),
            this.genFriendshipStr(data[7]),
            this.genFriendshipStr(data[8]),
            this.genFriendshipStr(data[9]),
        ]);

        return [column];
    }

    prepareData(info: SvtInfoStory) {
        let data = [];

        data.push(this.prepareFriendshipData(info.friendshipRequirements));
        data.push(this.prepareStoryData(info));

        return data;
    }

    render() {
        let info: SvtInfoStory = (this.props as State.Props).SceneServantInfo.storyInfo;
        if (MstUtil.isObjEmpty(info)) {
            // 数据未准备好，不要渲染页面
            return <View />;
        }

        let data = this.prepareData(info);

        return (
            <TabScene>
                <ToolBoxWrapper buttons={[
                    {content: "编辑模式"}
                ]}/>
                <TabPageScroll>
                    <Table data={data}/>
                </TabPageScroll>
            </TabScene>
        );
    }
}

class ViewFixedTitle extends Component<any, any> {
    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <View
                style={[
                    Styles.Common.centering,
                    Styles.Common.flexDefault,
                ]}
            >
                <Text style={[Styles.Common.textCenter, {width: 80}]}>
                    {this.props.children}
                </Text>
            </View>
        );
    }
}

class ViewFixedText extends Component<any, any> {
    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <Text style={[
                Styles.Common.centering,
                {width: 310, padding: 5}
            ]}>
                {this.props.children}
            </Text>
        );
    }
}

export const App = injectIntoComponent(ServantStory, State.StateName, Action.Actions);