import BaseContainer from "./base/BaseContainer";

export default class Container<T> extends BaseContainer<T> {

    protected _idAttributeName: string;
    protected _data: Map<number, T>;

    constructor() {
        super();
        this._data = new Map<number, T>();
    }

    public add(id: number, element: T) {
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

    public _parse(idAttributeName: string, rawData: any) {
        rawData = rawData as Array<Object>;
        rawData.forEach((element) => {
            this.add(element[idAttributeName], element);
        });

        return this;
    }

    public parse(rawData: any) {
        return this._parse(this._idAttributeName, rawData);
    }

}