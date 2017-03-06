import * as SceneInitReducer from "../scene/init/Reducer";
import * as SceneServantListReducer from "../scene/servant/main/Reducer";
import * as SceneServantInfoBaseReducer from "../scene/servant/detail/Reducer";
import * as SceneServantInfoMaterialReducer from "../scene/servant/material/Reducer";
import * as SceneServantInfoSkillReducer from "../scene/servant/skill/Reducer";
import * as SceneServantInfoStoryReducer from "../scene/servant/story/Reducer";

export default {
    [SceneInitReducer.StateName]: SceneInitReducer.Reducers,
    [SceneServantListReducer.StateName]: SceneServantListReducer.Reducers,
    [SceneServantInfoBaseReducer.StateName]: SceneServantInfoBaseReducer.Reducers,
    [SceneServantInfoMaterialReducer.StateName]: SceneServantInfoMaterialReducer.Reducers,
    [SceneServantInfoSkillReducer.StateName]: SceneServantInfoSkillReducer.Reducers,
    [SceneServantInfoStoryReducer.StateName]: SceneServantInfoStoryReducer.Reducers,
};