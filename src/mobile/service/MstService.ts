import {MstSvt, MstSvtSkill, MstSkillLv, MstFriendship, MstSvtLimit} from "../../model/master/Master";
import {SvtListFilter} from "../scene/servant/main/State";
import Const from "../lib/const/Const";
import {
    SvtInfo,
    SvtInfoBase,
    SvtInfoBaseHpAtk,
    SvtInfoSkill,
    SvtSkill,
    SvtSkillEffect,
    SvtPassiveSkill,
    SvtTreasure,
    SvtTreasureEffect,
    SvtInfoStory,
    SvtInfoMaterial,
    SvtMaterialLimit,
    SvtMaterial,
    SvtMaterialSkill, SvtInfoBaseCardInfo
} from "../scene/servant/detail/State";
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
    public async buildSvtInfo(svtId: number): Promise<SvtInfo> {
        return Promise.resolve({
            svtId: svtId,
            infoBase: await this._getSvtInfoBase(svtId),
            infoSkill: await this._getSvtInfoSkill(svtId),
            infoStory: await this._getSvtInfoStory(svtId),
            infoMaterial: await this._getSvtInfoMaterial(svtId),
        } as SvtInfo);
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* SERVANT INFO: BASE
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    private async _getSvtInfoBase(svtId: number): Promise<SvtInfoBase> {
        let infoBase = {} as SvtInfoBase;
        let mstSvt = (await MstLoader.instance.loadModel("MstSvt") as MstSvtContainer).get(svtId);
        let mstSvtLimitMax = await MstLoader.instance.loadSvtMaxLimitInfo(svtId);
        let mstDefaultTreasure = await MstLoader.instance.loadSvtDefaultTreasureDeviceWithLv(svtId, 5);
        let mstClass = (await MstLoader.instance.loadModel("MstClass") as MstClassContainer).get(mstSvt.classId);
        let mstSvtExpCon = await MstLoader.instance.loadModel("MstSvtExp") as MstSvtExpContainer;
        let mstSvtCardCon = await MstLoader.instance.loadModel("MstSvtCard") as MstSvtCardContainer;

        let embeddedGender = await MstLoader.instance.loadEmbeddedGender(mstSvt.genderType);
        let embeddedAttri = await MstLoader.instance.loadEmbeddedAttribute(mstSvt.attri);
        let embeddedTransName = await MstLoader.instance.loadEmbeddedSvtName(svtId);

        infoBase.collectionNo = mstSvt.collectionNo;
        infoBase.name = embeddedTransName.name;
        infoBase.className = Const.SERVANT_CLASS_NAMES[mstSvt.classId];
        infoBase.classification = embeddedAttri;
        infoBase.policy = await this._getSvtPolicyDisplay(svtId, mstSvtLimitMax);
        infoBase.attackRate = mstClass.attackRate / 10;
        infoBase.rarityNum = mstSvtLimitMax.rarity;
        infoBase.rarity = await this._getSvtRarityDisplay(svtId, mstSvtLimitMax);
        infoBase.maxLevel = mstSvt.rewardLv;
        infoBase.hpAtkMax = {
            hp: mstSvtLimitMax.hpMax,
            atk: mstSvtLimitMax.atkMax,
        };
        infoBase.hpAtk80 = await this._getSvtHpAtkViaLv(svtId, mstSvt.expType, 80, mstSvtLimitMax, mstSvtExpCon);
        infoBase.hpAtk90 = await this._getSvtHpAtkViaLv(svtId, mstSvt.expType, 90, mstSvtLimitMax, mstSvtExpCon);
        infoBase.hpAtk100 = await this._getSvtHpAtkViaLv(svtId, mstSvt.expType, 100, mstSvtLimitMax, mstSvtExpCon);
        infoBase.gender = embeddedGender;
        infoBase.cardArt = await this._getSvtCmdCardDisplay(svtId, Const.CMD_CARD_ID_ART, mstSvt, mstSvtCardCon);
        infoBase.cartBuster = await this._getSvtCmdCardDisplay(svtId, Const.CMD_CARD_ID_BUSTER, mstSvt, mstSvtCardCon);
        infoBase.cardQuick = await this._getSvtCmdCardDisplay(svtId, Const.CMD_CARD_ID_QUICK, mstSvt, mstSvtCardCon);
        infoBase.cardExtra = await this._getSvtCmdCardDisplay(svtId, Const.CMD_CARD_ID_EXTRA, mstSvt, mstSvtCardCon);
        infoBase.starRate = mstSvt.starRate / 10;
        infoBase.individuality = await this._getSvtIndividualityDisplay(svtId);
        infoBase.deathRate = mstSvt.deathRate / 10;
        infoBase.criticalWeight = mstSvtLimitMax.criticalWeight;
        infoBase.npArt = mstDefaultTreasure.tdPointA / 100;
        infoBase.npBuster = mstDefaultTreasure.tdPointB / 100;
        infoBase.npQuick = mstDefaultTreasure.tdPointQ / 100;
        infoBase.npExtra = mstDefaultTreasure.tdPointEx / 100;
        infoBase.npTreasure = mstDefaultTreasure.tdPoint / 100;
        infoBase.npDefence = mstDefaultTreasure.tdPointDef / 100;

        return Promise.resolve(infoBase);
    }

    private async _getSvtRarityDisplay(svtId: number, limit?: MstSvtLimit): Promise<string> {
        if (!limit) {
            limit = await MstLoader.instance.loadSvtMaxLimitInfo(svtId);
        }

        let display = "";
        for (let loop = 0; loop < limit.rarity; loop++) {
            display += "★";
        }

        return Promise.resolve(display);
    }

    private async _getSvtPolicyDisplay(svtId: number, limit?: MstSvtLimit): Promise<string> {
        if (!limit) {
            limit = await MstLoader.instance.loadSvtMaxLimitInfo(svtId);
        }
        let policyName = await MstLoader.instance.loadEmbeddedPolicy(limit.policy);
        let personalityName = await MstLoader.instance.loadEmbeddedPersonality(limit.personality);

        return Promise.resolve(`${policyName}・${personalityName}`);
    }

    private async _getSvtHpAtkViaLv(svtId: number, expType: number, level: number, limit?: MstSvtLimit, expCon?: MstSvtExpContainer): Promise<SvtInfoBaseHpAtk> {
        if (!limit) {
            limit = await MstLoader.instance.loadSvtMaxLimitInfo(svtId);
        }
        if (!expCon) {
            expCon = await MstLoader.instance.loadModel("MstSvtExp") as MstSvtExpContainer;
        }
        let mstSvtExp = expCon.get(expType, level);

        let hpBase = limit.hpBase;
        let hpMax = limit.hpMax;
        let atkBase = limit.atkBase;
        let atkMax = limit.atkMax;

        let hpVal = Math.floor(hpBase + (hpMax - hpBase) * mstSvtExp.curve / 1000);
        let atkVal = Math.floor(atkBase + (atkMax - atkBase) * mstSvtExp.curve / 1000);

        return Promise.resolve({
            hp: hpVal,
            atk: atkVal,
        });
    }

    private async _getSvtCmdCardDisplay(svtId: number, cardId: number, svt?: MstSvt, cardCon?: MstSvtCardContainer): Promise<SvtInfoBaseCardInfo> {
        if (!svt) {
            svt = (await MstLoader.instance.loadModel("MstSvt") as MstSvtContainer).get(svtId);
        }
        if (!cardCon) {
            cardCon = await MstLoader.instance.loadModel("MstSvtCard") as MstSvtCardContainer;
        }
        let mstSvtCard = cardCon.get(svtId, cardId);

        let cardCount = 0;
        svt.cardIds.forEach((element) => {
            if (element as number === cardId) {
                cardCount++;
            }
        });
        let hitCount = mstSvtCard.normalDamage.length;

        return Promise.resolve({
            count: cardCount,
            hits: hitCount
        } as SvtInfoBaseCardInfo);
    }

    private async _getSvtIndividualityDisplay(svtId: number, svt?: MstSvt): Promise<Array<string>> {
        if (!svt) {
            svt = (await MstLoader.instance.loadModel("MstSvt") as MstSvtContainer).get(svtId);
        }
        let individuality = (await MstLoader.instance.loadEmbeddedCode()).individuality;
        let individualityIds = Array.from(Object.keys(individuality));

        let display = [];
        svt.individuality.forEach((id) => {
            if (individualityIds.indexOf(id.toString())) {
                display.push(individuality[id]);
            }
        });

        return Promise.resolve(display);
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* SERVANT INFO: SKILL
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    private async _getSvtInfoSkill(svtId: number): Promise<SvtInfoSkill> {
        let infoSkill = {} as SvtInfoSkill;

        infoSkill.skills = await this._getSvtSkillsDisplay(svtId);
        infoSkill.passiveSkills = await this._getSvtPassiveSkillsDisplay(svtId);
        infoSkill.treasures = await this._getSvtTreasuresDisplay(svtId);

        return Promise.resolve(infoSkill);
    }

    private async _getSvtSkillsDisplay(svtId: number): Promise<Array<SvtSkill>> {
        let displays = [] as Array<SvtSkill>;

        let skillCon = await MstLoader.instance.loadModel("MstSkill") as MstSkillContainer;
        let svtSkillCon = await MstLoader.instance.loadModel("MstSvtSkill") as MstSvtSkillContainer;
        let skillLvCon = await MstLoader.instance.loadModel("MstSkillLv") as MstSkillLvContainer;
        let embeddedSkillDetails = (await MstLoader.instance.loadEmbeddedCode()).transSkillDetail;

        let svtSkills = Array.from(svtSkillCon.getGroup(svtId).values());
        svtSkills.forEach((svtSkill) => {
            let skill = skillCon.get(svtSkill.skillId);
            let embeddedDetail = embeddedSkillDetails[svtSkill.skillId];

            let display = {} as SvtSkill;
            display.skillId = svtSkill.skillId;
            display.name = skill.name;
            display.chargeTurn = (skillLvCon.getGroup(svtSkill.skillId) as Map<number, MstSkillLv>).values().next().value.chargeTurn;
            display.iconId = skill.iconId;

            if (svtSkill.condLimitCount == -1) {
                display.condition = "活动";
            } else if (0 == svtSkill.condLimitCount && svtSkill.condQuestId && 0 == svtSkill.condLv) {
                display.condition = "初期";
            } else if (0 != svtSkill.condLimitCount) {
                display.condition = `灵基再临第${svtSkill.condLimitCount}阶段`;
            } else if (0 != svtSkill.condLv) {
                display.condition = `Lv.${svtSkill.condLv}解放`;
            } else if (0 != svtSkill.condQuestId) {
                display.condition = "任务获得";
            }

            display.skillEffects = [];
            let effects = embeddedDetail.detail.split("&");
            effects.forEach((effect, index) => {
                let effectDisplay = {} as SvtSkillEffect;
                effectDisplay.description = effect.trim();
                effectDisplay.effects = Array.from(MstUtil.objValues(embeddedDetail[`effect${index + 1}`] as Map<number, string>));
                display.skillEffects.push(effectDisplay);
            });

            displays.push(display);
        });

        return Promise.resolve(displays);
    }

    public async _getSvtPassiveSkillsDisplay(svtId: number): Promise<Array<SvtPassiveSkill>> {
        let displays = [] as Array<SvtPassiveSkill>;

        let mstSvt = (await MstLoader.instance.loadModel("MstSvt") as MstSvtContainer).get(svtId);
        let skillCon = await MstLoader.instance.loadModel("MstSkill") as MstSkillContainer;
        let embeddedSkillDetails = (await MstLoader.instance.loadEmbeddedCode()).transSkillDetail;

        let passiveSkillIds = mstSvt.classPassive;
        if (passiveSkillIds.length == 0) {
            return Promise.resolve(displays);
        }

        passiveSkillIds.forEach((skillId) => {
            let skill = skillCon.get(skillId);
            let embeddedDetail = embeddedSkillDetails[skillId];
            let display = {} as SvtPassiveSkill;

            display.skillId = skillId;
            display.name = skill.name;
            display.effects = [] as Array<string>;

            let effects = embeddedDetail.detail.split(/[&＋]+/);
            effects.forEach((effect, index) => {
                display.effects.push(`${effect.trim()}：${embeddedDetail[`effect${index + 1}`][0]}`);
            });

            displays.push(display);
        });

        return Promise.resolve(displays);
    }

    public async _getSvtTreasuresDisplay(svtId: number): Promise<Array<SvtTreasure>> {
        let displays = [] as Array<SvtTreasure>;

        let treasureDeviceCon = await MstLoader.instance.loadModel("MstTreasureDevice") as MstTreasureDeviceContainer;
        let svtTreasureDeviceCon = await MstLoader.instance.loadModel("MstSvtTreasureDevice") as MstSvtTreasureDeviceContainer;
        let embeddedTreasureDetail = (await MstLoader.instance.loadEmbeddedCode()).transTreasureDetail;

        let treasures = Array.from(svtTreasureDeviceCon.getGroup(svtId).values()).filter((svtTreasure) => {
            return svtTreasure.treasureDeviceId != 100; // 不知道什么情况下会是100，不过需要过滤掉
        });
        treasures.forEach((svtTreasure) => {
            let treasure = treasureDeviceCon.get(svtTreasure.treasureDeviceId);
            let detail = embeddedTreasureDetail[svtTreasure.treasureDeviceId];
            let display = {} as SvtTreasure;

            display.treasureId = svtTreasure.treasureDeviceId;
            display.name = treasure.name;
            display.rank = treasure.rank;
            display.type = treasure.typeText;
            display.cardId = svtTreasure.cardId;
            display.hits = svtTreasure.damage.length > 1 ? `${svtTreasure.damage.length}Hits` : "1Hit";
            display.effects = [] as Array<SvtTreasureEffect>;

            if (svtTreasure.num == 98) {
                display.condition = "NPC限定";
            } else if (0 == svtTreasure.condQuestId && 0 == svtTreasure.condLv && 0 == svtTreasure.condFriendshipRank) {
                display.condition = "初期";
            } else if (0 != svtTreasure.condQuestId) {
                display.condition = "任务获得";
            } else if (0 != svtTreasure.condLv) {
                display.condition = `Lv.${svtTreasure.condLv}解放`;
            } else if (0 != svtTreasure.condFriendshipRank) {
                display.condition = `絆等級${svtTreasure.condFriendshipRank}解放`;
            } else {
                display.condition = "未開放";
            }

            let effects = detail.detail.split(/[&＋]+/);
            effects.forEach((effect, index) => {
                let effectDisplay = {} as SvtTreasureEffect;
                effectDisplay.description = effect.trim();
                effectDisplay.effects = Array.from(MstUtil.objValues(detail[`effect${index + 1}`] as Map<number, string>));
                display.effects.push(effectDisplay);
            });

            displays.push(display);
        });

        return Promise.resolve(displays);
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* SERVANT INFO: STORY
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    private async _getSvtInfoStory(svtId: number): Promise<SvtInfoStory> {
        let infoStory = {} as SvtInfoStory;
        let mstSvt = (await MstLoader.instance.loadModel("MstSvt") as MstSvtContainer).get(svtId);
        let maxSvtLimit = await MstLoader.instance.loadSvtMaxLimitInfo(svtId);
        let svtComments = (await MstLoader.instance.loadModel("MstSvtComment") as MstSvtCommentContainer).getGroup(svtId);

        infoStory.powerRank = await this._getRankDisplay(maxSvtLimit.power);
        infoStory.defenseRank = await this._getRankDisplay(maxSvtLimit.defense);
        infoStory.agilityRank = await this._getRankDisplay(maxSvtLimit.agility);
        infoStory.magicRank = await this._getRankDisplay(maxSvtLimit.magic);
        infoStory.luckRank = await this._getRankDisplay(maxSvtLimit.luck);
        infoStory.treasureRank = await this._getRankDisplay(maxSvtLimit.treasureDevice);
        infoStory.friendshipRequirements = [];
        if (mstSvt.friendshipId != 1000) { // 需要过滤，理由不明
            infoStory.friendshipRequirements = await this._getFriendshipRequirementDisplay(svtId);
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

    private async _getRankDisplay(value: number): Promise<string> {
        return Promise.resolve(
            (await MstLoader.instance.loadEmbeddedRankFont(Math.floor(value / 10))).trim() +
            (await MstLoader.instance.loadEmbeddedRankSymbol(value % 10)).trim() +
            `(${value})`
        );
    }

    private async _getFriendshipRequirementDisplay(svtId: number): Promise<Array<string>> {
        let displays = [] as Array<string>;

        let mstSvt = (await MstLoader.instance.loadModel("MstSvt") as MstSvtContainer).get(svtId);
        let mstFriendshipCon = await MstLoader.instance.loadModel("MstFriendship") as MstFriendshipContainer;
        let friendships = Array.from((mstFriendshipCon.getGroup(mstSvt.friendshipId) as Map<number, MstFriendship>).values());

        let total = 0;
        friendships.forEach((friendship) => {
            if (friendship.rank == 10) { // 有效的是 0 - 9
                return;
            }
            let current = friendship.friendship;
            total += friendship.friendship;
            displays.push(`${current}(${total})`);
        });

        return Promise.resolve(displays);
    }

    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    //-* SERVANT INFO: MATERIAL
    //-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
    private async _getSvtInfoMaterial(svtId: number): Promise<SvtInfoMaterial> {
        let infoMaterial = {} as SvtInfoMaterial;
        infoMaterial.limit = [] as Array<SvtMaterialLimit>;
        infoMaterial.skill = [] as Array<SvtMaterialSkill>;

        let svtCombineLimits = Array.from((await MstLoader.instance.loadModel("MstCombineLimit") as MstCombineLimitContainer).getGroup(svtId).values());
        let svtCombineSkills = Array.from((await MstLoader.instance.loadModel("MstCombineSkill") as MstCombineSkillContainer).getGroup(svtId).values());

        svtCombineLimits.forEach((limit) => {
            let data = {} as SvtMaterialLimit;
            data.items = [] as Array<SvtMaterial>;
            limit.itemIds.forEach((itemId, index) => {
                data.items.push({
                    itemId: itemId,
                    count: limit.itemNums[index]
                } as SvtMaterial);
            });
            data.qp = limit.qp;
            infoMaterial.limit.push(data);
        });


        svtCombineSkills.forEach((limit) => {
            let data = {} as SvtMaterialSkill;
            data.items = [] as Array<SvtMaterial>;
            limit.itemIds.forEach((itemId, index) => {
                data.items.push({
                    itemId: itemId,
                    count: limit.itemNums[index]
                } as SvtMaterial);
            });
            data.qp = limit.qp;
            infoMaterial.skill.push(data);
        });

        return Promise.resolve(infoMaterial);
    }
}