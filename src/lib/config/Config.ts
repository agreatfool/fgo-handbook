import * as LibPath from "path";

import * as LibAsyncFile from "async-file";

import Const from "../const/Const";

export default class Config {

    private static _instance: Config = undefined;

    public static get instance(): Config {
        if (Config._instance === undefined) {
            Config._instance = new Config();
        }
        return Config._instance;
    }

    private _cache: Map<string, Object>; // json object

    private _embeddedCodeName: string = "embedded_code";

    private constructor() {
        this._cache = new Map<string, Object>();
    }

    public async loadConfig(configName: string, propertyName: string): Promise<any> {
        try {
            let json = await this.loadWholeConfig(configName) as Object;
            if (!json.hasOwnProperty(propertyName)) {
                return Promise.reject(new Error(`Config "${configName}" has no property: ${propertyName}!`));
            }
            return Promise.resolve(json[propertyName]);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    public async loadWholeConfig(configName: string): Promise<Object> {
        try {
            if (this._cache.has(configName)) {
                return Promise.resolve(this._cache.get(configName));
            }

            let filePath = this._getConfigPath(configName);
            if (!LibAsyncFile.exists(filePath)) {
                return Promise.reject(new Error(`Config file not found: "${configName}!"`));
            }

            let file = await LibAsyncFile.readFile(filePath);
            let json = JSON.parse(file);

            this._cache.set(configName, json);

            return Promise.resolve(json);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    private _getConfigPath(configName: string): string {
        let basePath = Const.PATH_CONFIG;

        if (configName === this._embeddedCodeName) {
            basePath = Const.PATH_DATABASE;
        }

        return LibPath.join(basePath, `${configName}.json`);
    }

}