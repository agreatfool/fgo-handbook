import * as SceneInitReducer from "../scene/init/Reducer";
import * as SceneServantListReducer from "../scene/servant/main/Reducer";
import * as SceneServantInfoReducer from "../scene/servant/detail/Reducer";

export default {
    [SceneInitReducer.StateName]: SceneInitReducer.Reducers,
    [SceneServantListReducer.StateName]: SceneServantListReducer.Reducers,
    [SceneServantInfoReducer.StateName]: SceneServantInfoReducer.Reducers,
};