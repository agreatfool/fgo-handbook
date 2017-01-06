import * as LibPath from "path";

export default class Const {

    public static readonly PATH_BASE: string = LibPath.join(LibPath.dirname(__filename), "..", "..", "..");

    public static readonly PATH_CONFIG: string = LibPath.join(Const.PATH_BASE, "config");
    public static readonly PATH_DATABASE: string = LibPath.join(Const.PATH_BASE, "database");

    public static readonly FONT_STAR: string = "\u2605"; // ★

    public static readonly CONFIG_APP: Array<string> = ["config", "app"]; // 应用级别配置
    public static readonly CONFIG_SOURCE: Array<string> = ["config", "source"]; // 数据来源站点信息

    public static readonly DB_EMBEDDED_CODE: Array<string> = ["database", "embedded_code"]; // 分析完毕的 站点页面上的JS内嵌的文本信息
    public static readonly DB_EMBEDDED_TRANS: Array<string> = ["database", "embedded_trans"]; // 未分析的 站点页面上的JS内嵌的翻译文本

}