import {MstSvt, MstSvtSkill, MstSkillLv, MstFriendship} from "../../model/master/Master";
import {SvtListFilter} from "../scene/servant/main/State";
import Const from "../lib/const/Const";
import {
    SvtInfo,
    SvtInfoBase,
    SvtHpAtkObj,
    SvtInfoSkill,
    SvtSkill,
    SvtSkillEffect,
    SvtPassiveSkill,
    SvtTreasure,
    SvtTreasureEffect,
    SvtInfoStory,
    SvtInfoMaterial
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
    MstSvtCommentContainer
} from "../../model/impl/MstContainer";

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

        infoBase.collectionNo = mstSvt.collectionNo;
        infoBase.name = (await MstLoader.instance.loadEmbeddedSvtName(svtId)).name;
        infoBase.className = this._getSvtClassName(mstSvt.classId);
        infoBase.classification = await MstLoader.instance.loadEmbeddedAttribute(mstSvt.attri);
        infoBase.policy = await this._getSvtPolicyDisplay(svtId);
        infoBase.attackRate = await this._getSvtClassAttackRateDisplay(mstSvt.classId);
        infoBase.rarity = await this._getSvtRarityDisplay(svtId);
        infoBase.maxLevel = mstSvt.rewardLv;
        let hpAtkMax = this._getSvtAtkHpDisplay(await this._getSvtMaxHpAtk(svtId));
        infoBase.hpMax = hpAtkMax["hp"] as string;
        infoBase.atkMax = hpAtkMax["atk"] as string;
        infoBase.hp90 = undefined;
        infoBase.atk90 = undefined;
        if (mstSvt.limitMax != 90) {
            let hpAtk90 = this._getSvtAtkHpDisplay(await this._getSvtHpAtkViaLv(svtId, 90));
            infoBase.hp90 = hpAtk90["hp"] as string;
            infoBase.atk90 = hpAtk90["atk"] as string;
        }
        let hpAtk100 = this._getSvtAtkHpDisplay(await this._getSvtHpAtkViaLv(svtId, 100));
        infoBase.hp100 = hpAtk100["hp"] as string;
        infoBase.atk100 = hpAtk100["atk"] as string;
        infoBase.gender = await MstLoader.instance.loadEmbeddedGender(mstSvt.genderType);
        infoBase.cardArt = await this._getSvtCmdCardDisplay(svtId, Const.CMD_CARD_ID_ART);
        infoBase.cartBuster = await this._getSvtCmdCardDisplay(svtId, Const.CMD_CARD_ID_BUSTER);
        infoBase.cardQuick = await this._getSvtCmdCardDisplay(svtId, Const.CMD_CARD_ID_QUICK);
        infoBase.cardExtra = await this._getSvtCmdCardDisplay(svtId, Const.CMD_CARD_ID_EXTRA);
        infoBase.individuality = await this._getSvtIndividualityDisplay(svtId);
        infoBase.deathRate = `${mstSvt.deathRate / 10}%`;
        infoBase.criticalWeight = (await MstLoader.instance.loadSvtMaxLimitInfo(svtId)).criticalWeight;
        let treasureLv = await MstLoader.instance.loadSvtDefaultTreasureDeviceWithLv(svtId, 5);
        infoBase.npArt = `${treasureLv.tdPointA / 100}%`;
        infoBase.npBuster = `${treasureLv.tdPointB / 100}%`;
        infoBase.npQuick = `${treasureLv.tdPointQ / 100}%`;
        infoBase.npExtra = `${treasureLv.tdPointEx / 100}%`;
        infoBase.npTreasure = `${treasureLv.tdPoint / 100}%`;
        infoBase.npDefence = `${treasureLv.tdPointDef / 100}%`;

        return Promise.resolve(infoBase);
    }

    private _getSvtClassName(classId: number): string {
        let names = {
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

        return names[classId];
    }

    private async _getSvtClassAttackRateDisplay(classId: number): Promise<string> {
        let container = await MstLoader.instance.loadModel("MstClass") as MstClassContainer;
        let classInfo = container.get(classId);

        return Promise.resolve(`${classInfo.attackRate / 10}%`);
    }

    private async _getSvtRarityDisplay(svtId: number): Promise<string> {
        let mstSvtLimit = await MstLoader.instance.loadSvtMaxLimitInfo(svtId);

        let display = "";
        for (let loop = 0; loop < mstSvtLimit.rarity; loop++) {
            display += "★";
        }

        return Promise.resolve(display);
    }

    private async _getSvtPolicyDisplay(svtId: number): Promise<string> {
        let mstSvtLimit = await MstLoader.instance.loadSvtMaxLimitInfo(svtId);
        let policyName = await MstLoader.instance.loadEmbeddedPolicy(mstSvtLimit.policy);
        let personalityName = await MstLoader.instance.loadEmbeddedPersonality(mstSvtLimit.personality);

        return Promise.resolve(`${policyName}・${personalityName}`);
    }

    private async _getSvtMaxHpAtk(svtId: number): Promise<SvtHpAtkObj> {
        let mstSvtLimit = await MstLoader.instance.loadSvtMaxLimitInfo(svtId);

        return Promise.resolve({
            hp: mstSvtLimit.hpMax,
            atk: mstSvtLimit.atkMax,
        });
    }

    private async _getSvtHpAtkViaLv(svtId: number, level: number): Promise<SvtHpAtkObj> {
        let mstSvt = (await MstLoader.instance.loadModel("MstSvt") as MstSvtContainer).get(svtId);
        let mstSvtLimit = await MstLoader.instance.loadSvtMaxLimitInfo(svtId);
        let expContainer = await MstLoader.instance.loadModel("MstSvtExp") as MstSvtExpContainer;
        let mstSvtExp = expContainer.get(mstSvt.expType, level);

        let hpBase = mstSvtLimit.hpBase;
        let hpMax = mstSvtLimit.hpMax;
        let atkBase = mstSvtLimit.atkBase;
        let atkMax = mstSvtLimit.atkMax;

        let hpVal = Math.floor(hpBase + (hpMax - hpBase) * mstSvtExp.curve / 1000);
        let atkVal = Math.floor(atkBase + (atkMax - atkBase) * mstSvtExp.curve / 1000);

        return Promise.resolve({
            hp: hpVal,
            atk: atkVal,
        });
    }

    private _getSvtAtkHpDisplay(origin: SvtHpAtkObj): SvtHpAtkObj {
        return {
            hp: `${origin.hp} (${parseInt(origin.hp as string) + 990})`,
            atk: `${origin.atk} (${parseInt(origin.atk as string) + 990})`,
        }
    }

    private async _getSvtCmdCardDisplay(svtId: number, cardId: number): Promise<string> {
        let mstSvt = (await MstLoader.instance.loadModel("MstSvt") as MstSvtContainer).get(svtId);
        let mstSvtCard = (await MstLoader.instance.loadModel("MstSvtCard") as MstSvtCardContainer).get(svtId, cardId);

        let cardCount = 0;
        mstSvt.cardIds.forEach((element) => {
            if (element as number === cardId) {
                cardCount++;
            }
        });
        let hitCount = mstSvtCard.normalDamage.length;

        let display = `${cardCount}张 各${hitCount}Hit`;
        if (hitCount > 0) {
            display += "s";
        }

        return Promise.resolve(display);
    }

    private async _getSvtIndividualityDisplay(svtId: number): Promise<string> {
        let mstSvt = (await MstLoader.instance.loadModel("MstSvt") as MstSvtContainer).get(svtId);
        let individuality = (await MstLoader.instance.loadEmbeddedCode()).individuality;
        let individualityIds = Array.from(individuality.keys());

        let display = "";
        mstSvt.individuality.forEach((id) => {
            if (individualityIds.indexOf(id)) {
                display += `, ${individuality.get(id)}`;
            }
        });
        display.slice(2); // remove init ", ", length 2

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
            let embeddedDetail = embeddedSkillDetails.get(svtSkill.skillId);

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
                effectDisplay.effects = Array.from((embeddedDetail[`effect${index + 1}`] as Map<number, string>).values());
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
            let embeddedDetail = embeddedSkillDetails.get(skillId);
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
            let detail = embeddedTreasureDetail.get(svtTreasure.treasureDeviceId);
            let display = {} as SvtTreasure;

            display.treasureId = svtTreasure.treasureDeviceId;
            display.name = treasure.name;
            display.rank = treasure.rank;
            display.type = treasure.typeText;
            display.cardId = svtTreasure.cardId;
            display.hits = svtTreasure.damage.length > 1 ? `${svtTreasure.damage.length}Hits` : "1Hit";

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
                effectDisplay.effects = Array.from((detail[`effect${index + 1}`] as Map<number, string>).values());
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

        return Promise.resolve(infoMaterial);
    }
}