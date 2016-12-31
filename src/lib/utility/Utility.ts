import * as LZString from "lz-string";
import * as LibMd5File from "md5-file";

import Log from "../log/Log";

class Utility {

    public convertFormatedHexToString(str: string): string {
        let byteArr = this.convertFormatedHexToBytes(str);
        if (byteArr === false) {
            return "";
        }

        let res = "";
        for (let i: number = 0 ; i < byteArr.length; i += 2) {
            res += String.fromCharCode(byteArr[i] | (byteArr[i+1] << 8));
        }
        return res;
    }

    private convertFormatedHexToBytes(hexStr: string): false | Array<number> {
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

    public convertStringToFormatedHex(str: string): string {
        let byteArr = [];
        for (let i = 0 ; i < str.length; i++) {
            let value = str.charCodeAt(i);
            byteArr.push(value & 255);
            byteArr.push((value>>8) & 255);
        }
        return this.convertByteArrToFormatedHex(byteArr);
    }

    private convertByteArrToFormatedHex(byteArr: Array<number>): string {
        var hexStr = "",
            i,
            len,
            tmpHex;

        if (!this.isArray(byteArr)) {
            return "";
        }

        len = byteArr.length;

        for (i = 0; i < len; ++i) {
            if (byteArr[i] < 0) {
                byteArr[i] = byteArr[i] + 256;
            }
            if (byteArr[i] === undefined) {
                Log.log(`[Utility] convertToFormatedHex: Boom ${i}`);
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

    public isArray(input: any): Boolean {
        return typeof(input) === "object" && (input instanceof Array);
    }

    public generateFileMd5(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            LibMd5File(path, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                return resolve(hash);
            });
        });
    }

    public compressToHexStr(str: string): string {
        return this.convertStringToFormatedHex(LZString.compress(str));
    }

    public decompressFromHexStr(str: string): string {
        return LZString.decompress(this.convertFormatedHexToString(str));
    }

}

export default Utility;