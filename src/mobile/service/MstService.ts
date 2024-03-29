import {MstFriendship, MstItem, MstSkillLv, MstSvt, MstSvtLimit, MstSvtSkill} from "../../model/master/Master";
import {SvtListFilter, SvtListOrder} from "../scene/servant/list/State";
import {
    SvtInfoBase,
    SvtInfoBaseCardInfo,
    SvtInfoBaseHpAtk,
    SvtInfoFSReq,
    SvtInfoMaterial,
    SvtInfoMaterialDetail,
    SvtInfoMaterialLimit,
    SvtInfoMaterialSkill,
    SvtInfoPassiveSkill,
    SvtInfoRank,
    SvtInfoSkill,
    SvtInfoSkillDetail,
    SvtInfoSkillEffect,
    SvtInfoStory,
    SvtInfoTreasureDetail,
    SvtInfoTreasureEffect,
    SvtOrderChoices,
    SvtOrderDirections
} from "../lib/model/MstInfo";
import Const from "../lib/const/Const";
import MstLoader from "../lib/model/MstLoader";
import {
    MstClassContainer,
    MstCombineLimitContainer,
    MstCombineSkillContainer,
    MstFriendshipContainer,
    MstSkillContainer,
    MstSkillLvContainer,
    MstSvtCardContainer,
    MstSvtCommentContainer,
    MstSvtContainer,
    MstSvtExpContainer,
    MstSvtSkillContainer,
    MstSvtTreasureDeviceContainer,
    MstTreasureDeviceContainer
} from "../../model/impl/MstContainer";
import MstUtil from "../lib/utility/MstUtil";
import {TransSvtName} from "../../model/master/EmbeddedCodeConverted";
import {CompareResItemDetail} from "../scene/goal/list/State";

export class Service {

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* GLOBAL SERVICE
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    public isItemVisible(itemId: number): boolean {
        return itemId >= 6001 // 剣の輝石
            && itemId !== 6008 // 無の輝石
            && itemId !== 6108 // 無の魔石
            && itemId !== 6208 // 無の秘石
            && itemId !== 6504 // 星の欠片
            && itemId !== 7008 // エクストラピース
            && itemId !== 7108 // エクストラモニュメント
            && itemId <= 7999;
    }

