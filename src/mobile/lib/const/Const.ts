export default class Const {

    public static readonly GITHUB_BASE: string = "https://raw.githubusercontent.com/agreatfool/fgo-handbook";
    public static readonly DB_FILE_PATH: string = "database.json";
    public static readonly SERVANT_IN_ROW: number = 5;
    public static readonly VALID_CLASS_IDS: Array<number> = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 11, // 剑弓枪骑术杀狂盾裁仇
        17, // GrandCaster
        20, // 提亚马特
        22, // 魔神王盖提亚
    ];
    public static readonly SERVANT_CLASS_NAMES: {[key: number]: string} = {
        1: "剑士",
        2: "弓手",
        3: "枪兵",
        4: "骑兵",
        5: "术士",
        6: "暗杀",
        7: "狂战",
        8: "盾",
        9: "裁决",
        11: "复仇",
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
    public static readonly GOAL_ITEM_LIST: {[key: number]: string} = {
        6001: "剣の輝石", 6002: "弓の輝石", 6003: "槍の輝石", 6004: "騎の輝石", 6005: "術の輝石", 6006: "殺の輝石", 6007: "狂の輝石",
        6101: "剣の魔石", 6102: "弓の魔石", 6103: "槍の魔石", 6104: "騎の魔石", 6105: "術の魔石", 6106: "殺の魔石", 6107: "狂の魔石",
        6201: "剣の秘石", 6202: "弓の秘石", 6203: "槍の秘石", 6204: "騎の秘石", 6205: "術の秘石", 6206: "殺の秘石", 6207: "狂の秘石",
        6501: "鳳凰の羽根", 6502: "世界樹の種", 6503: "英雄の証", 6505: "虚影の塵", 6506: "竜の逆鱗", 6507: "混沌の爪",
        6508: "ゴーストランタン", 6509: "蛇の宝玉", 6510: "無間の歯車", 6511: "禁断の頁", 6512: "竜の牙", 6513: "隕蹄鉄",
        6514: "ホムンクルスベビー", 6515: "八連双晶", 6516: "凶骨", 6517: "蛮神の心臓", 6518: "精霊根", 6519: "戦馬の幼角",
        6520: "血の涙石", 6521: "黒獣脂", 6522: "愚者の鎖", 6523: "封魔のランプ", 6524: "大騎士勲章", 6525: "智慧のスカラベ",
        6526: "追憶の貝殻", 6527: "万死の毒針", 6528: "原初の産毛", 6529: "呪獣胆石",
        6999: "伝承結晶",
        7001: "セイバーピース", 7002: "アーチャーピース", 7003: "ランサーピース", 7004: "ライダーピース",
        7005: "キャスターピース", 7006: "アサシンピース", 7007: "バーサーカーピース",
        7101: "セイバーモニュメント", 7102: "アーチャーモニュメント", 7103: "ランサーモニュメント", 7104: "ライダーモニュメント",
        7105: "キャスターモニュメント", 7106: "アサシンモニュメント", 7107: "バーサーカーモニュメント",
        7999: "聖杯",
    };
    public static readonly CMD_CARD_ID_ART: number      = 1;
    public static readonly CMD_CARD_ID_BUSTER: number   = 2;
    public static readonly CMD_CARD_ID_QUICK: number    = 3;
    public static readonly CMD_CARD_ID_EXTRA: number    = 4;
    public static readonly MAX_VAL_WITH_UPGRADE: number = 990;

}