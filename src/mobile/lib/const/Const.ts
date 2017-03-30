export default class Const {

    public static readonly GITHUB_BASE: string = "https://raw.githubusercontent.com/agreatfool/fgo-handbook";
    public static readonly SERVANT_IN_ROW: number = 5;
    public static readonly VALID_CLASS_IDS: Array<number> = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 11, // 剑弓枪骑术杀狂盾裁仇
        17, // GrandCaster
        20, // 提亚马特
        22, // 魔神王盖提亚
    ];
    public static readonly SERVANT_CLASS_NAMES: {[key: number]: string} = {
        1: "Saber",
        2: "Archer",
        3: "Lancer",
        4: "Rider",
        5: "Caster",
        6: "Assassin",
        7: "Berserker",
        8: "Shielder",
        9: "Ruler",
        11: "Avenger",
    };
    public static readonly SERVANT_RARITY_MAPPING: {[key: number]: number} = {
        60: 1, // Lv60 一星
        65: 2,
        70: 3,
        80: 4,
        90: 5,
    };
    public static readonly SERVANT_GENDER_TYPES: {[key: number]: string} = {
        1: "男性",
        2: "女性",
        3: "無"
    };
    public static readonly SERVANT_RARITY_NAMES: {[key: number]: string} = {
        1: "1星",
        2: "2星",
        3: "3星",
        4: "4星",
        5: "5星",
    };
    public static readonly CMD_CARD_ID_ART: number      = 1;
    public static readonly CMD_CARD_ID_BUSTER: number   = 2;
    public static readonly CMD_CARD_ID_QUICK: number    = 3;
    public static readonly CMD_CARD_ID_EXTRA: number    = 4;
    public static readonly MAX_VAL_WITH_UPGRADE: number = 990;

}