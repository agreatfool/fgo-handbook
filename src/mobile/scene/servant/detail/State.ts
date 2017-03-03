export interface State {
    svtId: number;
    svtInfo: SvtInfo;
    title: string; // 页面标题，和从者名字同步
}

export const defaultState = {
    svtId: -1,
    svtInfo: {},
    title: "ServantDetail",
} as State;

export const StateName = "SceneServantInfo";

export interface SvtInfo {
    svtId: number;
    infoBase: SvtInfoBase;
    infoSkill: SvtInfoSkill;
    infoStory: SvtInfoStory;
    infoMaterial: SvtInfoMaterial;
}

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
//-* BASIC
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export interface SvtInfoBase {
    collectionNo: number;
    name: string;
    className: string; // 职阶名
    classification: string; // 人天地星獸
    policy: string; // 混沌 恶
    attackRate: string; // 职阶补正: 杀 0.9
    rarity: string; // ★★★★★
    maxLevel: number;
    hpMax: string;
    atkMax: string;
    hp90: string;
    atk90: string;
    hp100: string;
    atk100: string;
    gender: string;
    cardArt: string;
    cartBuster: string;
    cardQuick: string;
    cardExtra: string;
    starRate: string; // 出星率
    individuality: string; // 騎乘,人型,龍,阿爾托莉亞臉
    deathRate: string; // 被即死率
    criticalWeight: number; // 集星权重
    npArt: string; // np获得，Art
    npBuster: string;
    npQuick: string;
    npExtra: string;
    npTreasure: string;
    npDefence: string;
}

export interface SvtHpAtkObj {
    hp: string | number;
    atk: string | number;
}

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
//-* SKILL
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export interface SvtInfoSkill {
    skills: Array<SvtSkill>;
    passiveSkills: Array<SvtPassiveSkill>;
    treasures: Array<SvtTreasure>;
}

export interface SvtSkill {
    skillId: number;
    name: string;
    chargeTurn: number;
    condition: string; // 开放条件
    iconId: number;
    skillEffects: Array<SvtSkillEffect>;
}

export interface SvtSkillEffect {
    description: string;
    effects: Array<string>; // ["30%", "32%", ...]
}

export interface SvtPassiveSkill {
    skillId: number;
    name: string;
    effects: Array<string>;
}

export interface SvtTreasure {
    treasureId: number;
    name: string;
    rank: string;
    type: string;
    condition: string; // 开放条件
    cardId: number; // 宝具类型：Art、Buster、Quick
    hits: string;
    effects: Array<SvtTreasureEffect>
}

export interface SvtTreasureEffect {
    description: string;
    effects: Array<string>;
}

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
//-* STORY
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export interface SvtInfoStory {
    powerRank: string; // 筋力: A
    defenseRank: string; // 耐久
    agilityRank: string; // 敏捷
    magicRank: string; // 魔力
    luckRank: string; // 幸运
    treasureRank: string; // 宝具
    friendshipRequirements: Array<string>; // 羁绊需求
    detail: string; // 角色详细
    friendship1: string; // 绊1故事
    friendship2: string; // 绊2故事
    friendship3: string; // 绊3故事
    friendship4: string; // 绊4故事
    friendship5: string; // 绊5故事
    lastStory: string;
}

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
//-* MATERIAL
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export interface SvtInfoMaterial {
    limit: Array<SvtMaterialLimit>; // 灵基再临需求
    skill: Array<SvtMaterialSkill>; // 技能需求
}

export interface SvtMaterialLimit {
    itemId: number;
    count: number;
    qp: number;
}

export interface SvtMaterialSkill {
    itemId1: number;
    count1: number;
    itemId2: number;
    count2: number;
    qp: number;
}