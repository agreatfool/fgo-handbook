import BaseContainer from "./base/BaseContainer";

export default class Container<T> extends BaseContainer<T> {

    protected _idAttributeName: string;
    protected _data: Map<number, T>;

    constructor() {
        super();
        this._data = new Map<number, T>();
    }

    public get(id: number) {
        if (this.has(id)) {
            return this._data.get(id);
        } else {
            return null;
        }
    }

    public set(id: number, element: T) {
        return this._data.set(id, element);
    }

    public has(id: number) {
        return this._data.has(id);
    }

    public find(id: number) {
        if (this._data.has(id)) {
            return this._data.get(id);
        } else {
            return null;
        }
    }

    public iterator() {
        return this._data.entries();
    }

    public _parse(idAttributeName: string, rawData: Array<Object>) {
        rawData.forEach((element) => {
            this.set(element[idAttributeName], element as T);
        });

        return this;
    }

    public parse(rawData: Array<Object>) {
        return this._parse(this._idAttributeName, rawData);
    }

}