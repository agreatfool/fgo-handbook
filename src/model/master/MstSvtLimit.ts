interface MstSvtLimit { // 从者数值
    svtId: number;
    limitCount: number; // 灵基再临阶段，从0开始；等于和svtId组成了一个联合主键
    rarity: number; // 星级
    lvMax: number;
    hpBase: number; // 1级血量
    hpMax: number; // 满级血量
    atkBase: number; // 1级攻击
    atkMax: number; // 满级攻击
    criticalWeight: number;
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

export default MstSvtLimit;