export interface MstClass { // 职阶信息
    id: number;
    name: string;
    attackRate: number;
}

export interface MstSkill { // 技能表
    id: number; // 1000
    type: number; // 1
    name: string; // 今は脆き雪花の壁
    maxLv: number; // 10
    iconId: number; // 400
}

export interface MstSvt { // 从者主信息
    relateQuestIds: Array<number>;
    individuality: Array<number>; // 特性
    classPassive: Array<number>; // 职阶被动技能
    cardIds: Array<number>; // 指令卡配卡
    script: Object; // {}
    id: number;
    baseSvtId: number;
    name: string; // 显示名
    ruby: string;
    battleName: string;
    classId: number; // 职阶ID
    type: number; // 类型99貌似是特殊类型，类似活动从者，一般不用处理
    limitMax: number; // 灵基再临上限；从0开始，一般是4，解放4次
    rewardLv: number;
    friendshipId: number; // 羁绊等级升级数量 对应 MstFriendship
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

export interface MstSvtSkill { // 技能开放条件
    /**
     * master.mstSvtSkill[a].condLimitCount === -1 活动技能
     * 0 == master.mstSvtSkill[a].condLimitCount && 0 == master.mstSvtSkill[a].condQuestId && 0 == master.mstSvtSkill[a].condLv 初期技能
     * 0 != master.mstSvtSkill[a].condLimitCount 靈基再臨第 X 階段
     * 0 != master.mstSvtSkill[a].condLv 等级限制
     * 0 != master.mstSvtSkill[a].condQuestId 关卡限制，通过 XXX 关卡
     */
    svtId: number;
    num: number;
    skillId: number;
    condQuestId: number; // 技能开放任务ID，一般为0
    condQuestPhase: number;
    condLv: number; // 等级限制
    condLimitCount: number; // 灵基再临阶段限制
}

export interface MstSkillLv { // 技能相关
    funcId: Array<any>; // []
    svals: Array<any>; // []
    script: Object; // {}
    skillId: number;
    lv: number;
    chargeTurn: number; // 冷却回合数
    skillDetailId: number;
}

export interface MstSkillDetail { // 技能解释文本
    id: number;
    detail: string; // 味方単体に無敵状態を付与(1ターン)＆NPを増やす[{0}]
}

export interface MstTreasureDevice { // 从者宝具
    id: number;
    name: string; // 無垢識・空の境界
    ruby: string; // むくしき・からのきょうかい
    rank: number; // EX
    maxLv: number; // 5
    typeText: string; // 対人宝具
}

export interface MstSvtTreasureDevice { // 从者宝具开放条件
    /**
     * 98 == master.mstSvtTreasureDevice[b].num NPC限定
     * 0 == master.mstSvtTreasureDevice[b].condQuestId && 0 == master.mstSvtTreasureDevice[b].condLv && 0 == master.mstSvtTreasureDevice[b].condFriendshipRank 初期
     * null != findName(master.mstQuest, master.mstSvtTreasureDevice[b].condQuestId) 任务获得 questRea(master.mstSvtTreasureDevice[b].condQuestId)
     * condLv 等级限制 到Lv.XX 解放
     * condFriendshipRank 羁绊等级 XX 解放
     * 未开放
     */
    damage: Array<number>;
    svtId: number;
    num: number;
    treasureDeviceId: number;
    condQuestId: number; // 技能开放任务ID，一般为0
    condQuestPhase: number;
    condLv: number; // 等级限制
    condFriendshipRank: number;
    cardId: number; // 指令卡：Art、Burster、Quick
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

export interface MstFriendship { // 羁绊等级定义
    id: number; // 对应 MstSvt.friendshipId
    rank: number; // 羁绊等级
    friendship: number; // 需求的羁绊数量
}

export interface MstSvtComment { // 从者信息文本
    svtId: number;
    id: number;
    priority: number;
    comment: string;
    condType: number; // 开放条件：9 灵基再临阶段；1 完成任务
    condValue: number;
    condValue2: number;
}

export interface MstCombineLimit { // 从者灵基再临需求
    itemIds: Array<number>; // [7001]
    itemNums: Array<number>; // [5]
    id: number; // 从者ID，关联 MstSvt.id
    svtLimit: number; // 0
    qp: number; // 100000
}

export interface MstCombineSkill { // 从者技能升级需求
    itemIds: Array<number>; // [6001]
    itemNums: Array<number>; // [5]
    id: number; // 从者ID，关联 MstSvt.id
    skillLv: number; // 当前技能等级：1升2，这里就是1
    qp: number; // 200000
}

export interface MstItem { // 道具表
    id: number; // 1
    name: string; // QP
    detail: string; // 【強化資源】\n量子の欠片。\n多くの可能性を許容する霊子のゆらぎ。\n燃料として、さまざまな魔術に使われる。
    imageId: number; // 5
    type: number; // 1
    dropPriority: number; // 9010
}

export interface MstSvtExp { // 从者经验需求
    /**
     * MstSvtLimit 从者数值表中只有从者的最高和基础攻击等数值，中间值需要用公式计算出来：
     * Math.floor(
     *     master.mstSvtLimit[m].atkBase + (
     *         master.mstSvtLimit[m].atkMax - master.mstSvtLimit[m].atkBase
     *     ) * master.mstSvtExp[l].curve / 1000
     * )
     * 升级曲率幅度计算：
     * (master.mstSvtExp[l].curve - master.mstSvtExp[l - 1].curve) / 10 + "%"
     */
    type: number; // 1 和 MstSvt.expType 一致
    lv: number; // 90 升级到这一级，而不是从这一级启升
    exp: number; // 12567000
    curve: number; // 1508 成长曲率
}