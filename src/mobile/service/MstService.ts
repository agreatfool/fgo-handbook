import {MstSvt, MstSvtSkill, MstSkillLv, MstFriendship, MstSvtLimit} from "../../model/master/Master";
import {SvtListFilter} from "../scene/servant/main/State";
import Const from "../lib/const/Const";
import {
    SvtInfoBase,
    SvtInfoBaseHpAtk,
    SvtInfoSkill,
    SvtInfoSkillDetail,
    SvtInfoSkillEffect,
    SvtInfoPassiveSkill,
    SvtInfoTreasureDetail,
    SvtInfoTreasureEffect,
    SvtInfoStory,
    SvtInfoMaterial,
    SvtInfoMaterialLimit,
    SvtInfoMaterialDetail,
    SvtInfoMaterialSkill,
    SvtInfoBaseCardInfo,
    SvtInfoRank,
    SvtInfoFSReq
} from "../lib/model/MstInfo";
import MstLoader from "../lib/model/MstLoader";
import {
    MstSvtContainer,
    MstClassContainer,
    MstSvtExpContainer,
    MstSvtCardContainer,
    MstSkillLvContainer,
    MstSvtSkillContainer,
    MstSkillContainer,
    MstSvtTreasureDeviceContainer,
    MstTreasureDeviceContainer,
    MstFriendshipContainer,
    MstSvtCommentContainer,
    MstCombineLimitContainer,
    MstCombineSkillContainer
} from "../../model/impl/MstContainer";
import MstUtil from "../lib/model/MstUtil";
import {TransSvtName} from "../../model/master/EmbeddedCodeConverted";

export class Service {

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* SERVANT LIST
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    public filterSvtRawData(rawData: Array<MstSvt>): Array<MstSvt> {
        return rawData.filter((element: MstSvt) => {
            return (Const.VALID_CLASS_IDS.indexOf(element.classId) !== -1)
                && (element.collectionNo > 0);
        });
    }

    public static filterSvtDisplayData(rawData: Array<MstSvt>, filter: SvtListFilter): Array<Array<MstSvt>> {
        // FIXME not done yet
        return [];
    }

    public sortSvtDataWithNoDesc(rawData: Array<MstSvt>): Array<MstSvt> {
        return rawData.sort((elemA: MstSvt, elemB: MstSvt) => {
            return elemB.collectionNo - elemA.collectionNo;
        });
    }

