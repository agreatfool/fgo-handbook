export interface EmbeddedCodeConverted {
    // FIXME 类型转换问题
    // 代码：
    // let names = {1: "jonathan", 2: "david"} as Map<number, string>;
    // console.log(names.get(1));
    // 编译时会报错：Property 'clear' is missing in type '{ 1: string; 2: string; }'.
    // 实际上就是在 JSON 结构内缺失 Map 需要的一些元素
    // 而当前结构体所对应的 JSON 也是无法顺利转换成 Map 的
    // 当前申明的结构因为结构定义和类型转换是在不同的代码中，编译器并不能第一时间找到问题，因此看起来编译是通过的
    // 实际运行就会报错：names.get is not a function
    // TypeScript 在使用 as 进行类型转换的时候，并不能直接把 Object 转成对应的 Map，切记
    // 当前使用时只能使用 Object 将就
    individuality: {[key: number]: string}; // Map<number, string>;
    gender: {[key: number]: string}; // Map<number, string>;
    policy: {[key: number]: string}; // Map<number, string>;
    personality: {[key: number]: string}; // Map<number, string>;
    attri: {[key: number]: string}; // Map<number, string>;
    rankFont: {[key: number]: string}; // Map<number, string>;
    rankSymbol: {[key: number]: string}; // Map<number, string>;
    transSvtName: {[key: number]: TransSvtName}; // Map<number, TransSvtName>;
    transSkillDetail: {[key: number]: TransSkillDetail}; // Map<number, TransSkillDetail>;
    transTreasureDetail: {[key: number]: TransTreasureDetail}; // Map<number, TransTreasureDetail>
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