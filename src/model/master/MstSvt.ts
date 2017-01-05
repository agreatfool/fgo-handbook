export default class MstSvt { // 从者主信息
    private relateQuestIds: Array<number>;
    private individuality: Array<number>; // 特性
    private classPassive: Array<number>;
    private cardIds: Array<number>;
    private script: Object; // {}
    private id: number;
    private baseSvtId: number;
    private name: string; // 显示名
    private ruby: string;
    private battleName: string;
    private classId: number; // 职阶ID
    private type: number;
    private limitMax: number; // 灵基再临上限；从0开始，一般是4，解放4次
    private rewardLv: number;
    private friendshipId: number;
    private maxFriendshipRank: number;
    private genderType: number; // 性别
    private attri: number;
    private combineSkillId: number;
    private combineLimitId: number;
    private sellQp: number;
    private sellMana: number;
    private sellRarePri: number;
    private expType: number;
    private combineMaterialId: number;
    private cost: number;
    private battleSize: number;
    private starRate: number;
    private deathRate: number;
    private attackAttri: number;
    private illustratorId: number; // 画师ID
    private cvId: number; // 声优ID
    private collectionNo: number; // 图鉴编号
}