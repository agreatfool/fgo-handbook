export default class MstSvtLimit { // 从者数值
    private svtId: number;
    private limitCount: number; // 灵基再临阶段，从0开始；等于和svtId组成了一个联合主键
    private rarity: number; // 星级
    private lvMax: number;
    private hpBase: number; // 1级血量
    private hpMax: number; // 满级血量
    private atkBase: number; // 1级攻击
    private atkMax: number; // 满级攻击
    private criticalWeight: number;
    private power: number;
    private defense: number;
    private agility: number;
    private magic: number;
    private luck: number;
    private treasureDevice: number;
    private policy: number; // 阵营：中立 混沌 秩序 ? ? 中立
    private personality: number; // 个性：善 惡 ? 狂 中庸 ? 花嫁 夏
    private deity: number;
}