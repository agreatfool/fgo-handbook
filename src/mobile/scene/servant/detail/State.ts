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
    attackRate: number; // 职阶补正: 杀 90(%)
    rarityNum: number; // 1-5
    rarity: string; // ★★★★★
    maxLevel: number;
    hpAtk80: SvtInfoBaseHpAtk; // 这些数据都不含强化；强化配置为常量 Const.MAX_VAL_WITH_UPGRADE
    hpAtk90: SvtInfoBaseHpAtk;
    hpAtk100: SvtInfoBaseHpAtk;
    hpAtkMax: SvtInfoBaseHpAtk;
    gender: string;
    cardArt: SvtInfoBaseCardInfo;
    cartBuster: SvtInfoBaseCardInfo;
    cardQuick: SvtInfoBaseCardInfo;
    cardExtra: SvtInfoBaseCardInfo;
    starRate: number; // 出星率(%)
    individuality: Array<string>; // ["騎乘", "人型", "龍", "阿爾托莉亞臉", ...]
    deathRate: number; // 被即死率(%)
    criticalWeight: number; // 集星权重
    npArt: number; // np获得，Art；0.98(%)
    npBuster: number;
    npQuick: number;
    npExtra: number;
    npTreasure: number;
    npDefence: number;
}

export interface SvtInfoBaseHpAtk {
    hp: number;
    atk: number;
}

export interface SvtInfoBaseCardInfo {
    count: number;
    hits: number;
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
    items: Array<SvtMaterial>;
    qp: number;
}

export interface SvtMaterialSkill {
    items: Array<SvtMaterial>;
    qp: number;
}

export interface SvtMaterial {
    itemId: number;
    count: number;
}