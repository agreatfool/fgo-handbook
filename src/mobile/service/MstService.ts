import {MstSvt, MstSvtLimit, MstSvtSkill, MstSkillLv} from "../../model/master/Master";
import {SvtListFilter} from "../scene/servant/main/State";
import Const from "../lib/const/Const";
import {
    SvtInfo, SvtInfoBase, SvtHpAtkObj, SvtCommandCardId, SvtInfoSkill,
    SvtSkill, SvtSkillEffect, SvtPassiveSkill, SvtTreasure
} from "../scene/servant/detail/State";
import MstLoader from "../lib/model/MstLoader";
import {
    MstSvtContainer, MstClassContainer, MstSvtLimitContainer,
    MstSvtExpContainer, MstSvtCardContainer, MstSkillLvContainer, MstSvtSkillContainer, MstSkillDetailContainer,
    MstSkillContainer
} from "../../model/impl/MstContainer";

export class Service {

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

    public async buildSvtInfo(svtId: number): Promise<SvtInfo> {
        let info = {
            svtId: svtId,
            infoBase: undefined,
            infoSkill: undefined,
            infoStory: undefined,
            infoMaterial: undefined,
        } as SvtInfo;

        // Basic
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
        infoBase.cardArt = await this._getSvtCmdCardDisplay(svtId, SvtCommandCardId.Art);
        infoBase.cartBuster = await this._getSvtCmdCardDisplay(svtId, SvtCommandCardId.Buster);
        infoBase.cardQuick = await this._getSvtCmdCardDisplay(svtId, SvtCommandCardId.Quick);
        infoBase.cardExtra = await this._getSvtCmdCardDisplay(svtId, SvtCommandCardId.Extra);
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

        // Skill
        let infoSkill = {} as SvtInfoSkill;
        infoSkill.skills = await this._getSvtSkillsDisplay(svtId);
        infoSkill.passiveSkills = await this._getSvtPassiveSkillsDisplay(svtId);
        infoSkill.treasures = await this._getSvtTreasuresDisplay(svtId);

        // Update
        info.infoBase = infoBase;
        // info = {
        //     svtId: svtId,
        //     infoBase: undefined,
        //     infoSkill: undefined,
        //     infoStory: undefined,
        //     infoMaterial: undefined,
        // } as SvtInfo;

        return Promise.resolve(info);
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
                display.condition = `Lv.${svtSkill.condLv}`;
            } else if (0 != svtSkill.condQuestId) {
                display.condition = "任务";
            }

            display.skillEffects = [];
            let effects = embeddedDetail.detail.split("&");
            effects.forEach((effect, index) => {
                let effectDisplay = {} as SvtSkillEffect;
                effectDisplay.description = effect;
                effectDisplay.effects = embeddedDetail[`effect${index + 1}`];
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

            let delimiter = "";
            if (embeddedDetail.detail.indexOf("&") != -1) {
                delimiter = "&";
            } else if (embeddedDetail.detail.indexOf("＋")) {
                delimiter = "＋";
            }
            let effects = embeddedDetail.detail.split(delimiter);
            effects.forEach((effect, index) => {
                display.effects.push(`${effect}：${embeddedDetail[`effect${index + 1}`][0]}`);
            });

            displays.push(display);
        });

        return Promise.resolve(displays);
    }

    public async _getSvtTreasuresDisplay(svtId: number): Promise<Array<SvtTreasure>> {

    }
}