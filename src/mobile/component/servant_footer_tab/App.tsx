import React, {Component} from "react";
import {Text} from "react-native";
import {Footer, FooterTab, Button} from "native-base";
import {Actions} from "react-native-router-flux";

export enum SvtFooterTabIndex {
    Detail,
    Skill,
    Story,
    Material,
}

interface SvtFooterTabProps {
    svtId: number;
    activeIndex: number; // 0 - 2
}

export class SvtFooterTab extends Component<SvtFooterTabProps, any> {

    constructor(props, context) {
        super(props, context);
    }

    genDetailButton() {
        let props = this.props as SvtFooterTabProps;
        let isActive = props.activeIndex === SvtFooterTabIndex.Detail;

        let event = () => {
            if (isActive) {
                return;
            }
            //noinspection TypeScriptUnresolvedFunction
            (Actions as any).servant_detail({svtId: props.svtId});
        };

        if (isActive) {
            return <Button active onPress={event}><Text>Detail</Text></Button>;
        } else {
            return <Button onPress={event}><Text>Detail</Text></Button>;
        }
    }

    genSkillButton() {
        let props = this.props as SvtFooterTabProps;
        let isActive = props.activeIndex === SvtFooterTabIndex.Skill;

        let event = () => {
            if (isActive) {
                return;
            }
            //noinspection TypeScriptUnresolvedFunction
            (Actions as any).servant_skill({svtId: props.svtId});
        };

        if (isActive) {
            return <Button active onPress={event}><Text>Skill</Text></Button>;
        } else {
            return <Button onPress={event}><Text>Skill</Text></Button>;
        }
    }

    genStoryButton() {
        let props = this.props as SvtFooterTabProps;
        let isActive = props.activeIndex === SvtFooterTabIndex.Story;

        let event = () => {
            if (isActive) {
                return;
            }
            //noinspection TypeScriptUnresolvedFunction
            (Actions as any).servant_story({svtId: props.svtId});
        };

        if (isActive) {
            return <Button active onPress={event}><Text>Story</Text></Button>;
        } else {
            return <Button onPress={event}><Text>Story</Text></Button>;
        }
    }

    genMaterialButton() {
        let props = this.props as SvtFooterTabProps;
        let isActive = props.activeIndex === SvtFooterTabIndex.Material;

        let event = () => {
            if (isActive) {
                return;
            }
            //noinspection TypeScriptUnresolvedFunction
            (Actions as any).servant_material({svtId: props.svtId});
        };

        if (isActive) {
            return <Button active onPress={event}><Text>Material</Text></Button>;
        } else {
            return <Button onPress={event}><Text>Material</Text></Button>;
        }
    }

    render() {
        return (
            <Footer>
                <FooterTab>
                    {this.genDetailButton()}
                    {this.genSkillButton()}
                    {this.genStoryButton()}
                    {this.genMaterialButton()}
                </FooterTab>
            </Footer>
        );
    }

}