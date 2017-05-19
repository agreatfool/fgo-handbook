import React, {Component} from "react";
import {Thumbnail} from "native-base";
import {Props} from "../../view/View";
import MstUtil from "../../lib/utility/MstUtil";
import * as RNFS from "react-native-fs";
import RNFetchBlob from "react-native-fetch-blob";
import Log from "../../../lib/log/Log";

interface ThumbnailCacheProps extends Props {
    // props original:
    appVer: string;
    id: number; // svtId | classId | itemId | skillIconId
    type: string; // face | item | class | skill

    // props from Thumbnail:
    square?: boolean;
    small?: boolean;
}

interface ThumbnailCacheState {
    isLocalFileChecked: boolean;
    isLocalFileExists: boolean;
    base64ImageStr: string;
}

export class ThumbnailCache extends Component<ThumbnailCacheProps, any> {
    private _isUnMounted: boolean;
    private _clonedProps: Object;
    private _localImagePath: string;
    private _remoteImageUrl: string;

    constructor(props, context) {
        super(props, context);

        this._isUnMounted = false;

        let clonedProps = Object.assign({}, props) as ThumbnailCacheProps;
        delete clonedProps.appVer;
        delete clonedProps.id;
        delete clonedProps.type;
        this._clonedProps = clonedProps;

        this._localImagePath = MstUtil.instance.getLocalImagePath(props.appVer, props.type, props.id);
        this._remoteImageUrl = MstUtil.instance.getRemoteImageUrl(props.appVer, props.type, props.id);

        this.state = {
            isLocalFileChecked: false,
            isLocalFileExists: false,
            base64ImageStr: undefined,
        };
    }

    componentWillMount() {
        RNFS.exists(this._localImagePath).then((exists: boolean): Promise<boolean | string> => {
            if (!exists) {
                return Promise.resolve(false);
            } else {
                return MstUtil.instance.readImageIntoBase64Str(this._localImagePath);
            }
        }).then((result: boolean | string): void => {
            if (false === result) {
                // local file not found
                this.updateState({
                    isLocalFileChecked: true,
                    isLocalFileExists: false,
                });
            } else {
                // local file found
                this.updateState({
                    isLocalFileChecked: true,
                    isLocalFileExists: true,
                    base64ImageStr: result,
                });
            }
        }).catch((e) => {
            this.updateState({
                isLocalFileChecked: true,
                isLocalFileExists: false,
            });
            Log.instance.error(`[ThumbnailCache] Local file check failed: err: ${e.name} ${e.message}, stack: ${e.stack}`);
        });
    }

    componentWillUnmount() {
        this._isUnMounted = true;
    }

    updateState(state: Object): void {
        if (this._isUnMounted) {
            return;
        }
        this.setState(state);
    }

    render() {
        let props = this.props as ThumbnailCacheProps;
        let state = this.state as ThumbnailCacheState;

        // not ready yet
        if (!state || (state && !state.isLocalFileChecked)) {
            return <Thumbnail {...this._clonedProps} source={require("./unknown.png")}/>;
        }

        // ready, go rendering
        if (state.isLocalFileExists) {
            return <Thumbnail {...this._clonedProps} source={{uri: state.base64ImageStr}}/>;
        } else {
            ThumbnailLoader.instance.queue(
                `${props.appVer}|${props.type}|${props.id}`,
                this._localImagePath, this._remoteImageUrl
            );
            return <Thumbnail {...this._clonedProps} source={{uri: this._remoteImageUrl}}/>;
        }
    }
}

interface ThumbnailWork {
    id: string; // "appVer|type|id"
    localFilePath: string;
    remoteFileUrl: string;
}

class ThumbnailLoader {

    private static _instance: ThumbnailLoader = undefined;

    public static get instance(): ThumbnailLoader {
        if (ThumbnailLoader._instance === undefined) {
            ThumbnailLoader._instance = new ThumbnailLoader();
        }
        return ThumbnailLoader._instance;
    }

    private constructor() {
    }

    private _isWorking: boolean = false;
    private _queueHistory: Array<string> = [];
    private _queue: Array<ThumbnailWork> = [];

    public queue(id: string, localPath: string, targetUrl: string): void {
        // already queued work
        if (this._queueHistory.indexOf(id) !== -1) {
            return;
        }

        // queue work
        this._queueHistory.push(id);
        this._queue.push({
            id: id,
            localFilePath: localPath,
            remoteFileUrl: targetUrl,
        } as ThumbnailWork);

        // start to run
        this.run();
    }

    public run(): void {
        // console.log(this._queue, this._queueHistory, this._isWorking);
        // return;
        if (this._isWorking || this._queue.length === 0) {
            return;
        }

        let work: ThumbnailWork = this._queue.shift();

        //noinspection TypeScriptValidateTypes
        RNFetchBlob.config({
            path: work.localFilePath
        }).fetch("GET", work.remoteFileUrl).then((res) => {
            this._isWorking = false;
            this.run();
        }).catch((e) => {
            Log.instance.error(`[ThumbnailLoader] Download failed: err: ${e.name} ${e.message}, stack: ${e.stack}`);
        });
    }

}