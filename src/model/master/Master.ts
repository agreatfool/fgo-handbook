export interface MstClass { // 职阶信息
    id: number;
    name: string;
    attackRate: number;
}

export interface MstSkill { // 技能表
    id: number;
    type: number;
    name: string;
    maxLv: number;
    iconId: number;
}

export interface MstSvt { // 从者主信息
    relateQuestIds: Array<number>;
    individuality: Array<number>; // 特性
    classPassive: Array<number>;
    cardIds: Array<number>; // 指令卡配卡
    script: Object; // {}
    id: number;
    baseSvtId: number;
    name: string; // 显示名
    ruby: string;
    battleName: string;
    classId: number; // 职阶ID
    type: number;
    limitMax: number; // 灵基再临上限；从0开始，一般是4，解放4次
    rewardLv: number;
    friendshipId: number;
    maxFriendshipRank: number;
    genderType: number; // 性别
    attri: number; // 属性：？人天地星獸
    combineSkillId: number;
    combineLimitId: number;
    sellQp: number;
    sellMana: number;
    sellRarePri: number;
    expType: number;
    combineMaterialId: number;
    cost: number;
    battleSize: number;
    starRate: number; // 星星发生率
    deathRate: number; // 被即死率
    attackAttri: number;
    illustratorId: number; // 画师ID
    cvId: number; // 声优ID
    collectionNo: number; // 图鉴编号
}

export interface MstSvtCard { // 从者指令卡
    /**
     * 每一个 MstSvtCard 都是一种指令卡：红、蓝、绿、Ex
     * 其中任何一个数组中的每一个数值都是一HIT，每个数组中所有成员的数值总合都为100，
     * 意味着占攻击100%中的百分之多少，数组的长度就是该卡的HIT总数
     * CardId:
     * 1. Art; 2. Buster; 3. Quick; 4. Extra
     */
    normalDamage: Array<number>;
    singleDamage: Array<number>;
    trinityDamage: Array<number>;
    unisonDamage: Array<number>;
    grandDamage: Array<number>;
    svtId: number;
    cardId: number;
}

export interface MstSvtLimit { // 从者数值
    svtId: number;
    limitCount: number; // 灵基再临阶段，从0开始；等于和svtId组成了一个联合主键
    rarity: number; // 星级
    lvMax: number;
    hpBase: number; // 1级血量
    hpMax: number; // 满级血量
    atkBase: number; // 1级攻击
    atkMax: number; // 满级攻击
    criticalWeight: number; // 暴击权重
    power: number;
    defense: number;
    agility: number;
    magic: number;
    luck: number;
    treasureDevice: number;
    policy: number; // 阵营：中立 混沌 秩序 ? ? 中立
    personality: number; // 个性：善 惡 ? 狂 中庸 ? 花嫁 夏
    deity: number;
}

export interface MstSvtSkill {
    svtId: number;
    num: number;
    skillId: number;
    condQuestId: number;
    condQuestPhase: number;
    condLv: number;
    condLimitCount: number;
}

export interface MstTreasureDeviceLv { // 主要用来计算NP效率
    /**
     * 查找判断:
     * Math.floor(master.mstTreasureDeviceLv[a].treaureDeviceId / 100) == Math.floor(master.mstSvt[k].id / 100)
     * ||
     * (master.mstSvt[k].id == 9935400 && master.mstTreasureDeviceLv[a].treaureDeviceId == 400)
     *
     * NP效率:
     * Art:         master.mstTreasureDeviceLv[a].tdPointA / 100
     * Buster:      master.mstTreasureDeviceLv[a].tdPointB / 100
     * Quick:       master.mstTreasureDeviceLv[a].tdPointQ / 100
     * Extra:       master.mstTreasureDeviceLv[a].tdPointEx / 100
     * Treasure:    master.mstTreasureDeviceLv[a].tdPoint / 100
     * Def:         master.mstTreasureDeviceLv[a].tdPointDef / 100
     */
    treaureDeviceId: number;
    lv: number;
    tdPoint: number;
    tdPointQ: number;
    tdPointA: number;
    tdPointB: number;
    tdPointEx: number;
    tdPointDef: number;
}