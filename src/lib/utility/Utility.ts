import * as LibMd5File from "md5-file";

declare function unescape(s: string): string;

class Utility {

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