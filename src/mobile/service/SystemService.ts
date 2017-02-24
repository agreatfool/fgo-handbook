import * as RNFS from "react-native-fs";
import Const from "../lib/Const";
import VersionConfig from "../../model/config/VersionConfig";
import moment from "moment";

export interface VerCheckResult {
    needUpgrade: boolean;
    localVer: string;
    remoteVer: string;
}

export class Service {

    protected _localVerFile = "version.json";

    async checkSysVer(): Promise<VerCheckResult> {
        let localVerPath = `${RNFS.DocumentDirectoryPath}/${this._localVerFile}`;

        let result = {
            needUpgrade: false,
            localVer: "",
            remoteVer: "",
        } as VerCheckResult;
        //noinspection JSUnusedAssignment
        let remoteVer = "";
        let localVer = "";

        // 获取内嵌的版本文件
        let embeddedLocalVer: VersionConfig = require("../../../config/version.json");

        // 获取本地版本号
        let localVerExists = await RNFS.exists(localVerPath);
        if (!localVerExists) {
            localVer = embeddedLocalVer.version;
        } else {
            let localVerContent = await RNFS.readFile(localVerPath);
            localVer = (JSON.parse(localVerContent) as VersionConfig).version;
        }

        // 获取远程版本号
        let remoteResponse = await fetch(
            `${Const.GITHUB_BASE}/VERSION`
        );
        remoteVer = remoteResponse.ok ? await remoteResponse.text() : localVer;

        // 更新结果
        result.needUpgrade = (remoteVer !== localVer);
        result.localVer = localVer;
        result.remoteVer = remoteVer;

        // 写入本地文件，如果不存在的话
        if (!localVerExists) {
            await RNFS.writeFile(localVerPath, JSON.stringify({
                version: localVer,
                updated: moment().format("YYYY-MM-DD")
            }, null, 4));
        }

        return Promise.resolve(result);
    }

}