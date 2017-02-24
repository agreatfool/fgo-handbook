import * as SceneInitReducer from "../scene/init/Reducer";
import * as CellReducer from "../component/cell/Reducer";

export default {
    [SceneInitReducer.StateName]: SceneInitReducer.Reducers,
    [CellReducer.StateName]: CellReducer.Reducers
};