import * as SceneInitReducer from "../scene/init/Reducer";
import * as SceneServantListReducer from "../scene/servant/main/Reducer";

export default {
    [SceneInitReducer.StateName]: SceneInitReducer.Reducers,
    [SceneServantListReducer.StateName]: SceneServantListReducer.Reducers,
};