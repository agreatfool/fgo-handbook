export interface State {
    svtId: number;
    svtInfo: SvtInfo;
    title: string; // 页面标题，和从者名字同步
}

export const defaultState = {
    svtId: 100100, // 吾王
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
    attribute: string; // 混沌 恶
    attackRate: string; // 职阶补正: 杀 0.9
    rarity: string; // ★★★★★
    maxLevel: number;
    hpMax: number;
    atkMax: number;
    hp90: number;
    atk90: number;
    hp100: number;
    atk100: number;
    gender: string;
    cardArt: string;
    cartBuster: string;
    cardQuick: string;
    cardExtra: string;
    starRate: string; // 出星率
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
    classSkills: Array<SvtClassSkill>;
    treasure: SvtTreasure;
    treasureUp?: SvtTreasure; // 宝具强化后效果
}

export interface SvtSkill {
    name: string;
    coolDown: number;
    condition: string; // 开放条件
    skillEffects: Array<SvtSkillEffect>;
}

export interface SvtSkillEffect {
    description: string;
    effects: Array<string>; // ["30%", "32%", ...]
}

export interface SvtClassSkill {
    name: string;
    effects: Array<string>;
}

export interface SvtTreasure {
    name: string;
    level: string;
    type: string;
    condition: string; // 开放条件
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
    powerLv: string; // 筋力: A
    defenseLv: string; // 耐久
    agilityLv: string; // 敏捷
    magicLv: string; // 魔力
    luckLv: string; // 幸运
    treasureLv: string; // 宝具
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

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
//-* OTHERS
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export enum SvtCommandCardId {
    Art = 1,
    Buster = 2,
    Quick = 3,
    Extra = 4,
}