export interface SvtInfo {
    baseInfo?: SvtInfoBase;
    skillInfo?: SvtInfoSkill;
    storyInfo?: SvtInfoStory;
    materialInfo?: SvtInfoMaterial;
}

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
//-* BASIC
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export interface SvtInfoBase extends SvtInfo {
    svtId: number;
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
    cardBuster: SvtInfoBaseCardInfo;
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
    powerRank: SvtInfoRank; // (筋力:) A
    defenseRank: SvtInfoRank; // (耐久:) A
    agilityRank: SvtInfoRank; // (敏捷:) A
    magicRank: SvtInfoRank; // (魔力:) A
    luckRank: SvtInfoRank; // (幸运:) A
    treasureRank: SvtInfoRank; // (宝具:) A
}

export interface SvtInfoBaseHpAtk {
    hp: number;
    atk: number;
}

export interface SvtInfoBaseCardInfo {
    count: number;
    hits: number;
}

export interface SvtInfoRank {
    display: string; // 显示：A+++
    value: number; // 数值：30
}

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
//-* SKILL
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export interface SvtInfoSkill extends SvtInfo {
    svtId: number;
    skills: Array<SvtInfoSkillDetail>;
    passiveSkills: Array<SvtInfoPassiveSkill>;
    treasures: Array<SvtInfoTreasureDetail>;
}

export interface SvtInfoSkillDetail {
    skillId: number;
    name: string;
    chargeTurn: number;
    condition: string; // 开放条件
    iconId: number;
    skillEffects: Array<SvtInfoSkillEffect>;
}

export interface SvtInfoPassiveSkill {
    skillId: number;
    name: string;
    iconId: number;
    skillEffects: Array<SvtInfoSkillEffect>;
}

export interface SvtInfoSkillEffect {
    description: string;
    effects: Array<string>; // ["30%", "32%", ...]
}

export interface SvtInfoTreasureDetail {
    treasureId: number;
    name: string;
    rank: string; // EX
    type: string; // 対軍宝具
    condition: string; // 开放条件
    cardId: number; // 宝具类型：Art、Buster、Quick
    hits: number;
    effects: Array<SvtInfoTreasureEffect>
}

export interface SvtInfoTreasureEffect {
    description: string;
    effects: Array<string>; // ["30%", "32%", ...]
}

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
//-* STORY
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export interface SvtInfoStory extends SvtInfo {
    svtId: number;
    friendshipRequirements: Array<SvtInfoFSReq>; // 羁绊需求
    detail: string; // 角色详细
    friendship1: string; // 绊1故事
    friendship2: string; // 绊2故事
    friendship3: string; // 绊3故事
    friendship4: string; // 绊4故事
    friendship5: string; // 绊5故事
    lastStory: string; // 最终故事
}

export interface SvtInfoFSReq {
    current: number; // 当前等级需求的絆
    total: number; // 总共积累的需求
}

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
//-* MATERIAL
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export interface SvtInfoMaterial extends SvtInfo {
    svtId: number;
    limit: Array<SvtInfoMaterialLimit>; // 灵基再临需求
    skill: Array<SvtInfoMaterialSkill>; // 技能需求
}

export interface SvtInfoMaterialLimit {
    items: Array<SvtInfoMaterialDetail>;
    qp: number;
}

export interface SvtInfoMaterialSkill {
    items: Array<SvtInfoMaterialDetail>;
    qp: number;
}

export interface SvtInfoMaterialDetail {
    itemId: number;
    count: number;
}

//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
//-* FILTER
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
export enum SvtOrderChoices {
    collectionNo,
    rarity,
}

export enum SvtOrderDirections {
    ASC,
    DESC,
}