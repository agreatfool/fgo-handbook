import * as RNFS from "react-native-fs";
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

    public async ensureDir(filePath: string): Promise<void> {
        let splitDir = filePath.split("/");
        splitDir.pop(); // remove file name
        let parentDir = splitDir.join("/");
        await RNFS.mkdir(parentDir);

        return Promise.resolve();
    }

    public async loadJson(path: string): Promise<any> {
        let file = await RNFS.readFile(path);

        return Promise.resolve(JSON.parse(file));
    }

}