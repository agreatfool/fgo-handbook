import {MstSvt, MstSvtLimit} from "../../model/master/Master";
import {SvtListFilter} from "../scene/servant/main/State";
import Const from "../lib/const/Const";
import {SvtInfo, SvtInfoBase, SvtHpAtkObj, SvtCommandCardId} from "../scene/servant/detail/State";
import MstLoader from "../lib/model/MstLoader";
import {
    MstSvtContainer, MstClassContainer, MstSvtLimitContainer,
    MstSvtExpContainer, MstSvtCardContainer
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
        infoBase.attribute = await this._getSvtPersonalityDisplay(svtId);
        infoBase.attackRate = await this._getSvtClassAttackRateDisplay(mstSvt.classId);
        infoBase.rarity = await this._getSvtRarityDisplay(svtId);
        infoBase.maxLevel = mstSvt.rewardLv;
        let hpAtkMax = this._getSvtAtkHpDisplay(await this._getSvtMaxHpAtk(svtId));
        infoBase.hpMax = hpAtkMax["hp"];
        infoBase.atkMax = hpAtkMax["atk"];
        infoBase.hp90 = undefined;
        infoBase.atk90 = undefined;
        if (mstSvt.limitMax != 90) {
            let hpAtk90 = this._getSvtAtkHpDisplay(await this._getSvtHpAtkViaLv(svtId, 90));
            infoBase.hp90 = hpAtk90["hp"];
            infoBase.atk90 = hpAtk90["atk"];
        }
        let hpAtk100 = this._getSvtAtkHpDisplay(await this._getSvtHpAtkViaLv(svtId, 100));
        infoBase.hp100 = hpAtk100["hp"];
        infoBase.atk100 = hpAtk100["atk"];
        infoBase.gender = await MstLoader.instance.loadEmbeddedGender(mstSvt.genderType);
        infoBase.cardArt = await this._getSvtCmdCardDisplay(svtId, SvtCommandCardId.Art);
        infoBase.cartBuster = await this._getSvtCmdCardDisplay(svtId, SvtCommandCardId.Buster);
        infoBase.cardQuick = await this._getSvtCmdCardDisplay(svtId, SvtCommandCardId.Quick);
        infoBase.cardExtra = await this._getSvtCmdCardDisplay(svtId, SvtCommandCardId.Extra);

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

    private async _getSvtMaxLimitInfo(svtId: number): Promise<MstSvtLimit> {
        let container = await MstLoader.instance.loadModel("MstSvtLimit") as MstSvtLimitContainer;
        let mstSvtLimit = container.get(svtId, 4); // 满破

        return Promise.resolve(mstSvtLimit);
    }

    private async _getSvtRarityDisplay(svtId: number): Promise<string> {
        let mstSvtLimit = await this._getSvtMaxLimitInfo(svtId);

        let display = "";
        for (let loop = 0; loop < mstSvtLimit.rarity; loop++) {
            display += "★";
        }

        return Promise.resolve(display);
    }

    private async _getSvtPersonalityDisplay(svtId: number): Promise<string> {
        let mstSvtLimit = await this._getSvtMaxLimitInfo(svtId);
        let policyName = await MstLoader.instance.loadEmbeddedPolicy(mstSvtLimit.policy);
        let personalityName = await MstLoader.instance.loadEmbeddedPersonality(mstSvtLimit.personality);

        return Promise.resolve(`${policyName}・${personalityName}`);
    }

    private async _getSvtMaxHpAtk(svtId: number): Promise<SvtHpAtkObj> {
        let mstSvtLimit = await this._getSvtMaxLimitInfo(svtId);

        return Promise.resolve({
            hp: mstSvtLimit.hpMax,
            atk: mstSvtLimit.atkMax,
        });
    }

    private async _getSvtHpAtkViaLv(svtId: number, level: number): Promise<SvtHpAtkObj> {
        let mstSvt = (await MstLoader.instance.loadModel("MstSvt") as MstSvtContainer).get(svtId);
        let mstSvtLimit = await this._getSvtMaxLimitInfo(svtId);
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

}