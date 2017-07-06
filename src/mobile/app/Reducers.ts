import * as SceneInitReducer from "../scene/init/Reducer";
import * as SceneServantListReducer from "../scene/servant/list/Reducer";
import * as SceneServantInfoReducer from "../scene/servant/detail/Reducer";
import * as SceneGoalReducer from "../scene/goal/list/Reducer";
import * as SceneItemRequirement from "../scene/goal/item_requirement/Reducer";

export default {
    [SceneInitReducer.StateName]: SceneInitReducer.Reducers,
    [SceneServantListReducer.StateName]: SceneServantListReducer.Reducers,
    [SceneServantInfoReducer.StateName]: SceneServantInfoReducer.Reducers,
    [SceneGoalReducer.StateName]: SceneGoalReducer.Reducers,
    [SceneItemRequirement.StateName]: SceneItemRequirement.Reducers,
};