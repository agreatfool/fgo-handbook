import * as LibPath from "path";

import * as LibAsyncFile from "async-file";

import Utility from "../utility/Utility";
import Const from "../const/Const";
import Log from "../log/Log";

export default class Config {

    private static _instance: Config = undefined;

    public static get instance(): Config {
        if (Config._instance === undefined) {
            Config._instance = new Config();
        }
        return Config._instance;
    }

    private _cache: Map<string, Object>; // json object

    private constructor() {
        this._cache = new Map<string, Object>();
    }

    public async loadDbConfigWithVersion(configName: Array<string> | string, propertyName?: string, version?: string): Promise<any> {
        let clonedName = null;

        if (Utility.isArray(configName)) {
            clonedName = configName.slice(0);
            let appVer = version ? version : await this.loadConfig(Const.CONF_VERSION, 'version');
            let dbKeywordIndex = -1;
            clonedName = clonedName as Array<string>;
            //noinspection TypeScriptUnresolvedFunction
            clonedName.forEach((ele, index) => {
                if (ele === Const.CONF_DB_KEY_WORD) {
                    dbKeywordIndex = index;
                }
            });
            if (dbKeywordIndex !== -1) { // found the keyword
                clonedName.splice(dbKeywordIndex + 1, 0, appVer);
            }
        }

        if (propertyName) {
            return Utility.isArray(configName) ? this.loadConfig(clonedName, propertyName) : this.loadConfig(configName, propertyName);
        } else {
            return Utility.isArray(configName) ? this.loadWholeConfig(clonedName) : this.loadWholeConfig(configName);
        }
    }

    public async loadConfig(configName: Array<string> | string, propertyName: string): Promise<any> {
        try {
            let json = await this.loadWholeConfig(configName) as Object;
            if (!json.hasOwnProperty(propertyName)) {
                return Promise.reject(new Error(
                    `[Config] loadConfig: Config "${Utility.isArray(configName) ?
                        (configName as Array<string>).join("/") : configName}" has no property: ${propertyName}!`
                ));
            }
            return Promise.resolve(json[propertyName]);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    public async loadWholeConfig(configName: Array<string> | string): Promise<Object> {
        try {
            let cacheKey: string = "";
            if (Utility.isArray(configName)) {
                cacheKey = (configName as Array<string>).join('|');
            } else {
                cacheKey = configName as string;
            }

            if (this._cache.has(cacheKey)) {
                return Promise.resolve(this._cache.get(cacheKey));
            }

            let filePath = this._getConfigPath(configName);
            if (!await LibAsyncFile.exists(filePath)) {
                return Promise.reject(new Error(`[Config] loadWholeConfig: Config file not found: "${filePath}!"`));
            }

            let file = await LibAsyncFile.readFile(filePath);
            let json = JSON.parse(file);

            this._cache.set(cacheKey, json);

            return Promise.resolve(json);
        } catch (err) {
            Log.instance.error(`[Config] loadWholeConfig: configName: "${JSON.stringify(configName)}!"`);
            return Promise.reject(err);
        }
    }

    private _getConfigPath(configName: Array<string> | string): string {
        if (typeof configName === "string") {
            return LibPath.join(Const.PATH_BASE, `${configName}.json`);
        } else {
            let copy = Array.from(configName);
            copy[copy.length - 1] += '.json';
            return LibPath.join(Const.PATH_BASE, ...copy);
        }
    }

}