    public divideRawSvtIntoRows(rawData: Array<MstSvt>, svtInRow = Const.SERVANT_IN_ROW): Array<Array<MstSvt>> {
        let result: Array<Array<MstSvt>> = [];

        for (let index = 0, loop = rawData.length; index < loop; index += svtInRow) {
            result.push(rawData.slice(index, index + svtInRow));
        }

        return result;
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* SERVANT INFO: MAIN
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    // FIXME 剥离显示数值和显示文本，这部分的service应该做成纯粹的数据提供
    // FIXME State里的数据模型应该剥离出来，State里可以export，不过代码不应该放在那里；所有的State如果是用来显示的最好带上View的名字
    // FIXME 提高当前Service的复用度，很多函数尽量做的简单，提供纯粹的数据
    public async getServantName(svtId: number): Promise<string> {
        return Promise.resolve((await MstLoader.instance.loadEmbeddedSvtName(svtId) as TransSvtName).name);
    }

    public async buildSvtInfoBase(svtId: number): Promise<SvtInfoBase> {
        return await this._getSvtInfoBase(svtId);
    }

    public async buildSvtInfoSkill(svtId: number): Promise<SvtInfoSkill> {
        return await this._getSvtInfoSkill(svtId);
    }

    public async buildSvtInfoStory(svtId: number): Promise<SvtInfoStory> {
        return await this._getSvtInfoStory(svtId);
    }

    public async buildSvtInfoMaterial(svtId: number): Promise<SvtInfoMaterial> {
        return await this._getSvtInfoMaterial(svtId);
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* SERVANT INFO: BASE
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    private async _getSvtInfoBase(svtId: number): Promise<SvtInfoBase> {
        let infoBase = {} as SvtInfoBase;
        let mstSvt = (await MstLoader.instance.loadModel("MstSvt") as MstSvtContainer).get(svtId);
        let mstSvtLimitDefault = await MstLoader.instance.loadSvtDefaultLimitInfo(svtId);
        let mstDefaultTreasure = await MstLoader.instance.loadSvtDefaultTreasureDeviceWithLv(svtId, 5);
        let mstClass = (await MstLoader.instance.loadModel("MstClass") as MstClassContainer).get(mstSvt.classId);
        let mstSvtExpCon = await MstLoader.instance.loadModel("MstSvtExp") as MstSvtExpContainer;
        let mstSvtCardCon = await MstLoader.instance.loadModel("MstSvtCard") as MstSvtCardContainer;

        let embeddedCode = await MstLoader.instance.loadEmbeddedCode();
        let embeddedGender = await MstLoader.instance.loadEmbeddedGender(mstSvt.genderType);
        let embeddedAttri = await MstLoader.instance.loadEmbeddedAttribute(mstSvt.attri);
        let embeddedTransName = await MstLoader.instance.loadEmbeddedSvtName(svtId);
        let embeddedRankFont = embeddedCode.rankFont;
        let embeddedRandSymbol = embeddedCode.rankSymbol;

        infoBase.svtId = svtId;
        infoBase.collectionNo = mstSvt.collectionNo;
        infoBase.name = embeddedTransName.name;
        infoBase.className = Const.SERVANT_CLASS_NAMES[mstSvt.classId];
        infoBase.classification = embeddedAttri;
        infoBase.policy = await this._getSvtPolicyDisplay(mstSvtLimitDefault);
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
        infoBase.individuality = await this._getSvtIndividualityDisplay(mstSvt);
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

        return Promise.resolve(infoBase);
    }

    private _getSvtRarityDisplay(limit: MstSvtLimit): string {
        let display = "";
        for (let loop = 0; loop < limit.rarity; loop++) {
            display += "★";
        }

        return display;
    }

    private async _getSvtPolicyDisplay(limit: MstSvtLimit): Promise<string> {
        let policyName = await MstLoader.instance.loadEmbeddedPolicy(limit.policy);
        let personalityName = await MstLoader.instance.loadEmbeddedPersonality(limit.personality);

        return Promise.resolve(`${policyName}・${personalityName}`);
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
        let hitCount = mstSvtCard.normalDamage.length;

        return {
            count: cardCount,
            hits: hitCount
        } as SvtInfoBaseCardInfo;
    }

    private async _getSvtIndividualityDisplay(svt: MstSvt): Promise<Array<string>> {
        let individuality = (await MstLoader.instance.loadEmbeddedCode()).individuality;
        let individualityIds = Array.from(Object.keys(individuality));

        let display = [];
        svt.individuality.forEach((id) => {
            if (individualityIds.indexOf(id.toString()) != -1) {
                display.push(individuality[id]);
            }
        });

        return Promise.resolve(display);
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
    private async _getSvtInfoSkill(svtId: number): Promise<SvtInfoSkill> {
        let infoSkill = {} as SvtInfoSkill;

        let mstSvt = (await MstLoader.instance.loadModel("MstSvt") as MstSvtContainer).get(svtId);
        let skillCon = await MstLoader.instance.loadModel("MstSkill") as MstSkillContainer;
        let svtSkillCon = await MstLoader.instance.loadModel("MstSvtSkill") as MstSvtSkillContainer;
        let skillLvCon = await MstLoader.instance.loadModel("MstSkillLv") as MstSkillLvContainer;
        let embeddedSkillDetails = (await MstLoader.instance.loadEmbeddedCode()).transSkillDetail;

        let treasureDeviceCon = await MstLoader.instance.loadModel("MstTreasureDevice") as MstTreasureDeviceContainer;
        let svtTreasureDeviceCon = await MstLoader.instance.loadModel("MstSvtTreasureDevice") as MstSvtTreasureDeviceContainer;
        let embeddedTreasureDetail = (await MstLoader.instance.loadEmbeddedCode()).transTreasureDetail;

        infoSkill.svtId = svtId;
        infoSkill.skills = this._getSvtSkillsDisplay(svtId, skillCon, svtSkillCon, skillLvCon, embeddedSkillDetails);
        infoSkill.passiveSkills = this._getSvtPassiveSkillsDisplay(mstSvt, skillCon, embeddedSkillDetails);
        infoSkill.treasures = this._getSvtTreasuresDisplay(svtId, treasureDeviceCon, svtTreasureDeviceCon, embeddedTreasureDetail);

        return Promise.resolve(infoSkill);
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

            // FIXME 豹人的第一技能特效有4个，但effect列表只有3个，手动补齐一个；估计是数据源的问题，后续可能修复
            if (svtSkill.skillId === 317550) {
                embeddedDetail["effect4"] = ["5", "6", "7", "8", "9", "10", "11", "12", "13", "15"];
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
                effectDisplay.description = effect.replace("<br>", "\n").trim();
                effectDisplay.effects = Array.from(MstUtil.objValues(embeddedDetail[`effect${index + 1}`] as Map<number, string>));
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
                    description: effect.replace("<br>", "\n").trim(),
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
                effectDisplay.description = effect.trim();
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
    private async _getSvtInfoStory(svtId: number): Promise<SvtInfoStory> {
        let infoStory = {} as SvtInfoStory;

        let mstSvt = (await MstLoader.instance.loadModel("MstSvt") as MstSvtContainer).get(svtId);
        let svtComments = (await MstLoader.instance.loadModel("MstSvtComment") as MstSvtCommentContainer).getGroup(svtId);
        let mstFriendshipCon = await MstLoader.instance.loadModel("MstFriendship") as MstFriendshipContainer;

        infoStory.svtId = svtId;
        infoStory.friendshipRequirements = [];
        if (mstSvt.friendshipId != 1000) { // 需要过滤，理由不明
            infoStory.friendshipRequirements = this._getFriendshipRequirementDisplay(mstSvt, mstFriendshipCon);
        }
        infoStory.detail = svtComments.get(1).comment;
        infoStory.friendship1 = svtComments.get(2).comment;
        infoStory.friendship2 = svtComments.get(3).comment;
        infoStory.friendship3 = svtComments.get(4).comment;
        infoStory.friendship4 = svtComments.get(5).comment;
        infoStory.friendship5 = svtComments.get(6).comment;
        infoStory.lastStory = svtComments.get(7).comment;

        return Promise.resolve(infoStory);
    }

    private _getFriendshipRequirementDisplay(mstSvt: MstSvt,
                                             mstFriendshipCon: MstFriendshipContainer): Array<SvtInfoFSReq> {
        let displays = [] as Array<SvtInfoFSReq>;

        let friendships = Array.from((mstFriendshipCon.getGroup(mstSvt.friendshipId) as Map<number, MstFriendship>).values());
        let total = 0;
        friendships.forEach((friendship) => {
            if (friendship.rank == 10) { // 有效的是 0 - 9
                return;
            }
            let current = friendship.friendship;
            total += friendship.friendship;
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
    private async _getSvtInfoMaterial(svtId: number): Promise<SvtInfoMaterial> {
        let infoMaterial = {} as SvtInfoMaterial;

        infoMaterial.svtId = svtId;
        infoMaterial.limit = [] as Array<SvtInfoMaterialLimit>;
        infoMaterial.skill = [] as Array<SvtInfoMaterialSkill>;

        let svtCombineLimits = Array.from((await MstLoader.instance.loadModel("MstCombineLimit") as MstCombineLimitContainer).getGroup(svtId).values());
        let svtCombineSkills = Array.from((await MstLoader.instance.loadModel("MstCombineSkill") as MstCombineSkillContainer).getGroup(svtId).values());

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

        return Promise.resolve(infoMaterial);
    }
}