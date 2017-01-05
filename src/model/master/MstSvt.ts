interface MstSvt { // 从者主信息
    relateQuestIds: Array<number>;
    individuality: Array<number>; // 特性
    classPassive: Array<number>;
    cardIds: Array<number>;
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
    attri: number;
    combineSkillId: number;
    combineLimitId: number;
    sellQp: number;
    sellMana: number;
    sellRarePri: number;
    expType: number;
    combineMaterialId: number;
    cost: number;
    battleSize: number;
    starRate: number;
    deathRate: number;
    attackAttri: number;
    illustratorId: number; // 画师ID
    cvId: number; // 声优ID
    collectionNo: number; // 图鉴编号
}

export default MstSvt;