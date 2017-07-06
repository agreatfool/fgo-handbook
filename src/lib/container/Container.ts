import BaseContainer from "./base/BaseContainer";

export default class Container<T> extends BaseContainer<T> {

    protected _idAttributeName: string;
    protected _data: Map<number, T>;
    protected _raw: Array<T>;

    constructor() {
        super();
        this._data = new Map<number, T>();
    }

    public get(id: number): T {
        if (this.has(id)) {
            return this._data.get(id);
        } else {
            return undefined;
        }
    }

    public set(id: number, element: T): boolean {
        this._data.set(id, element);
        return true;
    }

    public has(id: number): boolean {
        return this._data.has(id);
    }

    public find(id: number): T {
        if (this._data.has(id)) {
            return this._data.get(id);
        } else {
            return undefined;
        }
    }

    public iterator(): IterableIterator<[number, T]> {
        return this._data.entries();
    }

    public count(): number {
        return this._data.size;
    }

    public getRaw(): Array<T> {
        return this._raw;
    }

    public _parse(idAttributeName: string, rawData: Array<any>): Container<T> {
        rawData.forEach((element) => {
            this.set(element[idAttributeName], element as T);
        });

        return this;
    }

    public parse(rawData: Array<any>): Container<T> {
        this._raw = rawData;
        return this._parse(this._idAttributeName, rawData);
    }

}