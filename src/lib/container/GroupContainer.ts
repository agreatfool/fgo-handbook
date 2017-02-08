import BaseContainer from "./base/BaseContainer";

export default class GroupContainer<T> extends BaseContainer<T> {

    protected _groupIdAttributeName: string;
    protected _idAttributeName: string;
    protected _data: Map<number, Map<number, T>>;

    constructor() {
        super();
        this._data = new Map<number, Map<number, T>>();
    }

    public get(groupId: number, id: number) {
        if (this.hasGroup(groupId)) {
            return this.getGroup(groupId).get(id);
        } else {
            return null;
        }
    }

    public getGroup(groupId: number) {
        if (this.hasGroup(groupId)) {
            return this._data.get(groupId);
        } else {
            return null;
        }
    }

    public set(groupId: number, id: number, element: T) {
        if (!this.hasGroup(groupId)) {
            return false;
        } else {
            let group = this.getGroup(groupId);
            group.set(id, element);
            this.setGroup(groupId, group);
            return true;
        }
    }

    public setGroup(groupId: number, group: Map<number, T>) {
        this._data.set(groupId, group);
    }

    public has(groupId: number, id: number) {
        let result = false;

        if (this._data.has(groupId)) {
            result = this._data.get(groupId).has(id);
        }

        return result;
    }

    public hasGroup(groupId: number) {
        return this._data.has(groupId);
    }

    public initGroup(groupId: number) {
        if (this.hasGroup(groupId)) {
            return;
        }
        this.setGroup(groupId, new Map<number, T>());
    }

    public findGroup(groupId: number) {
        if (this.hasGroup(groupId)) {
            return this.getGroup(groupId);
        } else {
            return null;
        }
    }

    public find(groupId: number, id: number) {
        let result = null;

        if (this.hasGroup(groupId)) {
            let group = this.getGroup(groupId);
            if (group.has(id)) {
                result = group.get(id);
            }
        }

        return result;
    }

    public iterator() {
        return this._data.entries();
    }

    public groupIterator(groupId: number) {
        if (this.hasGroup(groupId)) {
            return this._data.get(groupId).entries();
        } else {
            return null;
        }
    }

    public _parse(groupIdAttributeName: string, idAttributeName: string, rawData: Array<Object>) {
        rawData.forEach((element) => {
            let groupId = element[groupIdAttributeName];
            let id = element[idAttributeName];
            this.initGroup(groupId);
            this.set(groupId, id, element as T);
        });

        return this;
    }

    public parse(rawData: Array<Object>) {
        return this._parse(this._groupIdAttributeName, this._idAttributeName, rawData);
    }

}