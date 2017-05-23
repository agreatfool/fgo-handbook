import InjectedProps from "../../../../lib/react/InjectedProps";
import {MstSvt} from "../../../../model/master/Master";
import {
    MstCombineLimitContainer, MstCombineSkillContainer, MstSkillContainer,
    MstSvtSkillContainer
} from "../../../../model/impl/MstContainer";
import {defaultMstGoal, MstGoal} from "../../../lib/model/MstGoal";

export interface CompareResult {
    totalLimit: Array<CompareResItemDetail>; // 全目标灵基再临需求
    totalSkill: Array<CompareResItemDetail>; // 全目标技能需求
    totalQP: number;                         // 全体QP需求量
    servants: Array<CompareResSvt>;
    items: Array<CompareResItem>;
}

export interface CompareResItemDetail {
    itemId: number;
    count: number;
}

export interface CompareResSvt { // 单名从者的全部需求
    svtId: number;
    totalLimit: Array<CompareResItemDetail>;    // 全灵基再临材料需求
    totalLimitQP: number;                       // 全灵基QP需求
    totalSkill: Array<CompareResItemDetail>;    // 全技能材料需求
    totalSkillQP: number;                       // 全技能QP需求
    limit: Array<Array<CompareResItemDetail>>;  // 索引是灵基再临等级
    skills: Array<CompareResSkill>;
}

export interface CompareResSkill {
    skillId: number;
    levels: Array<Array<CompareResItemDetail>>; // 索引是技能等级
}

export interface CompareResItem { // 单个道具的所有需求
    itemId: number;
    servants: Array<CompareResSvtItem>;
}

export interface CompareResSvtItem {
    svtId: number;
    count: number;
}

export interface State extends MstGoal {
    svtRawData: Array<MstSvt>;
    svtSkillData: MstSvtSkillContainer;
    skillCombineData: MstCombineSkillContainer;
    limitCombineData: MstCombineLimitContainer;
    skillData: MstSkillContainer;
    compareResult: CompareResult;
}

export const defaultState = defaultMstGoal as State;

export const StateName = "SceneGoal";

export interface Props extends InjectedProps {
    SceneGoal: State;
}