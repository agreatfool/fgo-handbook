import * as LibPath from "path";

export default class Const {
    public static PATH_BASE: string = LibPath.join(LibPath.dirname(__filename), "..", "..", "..");

    public static PATH_CONFIG: string = LibPath.join(Const.PATH_BASE, "config");
    public static PATH_DATABASE: string = LibPath.join(Const.PATH_BASE, "database");
}