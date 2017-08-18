import * as RNFS from "react-native-fs";
import VersionConfig from "../../model/config/VersionConfig";
import moment from "moment";
import MstUtil from "../lib/utility/MstUtil";

export interface VerCheckResult {
    needUpgrade: boolean;
    localVer: string;
    remoteVer: string;
}

export class Service {

    protected _localVerFile = "version.json";

    public async init(log: Function): Promise<any> {
        console.log(`Local dir: ${RNFS.DocumentDirectoryPath}`);

        try {
            let verCheckResult = await this.checkSysVer(log);
            console.log('Upgrade check:', verCheckResult);

            if (verCheckResult.needUpgrade) {
                await this.upgradeApp(verCheckResult, log);
            }
        } catch (e) {
            console.log(e);
        }
    }

    public async checkSysVer(log: Function): Promise<VerCheckResult> {
        let localVerPath = MstUtil.instance.getLocalVerPath();

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
        log(`Local ver: ${localVer}`);

        // 获取远程版本号
        let remoteResponse = await fetch(
            MstUtil.instance.getRemoteVerUrl(), {
            headers: {
                "Cache-Control": "no-cache"
            }
        });
        remoteVer = remoteResponse.ok ? await remoteResponse.text() : localVer;
        log(`Remote ver: ${remoteVer}`);

        // 更新结果
        result.needUpgrade = this._checkUpgrade(localVer, remoteVer);
        result.localVer = localVer;
        result.remoteVer = remoteVer;

        // 写入本地文件，如果不存在的话
        if (!localVerExists) {
            result.needUpgrade = true; // 本地文件不存在，意味着第一次启动，必须升级
            await RNFS.writeFile(localVerPath, JSON.stringify({
                version: localVer,
                updated: moment().format("YYYY-MM-DD")
            }, null, 4));
        }
        log(`Need upgrade: ${result.needUpgrade}`);

        return Promise.resolve(result);
    }

    public async upgradeApp(verCheckResult: VerCheckResult, log: Function): Promise<void> {
        let remoteVer = verCheckResult.remoteVer;
        let dbBaseUrl = MstUtil.instance.getRemoteDbUrl(remoteVer);
        let dbBasePath = MstUtil.instance.getLocalDbPathSync(remoteVer);

        // 创建数据库版本文件夹
        await RNFS.mkdir(dbBasePath);

        // 获取需要下载的文件列表
        let resResponse = await fetch(
            `${dbBaseUrl}/resources.json`, {
            headers: {
                "Cache-Control": "no-cache"
            }
        });
        if (!resResponse.ok) {
            return Promise.reject(await resResponse.text());
        }
        let resources = await resResponse.json();

        // 下载资源文件，并写入本地
        for (let resource of resources) {
            // 下载文件
            let url = `${dbBaseUrl}/${resource}`;
            log(`Downloading resource: ${url}`);
            let res = await fetch(url, {
                headers: {
                    "Cache-Control": "no-cache"
                }
            });
            if (!res.ok) {
                return Promise.reject(await res.text())
            }
            let file = await res.text();
            // 写入文件
            let filePath = `${dbBasePath}/${resource}`;
            await MstUtil.instance.ensureDir(filePath);
            await RNFS.writeFile(filePath, file);
        }

        // 更新本地版本文件
        await RNFS.writeFile(MstUtil.instance.getLocalVerPath(), JSON.stringify({
            version: remoteVer,
            updated: moment().format("YYYY-MM-DD")
        }, null, 4));

        log("Upgrade process finished");

        return Promise.resolve();
    }

    private _checkUpgrade(localVer, remoteVer): boolean {
        if (localVer === remoteVer) {
            return false;
        }

        let localVerSplit: Array<number> = localVer.split(".").map((ver) => {
            return parseInt(ver);
        });
        let remoteVerSplit: Array<number> = remoteVer.split(".").map((ver) => {
            return parseInt(ver);
        });

        if (localVerSplit[0] > remoteVerSplit[0]) {
            return false; // local has higher major ver
        } else if (localVerSplit[0] === remoteVerSplit[0] && localVerSplit[1] > remoteVerSplit[1]) {
            return false; // local has higher minor ver
        } else if (localVerSplit[0] === remoteVerSplit[0]
            && localVerSplit[1] === remoteVerSplit[1]
            && localVerSplit[2] > remoteVerSplit[2]) {
            return false; // local has higher patch ver
        } else {
            return true;
        }
    }

}