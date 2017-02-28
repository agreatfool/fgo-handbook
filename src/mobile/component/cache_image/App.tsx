import * as RNFS from "react-native-fs";
import RNFetchBlob from 'react-native-fetch-blob';
import React, {Component} from "react";
import {Image} from "react-native";
import MstUtil from "../../lib/model/MstUtil";

export class CacheImage extends Component<any, any> {

    private _url: string;

    constructor(props, context) {
        super(props, context);

        this._url = props.url;

        this.state = {
            data: undefined
        }
    }

    componentWillMount() {
        this.loadImage().catch((err) => console.error(err));
    }

    async loadImage(): Promise<any> {
        let split = this._url.split("/");
        let fileName = split.pop();
        let type = split.pop();
        let localFilePath;
        console.log('type: ', type);
        console.log('file name: ', fileName);

        let imageBasePath = await MstUtil.instance.getLocalImagePath();
        localFilePath = `${imageBasePath}/${type}/${fileName}`;
        console.log('image path: ', localFilePath);

        let exists = await RNFS.exists(localFilePath);
        console.log('local file exists: ', exists);

        let base64Str = "";
        if (exists) {
            base64Str = await MstUtil.instance.readImageIntoBase64Str(localFilePath);
        } else {
            //noinspection TypeScriptValidateTypes
            let downloadRes = await RNFetchBlob.config({
                path: localFilePath
            }).fetch("GET", this._url);
            console.log('download result: ', downloadRes);
            console.log('download ok?', downloadRes.ok);
            //noinspection TypeScriptUnresolvedVariable
            base64Str = await MstUtil.instance.readImageIntoBase64Str(localFilePath);
        }
        console.log('base64: ', base64Str.length);

        this.setState({
            data: {
                uri: base64Str
            }
        });
    }

    render() {
        //noinspection TypeScriptUnresolvedVariable
        return (
            <Image
                {...this.props}
                defaultSource={require("./unknown.png")}
                source={this.state.data}
            />
        );
    }

}