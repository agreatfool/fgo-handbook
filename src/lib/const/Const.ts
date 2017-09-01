import * as LibPath from "path";

export default class Const {

    public static readonly PATH_BASE: string = LibPath.join(LibPath.dirname(__filename), "..", "..", "..");

    public static readonly PATH_CONFIG: string = LibPath.join(Const.PATH_BASE, "config");
    public static readonly PATH_DATABASE: string = LibPath.join(Const.PATH_BASE, "database");
    public static readonly PATH_RESOURCE: string = LibPath.join(Const.PATH_BASE, "resource");

    public static readonly FONT_STAR: string = "\u2605"; // ★

    public static readonly CONF_VERSION: Array<string> = ["config", "version"]; // 应用版本信息配置
    public static readonly CONF_SOURCE: Array<string> = ["config", "source"]; // 数据来源站点信息

    public static readonly CONF_DB_KEY_WORD: string = "database"; // 本地存储的数据库文件路径根目录
    public static readonly CONF_DB_ORIGIN_MASTER: Array<string> = ["database", "origin", "master"];
    public static readonly CONF_DB_EMBEDDED_CODE: Array<string> = ["database", "embedded_code"]; // 分析完毕的 站点页面上的JS内嵌的文本信息
    public static readonly CONF_DB_EMBEDDED_TRANS: Array<string> = ["database", "embedded_trans"]; // 未分析的 站点页面上的JS内嵌的翻译文本

}