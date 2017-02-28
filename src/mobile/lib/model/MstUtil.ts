import * as RNFS from "react-native-fs";
import RNFetchBlob from 'react-native-fetch-blob';
import VersionConfig from "../../../model/config/VersionConfig";
import Const from "../const/Const";

export default class MstUtil {

    private static _instance: MstUtil = undefined;

    public static get instance(): MstUtil {
        if (MstUtil._instance === undefined) {
            MstUtil._instance = new MstUtil();
        }
        return MstUtil._instance;
    }

    private constructor() {
        this._localVerPath = `${RNFS.DocumentDirectoryPath}/${this._localVerFile}`;
    }

    private _localVerFile = "version.json";

    private _appVer: string;
    private _localVerPath: string;

    public async getAppVer(): Promise<string> {
        if (!this._appVer) {
            this._appVer = (await this.loadJson(this._localVerPath) as VersionConfig).version;
        }

        return Promise.resolve(this._appVer);
    }

    public getLocalVerPath(): string {
        return this._localVerPath;
    }

    public getRemoteVerUrl(): string {
        return `${Const.GITHUB_BASE}/master/VERSION`;
    }

    public async getDbPath(): Promise<string> {
        return Promise.resolve(
            `${RNFS.DocumentDirectoryPath}/database/${await this.getAppVer()}`
        );
    }

    public getRemoteDbPath(remoteVer: string): string {
        return `${RNFS.DocumentDirectoryPath}/database/${remoteVer}`;
    }

    public getRemoteDbUrl(remoteVer: string): string {
        return `${Const.GITHUB_BASE}/${remoteVer}/database/${remoteVer}`;
    }

    public getRemoteFaceUrl(remoteVer: string, svtId: number): string {
        return `${this.getRemoteDbUrl(remoteVer)}/images/face/${svtId}.png`;
    }

    public getRemoteItemUrl(remoteVer: string, itemId: number): string {
        return `${this.getRemoteDbUrl(remoteVer)}/images/item/${itemId}.png`;
    }

    public getRemoteSkillUrl(remoteVer: string, iconId: number): string {
        return `${this.getRemoteDbUrl(remoteVer)}/images/skill/${iconId}.png`;
    }

    public async getLocalImagePath() {
        return Promise.resolve(`${await this.getDbPath()}/images`);
    }

    public async readImageIntoBase64Str(path: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let data = "";
            //noinspection TypeScriptUnresolvedVariable,TypeScriptUnresolvedFunction
            RNFetchBlob.fs.readStream(
                // file path
                path,
                // encoding, should be one of `base64`, `utf8`, `ascii`
                'base64',
                // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
                // when reading file in BASE64 encoding, buffer size must be multiples of 3.
                4095
            ).then((ifstream) => {
                ifstream.open();
                //noinspection TypeScriptUnresolvedFunction
                ifstream.onData((chunk) => {
                    // when encoding is `ascii`, chunk will be an array contains numbers
                    // otherwise it will be a string
                    data += chunk
                });
                ifstream.onError((err) => {
                    reject(err);
                });
                //noinspection TypeScriptUnresolvedFunction
                ifstream.onEnd(() => {
                    resolve(`data:image/png;base64,${data}`)
                });
            });
        });
    }

    public getDirFromPath(path: string): string {
        let splitDir = path.split("/");
        splitDir.pop(); // remove file name
        return splitDir.join("/");
    }

    public async ensureDir(filePath: string): Promise<void> {
        return RNFS.mkdir(this.getDirFromPath(filePath));
    }

    public async loadJson(path: string): Promise<any> {
        let file = await RNFS.readFile(path);

        return Promise.resolve(JSON.parse(file));
    }

}