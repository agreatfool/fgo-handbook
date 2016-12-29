import * as LibMd5File from "md5-file";

class Utility {

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

}

export default Utility;