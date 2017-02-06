import BaseContainer from "./base/BaseContainer";

export default class GroupContainer<T> extends BaseContainer<T> {

    protected _groupIdAttributeName: string;
    protected _idAttributeName: string;
    protected _data: Map<number, Map<number, T>>;

    constructor() {
        super();
        this._data = new Map<number, Map<number, T>>();
    }

    public add(groupId: number, id: number, element: T) {
        if (!this._data.has(groupId)) {
            return false;
        } else {
            let group = this._data.get(groupId);
            group.set(id, element);
            this._data.set(groupId, group);
            return true;
        }
    }

    public addGroup(groupId: number, group: Map<number, T>) {
        this._data.set(groupId, group);
    }

    public hasGroup(groupId: number) {
        return this._data.has(groupId);
    }

    public initGroup(groupId: number) {
        if (this._data.has(groupId)) {
            return;
        }
        this._data.set(groupId, new Map<number, T>());
    }

    public has(groupId: number, id: number) {
        let result = false;

        if (this._data.has(groupId)) {
            result = this._data.get(groupId).has(id);
        }

        return result;
    }

    public findGroup(groupId: number) {
        if (this._data.has(groupId)) {
            return this._data.get(groupId);
        } else {
            return null;
        }
    }

    public find(groupId: number, id: number) {
        let result = null;

        if (this._data.has(groupId)) {
            let group = this._data.get(groupId);
            if (group.has(id)) {
                result = group.get(id);
            }
        }

        return result;
    }

    public _parse(groupIdAttributeName: string, idAttributeName: string, rawData: any) {
        rawData = rawData as Array<Object>;
        rawData.forEach((element) => {
            let groupId = element[groupIdAttributeName];
            let id = element[idAttributeName];
            this.initGroup(groupId);
            this.add(groupId, id, element);
        });

        return this;
    }

    public parse(rawData: any) {
        return this._parse(this._groupIdAttributeName, this._idAttributeName, rawData);
    }

}