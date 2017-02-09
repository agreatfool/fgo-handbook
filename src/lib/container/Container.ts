import BaseContainer from "./base/BaseContainer";

export default class Container<T> extends BaseContainer<T> {

    protected _idAttributeName: string;
    protected _data: Map<number, T>;

    constructor() {
        super();
        this._data = new Map<number, T>();
    }

    public get(id: number): T {
        if (this.has(id)) {
            return this._data.get(id);
        } else {
            return null;
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
            return null;
        }
    }

    public iterator(): IterableIterator<[number, T]> {
        return this._data.entries();
    }

    public count(): number {
        return this._data.size;
    }

    public _parse(idAttributeName: string, rawData: Array<Object>): Container<T> {
        rawData.forEach((element) => {
            this.set(element[idAttributeName], element as T);
        });

        return this;
    }

    public parse(rawData: Array<Object>): Container<T> {
        return this._parse(this._idAttributeName, rawData);
    }

}