    public sortCompareResItems(items: Array<CompareResItemDetail | MstItem>, mstItems: Array<MstItem>): void {
        let getId = function (item: CompareResItemDetail | MstItem) {
            if (item.hasOwnProperty("itemId")) {
                return item["itemId"];
            } else {
                return item["id"];
            }
        };

        let findMstItem = function (item: CompareResItemDetail | MstItem): MstItem {
            let result = undefined;

            let id = getId(item);
            mstItems.forEach((mstItem: MstItem) => {
                if (mstItem.id === id) {
                    result = mstItem;
                }
            });

            if (result === undefined) {
                console.log(`Invalid res item sort: itemId: ${id}, no MstItem conf found.`);
            }

            return result;
        };

        items.sort(function(itemA: CompareResItemDetail | MstItem, itemB: CompareResItemDetail | MstItem) {
            let idA = getId(itemA);
            let idB = getId(itemB);

            if ((idA >= 6501 && idA <= 6999)
                && (idB >= 6501 && idB <= 6999)) {
                let mstA = findMstItem(itemA);
                let mstB = findMstItem(itemB);

                return mstA.dropPriority - mstB.dropPriority;
            } else {
                return idA - idB;
            }
        });
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* SERVANT SERVICE
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    public loadSvtRawData(): Array<MstSvt> {
        let container = MstLoader.instance.loadModel("MstSvt") as MstSvtContainer;

        return this._filterSvtRawData(container.getRaw());
    }

    public loadSvtRawDataConverted(): Array<MstSvt> {
        let container = MstLoader.instance.loadModel("MstSvt") as MstSvtContainer;
        let rawData = this._filterSvtRawData(container.getRaw());

        let embeddedNames: { [key: number]: TransSvtName } = MstLoader.instance.loadEmbeddedCode().transSvtName;

        rawData.forEach((svt: MstSvt, index) => {
            if (!embeddedNames.hasOwnProperty(svt.id)) {
                return;
            }
            let embeddedName = embeddedNames[svt.id];
            svt.name = embeddedName.name;
            svt.battleName = embeddedName.battleName;
            rawData[index] = svt;
        });

        return Service._sortSvtData(rawData, {
            order: SvtOrderChoices.collectionNo,
            direction: SvtOrderDirections.DESC,
        } as SvtListOrder);
    }

    public static buildSvtDisplayData(rawData: Array<MstSvt>, filter: SvtListFilter, order: SvtListOrder): Array<MstSvt> {
        return Service._sortSvtData(
            Service._filterSvtData(rawData, filter),
            order
        );
    }

    private _filterSvtRawData(rawData: Array<MstSvt>): Array<MstSvt> {
        return rawData.filter((element: MstSvt) => {
            return (Const.VALID_CLASS_IDS.indexOf(element.classId) !== -1)
                && (element.collectionNo > 0);
        });
    }

    private static _filterSvtData(data: Array<MstSvt>, filter: SvtListFilter): Array<MstSvt> {
        return data.filter((element: MstSvt) => {
            let classCondition = filter.classId ? (filter.classId.indexOf(element.classId + "") !== -1) : true;
            let genderCondition = filter.genderType ? (filter.genderType.indexOf(element.genderType + "") !== -1) : true;
            let rarityCondition = filter.rarity ? (filter.rarity.indexOf(Const.SERVANT_RARITY_MAPPING[element.rewardLv] + "") !== -1) : true;

            return classCondition && genderCondition && rarityCondition;
        });
    }

    private static _sortSvtData(data: Array<MstSvt>, order: SvtListOrder): Array<MstSvt> {
        let orderFieldName = SvtOrderChoices[order.order];

        let func: any;
        if (order.direction === SvtOrderDirections.DESC) {
            func = (elemA: MstSvt, elemB: MstSvt) => {
                return elemB[orderFieldName] - elemA[orderFieldName];
            };
        } else {
            func = (elemA: MstSvt, elemB: MstSvt) => {
                return elemA[orderFieldName] - elemB[orderFieldName];
            };
        }

        return data.sort(func);
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* SERVANT INFO: MAIN
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    // FIXME 剥离显示数值和显示文本，这部分的service应该做成纯粹的数据提供
    // FIXME State里的数据模型应该剥离出来，State里可以export，不过代码不应该放在那里；所有的State如果是用来显示的最好带上View的名字
    // FIXME 提高当前Service的复用度，很多函数尽量做的简单，提供纯粹的数据
    public getServantName(svtId: number): string {
        return (MstLoader.instance.loadEmbeddedSvtName(svtId) as TransSvtName).name;
    }

    public buildSvtInfoBase(svtId: number): SvtInfoBase {
        return this._getSvtInfoBase(svtId);
    }

    public buildSvtInfoSkill(svtId: number): SvtInfoSkill {
        return this._getSvtInfoSkill(svtId);
    }

    public buildSvtInfoStory(svtId: number): SvtInfoStory {
        return this._getSvtInfoStory(svtId);
    }

    public buildSvtInfoMaterial(svtId: number): SvtInfoMaterial {
        return this._getSvtInfoMaterial(svtId);
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* SERVANT INFO: BASE
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    private _getSvtInfoBase(svtId: number): SvtInfoBase {
        let infoBase = {} as SvtInfoBase;
        let mstSvt = (MstLoader.instance.loadModel("MstSvt") as MstSvtContainer).get(svtId);
        let mstSvtLimitDefault = MstLoader.instance.loadSvtDefaultLimitInfo(svtId);
        let mstDefaultTreasure = MstLoader.instance.loadSvtDefaultTreasureDeviceWithLv(svtId, 5);
        let mstClass = (MstLoader.instance.loadModel("MstClass") as MstClassContainer).get(mstSvt.classId);
        let mstSvtExpCon = MstLoader.instance.loadModel("MstSvtExp") as MstSvtExpContainer;
        let mstSvtCardCon = MstLoader.instance.loadModel("MstSvtCard") as MstSvtCardContainer;

        let embeddedCode = MstLoader.instance.loadEmbeddedCode();
        let embeddedGender = MstLoader.instance.loadEmbeddedGender(mstSvt.genderType);
        let embeddedAttri = MstLoader.instance.loadEmbeddedAttribute(mstSvt.attri);
        let embeddedTransName = MstLoader.instance.loadEmbeddedSvtName(svtId);
        let embeddedRankFont = embeddedCode.rankFont;
        let embeddedRandSymbol = embeddedCode.rankSymbol;

        infoBase.svtId = svtId;
        infoBase.collectionNo = mstSvt.collectionNo;
        infoBase.name = embeddedTransName.name;
        infoBase.className = Const.SERVANT_CLASS_NAMES[mstSvt.classId];
        infoBase.classification = embeddedAttri;
        infoBase.policy = this._getSvtPolicyDisplay(mstSvtLimitDefault);
        infoBase.attackRate = (mstClass === null) ? 100 : mstClass.attackRate / 10; // 某些特殊职阶可能无数据，默认给100
        infoBase.rarityNum = mstSvtLimitDefault.rarity;
        infoBase.rarity = this._getSvtRarityDisplay(mstSvtLimitDefault);
        infoBase.maxLevel = mstSvt.rewardLv;
        infoBase.hpAtkMax = {
            hp: mstSvtLimitDefault.hpMax,
            atk: mstSvtLimitDefault.atkMax,
        };
        infoBase.hpAtk80 = this._getSvtHpAtkViaLv(mstSvt.expType, 80, mstSvtLimitDefault, mstSvtExpCon);
        infoBase.hpAtk90 = this._getSvtHpAtkViaLv(mstSvt.expType, 90, mstSvtLimitDefault, mstSvtExpCon);
        infoBase.hpAtk100 = this._getSvtHpAtkViaLv(mstSvt.expType, 100, mstSvtLimitDefault, mstSvtExpCon);
        infoBase.gender = embeddedGender;
        infoBase.cardArt = this._getSvtCmdCardDisplay(svtId, Const.CMD_CARD_ID_ART, mstSvt, mstSvtCardCon);
        infoBase.cardBuster = this._getSvtCmdCardDisplay(svtId, Const.CMD_CARD_ID_BUSTER, mstSvt, mstSvtCardCon);
        infoBase.cardQuick = this._getSvtCmdCardDisplay(svtId, Const.CMD_CARD_ID_QUICK, mstSvt, mstSvtCardCon);
        infoBase.cardExtra = this._getSvtCmdCardDisplay(svtId, Const.CMD_CARD_ID_EXTRA, mstSvt, mstSvtCardCon);
        infoBase.starRate = mstSvt.starRate / 10;
        infoBase.individuality = this._getSvtIndividualityDisplay(mstSvt);
        infoBase.deathRate = mstSvt.deathRate / 10;
        infoBase.criticalWeight = mstSvtLimitDefault.criticalWeight;
        infoBase.npArt = mstDefaultTreasure.tdPointA / 100;
        infoBase.npBuster = mstDefaultTreasure.tdPointB / 100;
        infoBase.npQuick = mstDefaultTreasure.tdPointQ / 100;
        infoBase.npExtra = mstDefaultTreasure.tdPointEx / 100;
        infoBase.npTreasure = mstDefaultTreasure.tdPoint / 100;
        infoBase.npDefence = mstDefaultTreasure.tdPointDef / 100;
        infoBase.powerRank = this._getRankDisplay(mstSvtLimitDefault.power, embeddedRankFont, embeddedRandSymbol);
        infoBase.defenseRank = this._getRankDisplay(mstSvtLimitDefault.defense, embeddedRankFont, embeddedRandSymbol);
        infoBase.agilityRank = this._getRankDisplay(mstSvtLimitDefault.agility, embeddedRankFont, embeddedRandSymbol);
        infoBase.magicRank = this._getRankDisplay(mstSvtLimitDefault.magic, embeddedRankFont, embeddedRandSymbol);
        infoBase.luckRank = this._getRankDisplay(mstSvtLimitDefault.luck, embeddedRankFont, embeddedRandSymbol);
        infoBase.treasureRank = this._getRankDisplay(mstSvtLimitDefault.treasureDevice, embeddedRankFont, embeddedRandSymbol);

        return infoBase;
    }

    private _getSvtRarityDisplay(limit: MstSvtLimit): string {
        let display = "";
        for (let loop = 0; loop < limit.rarity; loop++) {
            display += "★";
        }

        return display;
    }

    private _getSvtPolicyDisplay(limit: MstSvtLimit): string {
        let policyName = MstLoader.instance.loadEmbeddedPolicy(limit.policy);
        let personalityName = MstLoader.instance.loadEmbeddedPersonality(limit.personality);

        return `${policyName}・${personalityName}`;
    }

    private _getSvtHpAtkViaLv(expType: number, level: number, limit: MstSvtLimit, expCon: MstSvtExpContainer): SvtInfoBaseHpAtk {
        let mstSvtExp = expCon.get(expType, level);

        let hpBase = limit.hpBase;
        let hpMax = limit.hpMax;
        let atkBase = limit.atkBase;
        let atkMax = limit.atkMax;

        let hpVal = Math.floor(hpBase + (hpMax - hpBase) * mstSvtExp.curve / 1000);
        let atkVal = Math.floor(atkBase + (atkMax - atkBase) * mstSvtExp.curve / 1000);

        return {
            hp: hpVal,
            atk: atkVal,
        };
    }

    private _getSvtCmdCardDisplay(svtId: number, cardId: number, svt: MstSvt, cardCon: MstSvtCardContainer): SvtInfoBaseCardInfo {
        let mstSvtCard = cardCon.get(svtId, cardId);

        let cardCount = 0;
        svt.cardIds.forEach((element) => {
            if (element as number === cardId) {
                cardCount++;
            }
        });

        let hitCount = 0;
        try {
            hitCount = mstSvtCard.normalDamage.length;
        } catch (e) { /* Just ignore it */
        }

        return {
            count: cardCount,
            hits: hitCount
        } as SvtInfoBaseCardInfo;
    }

    private _getSvtIndividualityDisplay(svt: MstSvt): Array<string> {
        let individuality = MstLoader.instance.loadEmbeddedCode().individuality;
        let individualityIds = Array.from(Object.keys(individuality));

        let display = [];
        svt.individuality.forEach((id) => {
            if (individualityIds.indexOf(id.toString()) != -1) {
                display.push(individuality[id]);
            }
        });

        return display;
    }

    private _getRankDisplay(value: number, rankFont: Object, rankSymbol: Object): SvtInfoRank {
        return {
            display: rankFont[Math.floor(value / 10)].trim() + rankSymbol[value % 10].trim(),
            value: value
        } as SvtInfoRank;
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* SERVANT INFO: SKILL
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    private _getSvtInfoSkill(svtId: number): SvtInfoSkill {
        let infoSkill = {} as SvtInfoSkill;

        let mstSvt = (MstLoader.instance.loadModel("MstSvt") as MstSvtContainer).get(svtId);
        let skillCon = MstLoader.instance.loadModel("MstSkill") as MstSkillContainer;
        let svtSkillCon = MstLoader.instance.loadModel("MstSvtSkill") as MstSvtSkillContainer;
        let skillLvCon = MstLoader.instance.loadModel("MstSkillLv") as MstSkillLvContainer;
        let embeddedSkillDetails = MstLoader.instance.loadEmbeddedCode().transSkillDetail;

        let treasureDeviceCon = MstLoader.instance.loadModel("MstTreasureDevice") as MstTreasureDeviceContainer;
        let svtTreasureDeviceCon = MstLoader.instance.loadModel("MstSvtTreasureDevice") as MstSvtTreasureDeviceContainer;
        let embeddedTreasureDetail = (MstLoader.instance.loadEmbeddedCode()).transTreasureDetail;

        infoSkill.svtId = svtId;
        infoSkill.skills = this._getSvtSkillsDisplay(svtId, skillCon, svtSkillCon, skillLvCon, embeddedSkillDetails);
        infoSkill.passiveSkills = this._getSvtPassiveSkillsDisplay(mstSvt, skillCon, embeddedSkillDetails);
        infoSkill.treasures = this._getSvtTreasuresDisplay(svtId, treasureDeviceCon, svtTreasureDeviceCon, embeddedTreasureDetail);

        return infoSkill;
    }

    private _getSvtSkillsDisplay(svtId: number,
                                 skillCon: MstSkillContainer,
                                 svtSkillCon: MstSvtSkillContainer,
                                 skillLvCon: MstSkillLvContainer,
                                 embeddedSkillDetails: Object): Array<SvtInfoSkillDetail> {
        let displays = [] as Array<SvtInfoSkillDetail>;

        let svtSkills = Array.from(svtSkillCon.getGroup(svtId).values());
        svtSkills.forEach((svtSkill) => {
            let skill = skillCon.get(svtSkill.skillId);
            let embeddedDetail = embeddedSkillDetails[svtSkill.skillId];

            // FIXME 某些技能特效有4个，但effect列表只有3个，需要手动补齐；估计是数据源的问题，后续可能修复
            switch (svtSkill.skillId) {
                case 317550:
                    // 豹人第一技能
                    embeddedDetail["effect4"] = ["5", "6", "7", "8", "9", "10", "11", "12", "13", "15"];
                    break;
                case 13553:
                    // 枪大公第一技能
                    embeddedDetail["effect4"] = ["10%", "11%", "12%", "13%", "14%", "15%", "16%", "17%", "18%", "20%"];
                    break;
                case 356650:
                    // PassionLip第三技能
                    embeddedDetail["effect4"] = ["10%", "12%", "14%", "16%", "18%", "20%", "22%", "24%", "26%", "30%"];
                    embeddedDetail["effect5"] = [];
                    break;
                case 168251:
                    // 阿福第三技能
                    embeddedDetail["effect4"] = ["30%", "32%", "34%", "36%", "38%", "40%", "42%", "44%", "46%", "50%"];
                    break;
                case 433650:
                    // 艾蕾第三技能
                    embeddedDetail["effect4"] = ["2000", "2100", "2200", "2300", "2400", "2500", "2600", "2700", "2800", "2900", "3000"];
                    break;
                case 432650:
                    // 阿提拉弓第三技能
                    embeddedDetail["effect4"] = [];
                    break;
                default:
                    break;
            }

            let display = {} as SvtInfoSkillDetail;
            display.skillId = svtSkill.skillId;
            display.name = skill.name;
            display.chargeTurn = (skillLvCon.getGroup(svtSkill.skillId) as Map<number, MstSkillLv>).values().next().value.chargeTurn;
            display.iconId = skill.iconId;

            if (svtSkill.condLimitCount == -1) {
                display.condition = "活动开放";
            } else if (0 == svtSkill.condLimitCount && 0 == svtSkill.condQuestId && 0 == svtSkill.condLv) {
                display.condition = "初期开放";
            } else if (0 != svtSkill.condLimitCount) {
                display.condition = `灵基再临第${svtSkill.condLimitCount}阶段开放`;
            } else if (0 != svtSkill.condLv) {
                display.condition = `Lv.${svtSkill.condLv}开放`;
            } else if (0 != svtSkill.condQuestId) {
                display.condition = "任务获得";
            }

            display.skillEffects = [];
            let effects = embeddedDetail.detail.split(/[&＆＋]+/);
            effects.forEach((effect, index) => {
                let effectDisplay = {} as SvtInfoSkillEffect;
                let effectDisplayData = undefined;
                if (!embeddedDetail.hasOwnProperty(`effect${index + 1}`)) {
                    console.log(`Invalid svt skill effect: svtId: ${svtId}, skillId: ${svtSkill.skillId}, effect key: effect${index + 1}`, embeddedDetail);
                } else {
                    effectDisplayData = MstUtil.objValues(embeddedDetail[`effect${index + 1}`] as Map<number, string>)
                }

                effectDisplay.description = MstUtil.filterHtmlTags(effect.replace("<br>", "\n").trim());
                effectDisplay.effects = Array.from(effectDisplayData);
                display.skillEffects.push(effectDisplay);
            });

            displays.push(display);
        });

        return displays;
    }

    public _getSvtPassiveSkillsDisplay(mstSvt: MstSvt,
                                       skillCon: MstSkillContainer,
                                       embeddedSkillDetails: Object): Array<SvtInfoPassiveSkill> {
        let displays = [] as Array<SvtInfoPassiveSkill>;

        let passiveSkillIds = mstSvt.classPassive;
        if (passiveSkillIds.length == 0) {
            return displays;
        }

        passiveSkillIds.forEach((skillId) => {
            let skill = skillCon.get(skillId);
            let embeddedDetail = embeddedSkillDetails[skillId];
            let display = {} as SvtInfoPassiveSkill;

            display.skillId = skillId;
            display.name = skill.name;
            display.iconId = skill.iconId;
            display.skillEffects = [] as Array<SvtInfoSkillEffect>;

            let effects = embeddedDetail.detail.split(/[&＆＋]+/);
            effects.forEach((effect, index) => {
                display.skillEffects.push({
                    description: MstUtil.filterHtmlTags(effect.replace("<br>", "\n").trim()),
                    effects: [
                        embeddedDetail[`effect${index + 1}`][0]
                    ]
                } as SvtInfoSkillEffect);
            });

            displays.push(display);
        });

        return displays;
    }

    public _getSvtTreasuresDisplay(svtId: number,
                                   treasureDeviceCon: MstTreasureDeviceContainer,
                                   svtTreasureDeviceCon: MstSvtTreasureDeviceContainer,
                                   embeddedTreasureDetail: Object): Array<SvtInfoTreasureDetail> {
        let displays = [] as Array<SvtInfoTreasureDetail>;

        let treasures = Array.from(svtTreasureDeviceCon.getGroup(svtId).values()).filter((svtTreasure) => {
            return svtTreasure.treasureDeviceId != 100; // 虽然不知道什么情况下会是100，不过需要过滤掉
        });
        treasures.forEach((svtTreasure) => {
            let treasure = treasureDeviceCon.get(svtTreasure.treasureDeviceId);
            let detail = embeddedTreasureDetail[svtTreasure.treasureDeviceId];
            let display = {} as SvtInfoTreasureDetail;

            display.treasureId = svtTreasure.treasureDeviceId;
            display.name = treasure.name;
            display.rank = treasure.rank;
            display.type = treasure.typeText;
            display.cardId = svtTreasure.cardId;
            display.hits = svtTreasure.damage.length > 1 ? svtTreasure.damage.length : 1;
            display.effects = [] as Array<SvtInfoTreasureEffect>;

            if (svtTreasure.num == 98) {
                display.condition = "NPC限定";
            } else if (0 == svtTreasure.condQuestId && 0 == svtTreasure.condLv && 0 == svtTreasure.condFriendshipRank) {
                display.condition = "初期获得";
            } else if (0 != svtTreasure.condQuestId) {
                display.condition = "任务获得";
            } else if (0 != svtTreasure.condLv) {
                display.condition = `Lv.${svtTreasure.condLv}解放`;
            } else if (0 != svtTreasure.condFriendshipRank) {
                display.condition = `絆等級${svtTreasure.condFriendshipRank}解放`;
            } else {
                display.condition = "未開放";
            }

            let effects = detail.detail.split(/[&＆＋]+/);
            effects.forEach((effect, index) => {
                let effectDisplay = {} as SvtInfoTreasureEffect;
                effectDisplay.description = MstUtil.filterHtmlTags(effect.replace("<br>", "\n").trim());
                effectDisplay.effects = Array.from(MstUtil.objValues(detail[`effect${index + 1}`] as Map<number, string>));
                display.effects.push(effectDisplay);
            });

            displays.push(display);
        });

        return displays;
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* SERVANT INFO: STORY
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    private _getSvtInfoStory(svtId: number): SvtInfoStory {
        let infoStory = {} as SvtInfoStory;

        let mstSvt = (MstLoader.instance.loadModel("MstSvt") as MstSvtContainer).get(svtId);
        let svtComments = (MstLoader.instance.loadModel("MstSvtComment") as MstSvtCommentContainer).getGroup(svtId);
        let mstFriendshipCon = MstLoader.instance.loadModel("MstFriendship") as MstFriendshipContainer;

        infoStory.svtId = svtId;
        infoStory.friendshipRequirements = [];
        if (mstSvt.friendshipId != 1000) { // 需要过滤，理由不明
            infoStory.friendshipRequirements = this._getFriendshipRequirementDisplay(mstSvt, mstFriendshipCon);
        }
        infoStory.detail = svtComments ? svtComments.get(1).comment : "";
        infoStory.friendship1 = svtComments ? svtComments.get(2).comment : "";
        infoStory.friendship2 = svtComments ? svtComments.get(3).comment : "";
        infoStory.friendship3 = svtComments ? svtComments.get(4).comment : "";
        infoStory.friendship4 = svtComments ? svtComments.get(5).comment : "";
        infoStory.friendship5 = svtComments ? svtComments.get(6).comment : "";
        infoStory.lastStory = svtComments ? svtComments.get(7).comment : "";

        return infoStory;
    }

    private _getFriendshipRequirementDisplay(mstSvt: MstSvt,
                                             mstFriendshipCon: MstFriendshipContainer): Array<SvtInfoFSReq> {
        let displays = [] as Array<SvtInfoFSReq>;

        let friendships = Array.from((mstFriendshipCon.getGroup(mstSvt.friendshipId) as Map<number, MstFriendship>).values());
        friendships.forEach((friendship, index) => {
            if (friendship.rank == 10) { // 有效的是 0 - 9
                return;
            }
            let current = index === 0 ? friendship.friendship : friendship.friendship - friendships[index - 1].friendship;
            let total = friendship.friendship;
            displays.push({
                current: current,
                total: total
            } as SvtInfoFSReq);
        });

        return displays;
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* SERVANT INFO: MATERIAL
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    private _getSvtInfoMaterial(svtId: number): SvtInfoMaterial {
        let infoMaterial = {} as SvtInfoMaterial;

        infoMaterial.svtId = svtId;
        infoMaterial.limit = [] as Array<SvtInfoMaterialLimit>;
        infoMaterial.skill = [] as Array<SvtInfoMaterialSkill>;

        let svtCombineLimits = Array.from((MstLoader.instance.loadModel("MstCombineLimit") as MstCombineLimitContainer).getGroup(svtId).values());
        let svtCombineSkills = Array.from((MstLoader.instance.loadModel("MstCombineSkill") as MstCombineSkillContainer).getGroup(svtId).values());

        svtCombineLimits.forEach((limit) => {
            let data = {} as SvtInfoMaterialLimit;
            data.items = [] as Array<SvtInfoMaterialDetail>;
            limit.itemIds.forEach((itemId, index) => {
                data.items.push({
                    itemId: itemId,
                    count: limit.itemNums[index]
                } as SvtInfoMaterialDetail);
            });
            data.qp = limit.qp;
            infoMaterial.limit.push(data);
        });


        svtCombineSkills.forEach((limit) => {
            let data = {} as SvtInfoMaterialSkill;
            data.items = [] as Array<SvtInfoMaterialDetail>;
            limit.itemIds.forEach((itemId, index) => {
                data.items.push({
                    itemId: itemId,
                    count: limit.itemNums[index]
                } as SvtInfoMaterialDetail);
            });
            data.qp = limit.qp;
            infoMaterial.skill.push(data);
        });

        return infoMaterial;
    }
}