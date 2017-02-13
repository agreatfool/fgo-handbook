import {Reducer} from "redux";

export interface ReducerInterface<S> {
    action: string;
    reducer: Reducer<S>;
}

/**
 * @param reducers Array<ReducerInterface>, e.g [ RDCUpdateText ]
 */
export function bindComponentReducers(reducers: any) {
    return function (state, action) {
        let cloned = typeof state === 'undefined' ? {} : Object.assign({}, state);

        for (let reducerInterface of reducers) {
            if (action.type == reducerInterface.action) {
                cloned = reducerInterface.reducer(cloned, action);
                break;
            }
        }

        return cloned;
    }
}