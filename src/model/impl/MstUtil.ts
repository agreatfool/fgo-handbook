import * as LibPath from "path";

import * as LibAsyncFile from "async-file";

import Config from "../../lib/config/Config";
import Const from "../../lib/const/Const";

export default class MstUtil {

    private static _instance: MstUtil = undefined;

    public static get instance(): MstUtil {
        if (MstUtil._instance === undefined) {
            MstUtil._instance = new MstUtil();
        }
        return MstUtil._instance;
    }

    private _appVer: string;

    private constructor() {
    }

    public async getDbPathWithVer(): Promise<string> {
        if (!this._appVer) {
            this._appVer = await Config.instance.loadConfig(Const.CONF_VERSION, "version");
        }

        return Promise.resolve(LibPath.join(Const.PATH_DATABASE, this._appVer));
    }

    public async ensureDirs(dirs: Array<string>): Promise<any> {
        try {
            for (let dir of dirs) {
                let dirExists = await LibAsyncFile.exists(dir);
                if (!dirExists) {
                    await LibAsyncFile.createDirectory(dir);
                }
            }
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    }

}