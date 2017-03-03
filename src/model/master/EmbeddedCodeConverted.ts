export interface EmbeddedCodeConverted {
    individuality: Map<number, string>;
    gender: Map<number, string>;
    policy: Map<number, string>;
    personality: Map<number, string>;
    attri: Map<number, string>;
    rankFont: Map<number, string>;
    rankSymbol: Map<number, string>;
    transSvtName: Map<number, TransSvtName>;
    transSkillDetail: Map<number, TransSkillDetail>;
    transTreasureDetail: Map<number, TransTreasureDetail>
}

export interface TransSvtName {
    svtId: number;
    name: string; // 阿爾托莉亞・潘德拉剛
    battleName: string; // 阿爾托莉亞
}

export interface TransSkillDetail {
    skillId: number;
    detail: string; // 我方全體的防禦力提升[Lv.](3回合)
    effect1: Array<string>; // ["10%", ...]
    effect2: Array<string>; // ["10%", ...]
    effect3: Array<string>; // ["10%", ...]
}

export interface TransTreasureDetail {
    treasureId: number;
    detail: string; // 對敵全體的強力攻擊[Lv.] ＋ 自身的NP再累積<OverCharge的話效果UP>
    effect1: Array<string>; // ["300%", ...]
    effect2: Array<string>; // ["20%", ...]
    effect3: Array<string>; // ["20%", ...]
    effect4: Array<string>; // ["20%", ...]
}

export default EmbeddedCodeConverted;