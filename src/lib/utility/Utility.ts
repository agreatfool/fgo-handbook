import * as LZString from "lz-string";
import * as LibMd5File from "md5-file";

import Log from "../log/Log";

declare function unescape(s: string): string;

class Utility {

    public static convertFormatedHexToString(str: string): string {
        let byteArr = Utility._convertFormatedHexToBytes(str);
        if (byteArr === false) {
            return "";
        }

        let res = "";
        for (let i: number = 0; i < byteArr.length; i += 2) {
            res += String.fromCharCode(byteArr[i] | (byteArr[i + 1] << 8));
        }
        return res;
    }

    private static _convertFormatedHexToBytes(hexStr: string): false | Array<number> {
        let count: number = 0,
            hexArr: Array<string>,
            hexData: Array<number> = [],
            hexLen: number;

        if (hexStr.trim() === "") {
            return [];
        }

        // Check for invalid hex characters.
        if (/[^0-9a-fA-F\s]/.test(hexStr)) {
            return false;
        }

        hexArr = hexStr.split(/([0-9a-fA-F][0-9a-fA-F])/g);
        hexLen = hexArr.length;

        for (let i: number = 0; i < hexLen; ++i) {
            if (hexArr[i].trim() === "") {
                continue;
            }
            hexData[count++] = parseInt(hexArr[i], 16);
        }
        return hexData;
    }

    public static convertStringToFormatedHex(str: string): string {
        let byteArr = [];
        for (let i = 0; i < str.length; i++) {
            let value = str.charCodeAt(i);
            byteArr.push(value & 255);
            byteArr.push((value >> 8) & 255);
        }
        return Utility._convertByteArrToFormatedHex(byteArr);
    }

    private static _convertByteArrToFormatedHex(byteArr: Array<number>): string {
        let hexStr = "",
            i,
            len,
            tmpHex;

        if (!Utility.isArray(byteArr)) {
            return "";
        }

        len = byteArr.length;

        for (i = 0; i < len; ++i) {
            if (byteArr[i] < 0) {
                byteArr[i] = byteArr[i] + 256;
            }
            if (byteArr[i] === undefined) {
                Log.instance.notice(`[Utility] convertToFormatedHex: Boom ${i}`);
                byteArr[i] = 0;
            }
            tmpHex = byteArr[i].toString(16);

            // Add leading zero.
            if (tmpHex.length == 1) {
                tmpHex = "0" + tmpHex;
            }

            /*
             if ((i + 1) % 16 === 0) {
             tmp_hex += "\n";
             } else {
             tmp_hex += " ";
             }
             */

            hexStr += tmpHex;
        }

        return hexStr.trim();
    }

    public static isArray(object: any) {
        if (object === Array) {
            return true;
        } else if (typeof Array.isArray === "function") {
            return Array.isArray(object);
        }
        else {
            return (object instanceof Array);
        }
    }

    public static isVoid(object: any) {
        return (typeof object === undefined || !object);
    }

    public static generateFileMd5(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            LibMd5File(path, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                return resolve(hash);
            });
        });
    }

    public static compressToHexStr(str: string): string {
        return Utility.convertStringToFormatedHex(LZString.compress(str));
    }

    public static decompressFromHexStr(str: string): string {
        return LZString.decompress(Utility.convertFormatedHexToString(str));
    }

    public static toUnicode(str: string): string {
        let result = "";
        for (let i = 0; i < str.length; i++) {
            result += "\\u" + ("000" + str[i].charCodeAt(0).toString(16)).substr(-4);
        }
        return result;
    }

    public static fromUnicode(str: string): string {
        return unescape(str.replace(/\\/g, "%"));
    };

    public static convertToObject(input: Object): Object {
        let obj = Object.create(null);
        for (let k in input) {
            let v = input[k];
            if (v instanceof Map) {
                v = Utility.convertMapToObject(v);
            } else if (typeof v === "object") {
                v = Utility.convertToObject(v);
            }
            obj[k] = v;
        }
        return obj;
    }

    public static convertMapToObject(input: Map<any, any>): Object {
        let obj = Object.create(null);
        for (let [k, v] of input) {
            if (v instanceof Map) {
                v = Utility.convertMapToObject(v);
            } else if (typeof v === "object") {
                v = Utility.convertToObject(v);
            }
            // We don’t escape the key '__proto__'
            // which can cause problems on older engines
            obj[k] = v;
        }
        return obj;
    }

    public static ucFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    public static lcFirst(str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    };

}

export default Utility;