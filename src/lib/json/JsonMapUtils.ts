/// <reference path="../../../node_modules/reflect-metadata/Reflect.d.ts" />

import "reflect-metadata";

const JSON_METADATA_KEY = "JsonProperty";

export interface IJsonMetaData<T> {
    name?: string,
    clazz?: {new(): T}
}

export function JsonProperty<T>(metadata?: IJsonMetaData<T> | string): any {
    if (metadata instanceof String || typeof metadata === "string"){
        return Reflect.metadata(JSON_METADATA_KEY, {
            name: metadata,
            clazz: undefined
        });
    } else {
        let metadataObj = <IJsonMetaData<T>>metadata;
        return Reflect.metadata(JSON_METADATA_KEY, {
            name: metadataObj ? metadataObj.name : undefined,
            clazz: metadataObj ? metadataObj.clazz : undefined
        });
    }
}

export function getClazz(target: any, propertyKey: string): any {
    return Reflect.getMetadata("design:type", target, propertyKey)
}

export function getJsonProperty<T>(target: any, propertyKey: string): IJsonMetaData<T> {
    return Reflect.getMetadata(JSON_METADATA_KEY, target, propertyKey);
}

export class JsonMapUtils {
    public static isPrimitive(obj) {
        switch (typeof obj) {
            case "string":
            case "number":
            case "boolean":
                return true;
        }
        return !!(obj instanceof String || obj === String ||
        obj instanceof Number || obj === Number ||
        obj instanceof Boolean || obj === Boolean);
    }

    public static isArray(object) {
        if (object === Array) {
            return true;
        } else if (typeof Array.isArray === "function") {
            return Array.isArray(object);
        }
        else {
            return !!(object instanceof Array);
        }
    }

    public static deserialize<T>(clazz: {new(): T}, jsonObject) {
        if ((clazz === undefined) || (jsonObject === undefined)) return undefined;
        let obj = new clazz();
        Object.keys(obj).forEach((key) => {
            let propertyMetadataFn: (IJsonMetaData) => any = (propertyMetadata) => {
                let propertyName = propertyMetadata.name || key;
                let innerJson = jsonObject ? jsonObject[propertyName] : undefined;
                let clazz = getClazz(obj, key);
                if (JsonMapUtils.isArray(clazz)) {
                    let metadata = getJsonProperty(obj, key);
                    if (metadata.clazz || JsonMapUtils.isPrimitive(clazz)) {
                        if (innerJson && JsonMapUtils.isArray(innerJson)) {
                            return innerJson.map(
                                (item) => JsonMapUtils.deserialize(metadata.clazz, item)
                            );
                        } else {
                            return undefined;
                        }
                    } else {
                        return innerJson;
                    }

                } else if (!JsonMapUtils.isPrimitive(clazz)) {
                    return JsonMapUtils.deserialize(clazz, innerJson);
                } else {
                    return jsonObject ? jsonObject[propertyName] : undefined;
                }
            };

            let propertyMetadata = getJsonProperty(obj, key);
            if (propertyMetadata) {
                obj[key] = propertyMetadataFn(propertyMetadata);
            } else {
                if (jsonObject && jsonObject[key] !== undefined) {
                    obj[key] = jsonObject[key];
                }
            }
        });
        return obj;
    }
}

/**
 * EXAMPLE
 */
// import { JsonProperty, JsonMapUtils } from "../lib/json/JsonMapUtils";
// class Address {
//     @JsonProperty('first-line')
//     firstLine: string;
//     @JsonProperty('second-line')
//     secondLine: string;
//     city: string;

//     // Default constructor will be called by mapper
//     constructor(){
//         this.firstLine = undefined;
//         this.secondLine = undefined;
//         this.city = undefined;
//     }
// }

// class Person {
//    name: string;
//    surname: string;
//    age: number;
//    @JsonProperty('address')
//    address: Address;

//    // Default constructor will be called by mapper
//    constructor(){
//        this.name = undefined;
//        this.surname = undefined;
//        this.age = undefined;
//        this.address = undefined;
//    }
// }

// console.log(JsonMapUtils.deserialize(Person, {
//     "name": "Mark",
//     "surname": "Galea",
//     "age": 30,
//     "address": {
//         "first-line": "Some where",
//         "second-line": "Over Here",
//         "city": "In This City"
//     }
// }));