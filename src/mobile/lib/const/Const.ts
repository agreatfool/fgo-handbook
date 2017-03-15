export default class Const {

    public static readonly GITHUB_BASE: string = "https://raw.githubusercontent.com/agreatfool/fgo-handbook";
    public static readonly SERVANT_IN_ROW: number = 5;
    public static readonly VALID_CLASS_IDS: Array<number> = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 11, // 剑弓枪骑术杀狂盾裁仇
        17, // GrandCaster
        20, // 提亚马特
        22, // 魔神王盖提亚
    ];
    public static readonly SERVANT_CLASS_NAMES = {
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
    public static readonly SERVANT_RARITY_MAPPING = {
        60: 1, // Lv60 一星
        65: 2,
        70: 3,
        80: 4,
        90: 5,
    };
    public static readonly CMD_CARD_ID_ART      = 1;
    public static readonly CMD_CARD_ID_BUSTER   = 2;
    public static readonly CMD_CARD_ID_QUICK    = 3;
    public static readonly CMD_CARD_ID_EXTRA    = 4;
    public static readonly MAX_VAL_WITH_UPGRADE = 990;

}