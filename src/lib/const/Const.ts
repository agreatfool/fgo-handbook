import * as LibPath from "path";

export default class Const {

    public static PATH_BASE: string = LibPath.join(LibPath.dirname(__filename), "..", "..", "..");

    public static PATH_CONFIG: string = LibPath.join(Const.PATH_BASE, "config");
    public static PATH_DATABASE: string = LibPath.join(Const.PATH_BASE, "database");

    public static FONT_STAR: string = "\u2605"; // ★

    public static CONFIG_APP: string = "app"; // 应用级别配置
    public static CONFIG_SOURCE: string = "source"; // 数据来源站点信息
    public static CONFIG_EMBEDDED_CODE: string = "embedded_code"; // 分析完毕的源站点代码内嵌数据

}