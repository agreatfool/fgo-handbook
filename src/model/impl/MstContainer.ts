import Container from "../../lib/container/Container";
import GroupContainer from "../../lib/container/GroupContainer";
import {
    MstClass, MstSkill, MstSvt, MstSvtCard, MstSvtLimit, MstSvtSkill, MstSkillLv,
    MstSkillDetail, MstTreasureDevice, MstSvtTreasureDevice, MstTreasureDeviceLv, MstFriendship, MstSvtComment,
    MstCombineLimit, MstCombineSkill, MstItem, MstSvtExp
} from "../master/Master";

export class MstClassContainer extends Container<MstClass> {
    protected _idAttributeName = "id";
}

export class MstSkillContainer extends Container<MstSkill> {
    protected _idAttributeName = "id";
}

export class MstSvtContainer extends Container<MstSvt> {
    protected _idAttributeName = "id";
}

export class MstSvtCardContainer extends GroupContainer<MstSvtCard> {
    protected _groupIdAttributeName = "svtId";
    protected _idAttributeName = "cardId";
}

export class MstSvtLimitContainer extends GroupContainer<MstSvtLimit> {
    protected _groupIdAttributeName = "svtId";
    protected _idAttributeName = "limitCount";
}

export class MstSvtSkillContainer extends GroupContainer<MstSvtSkill> {
    protected _groupIdAttributeName = "svtId";
    protected _idAttributeName = "num";
}

export class MstSkillLvContainer extends GroupContainer<MstSkillLv> {
    protected _groupIdAttributeName = "skillId";
    protected _idAttributeName = "lv";
}

export class MstSkillDetailContainer extends Container<MstSkillDetail> {
    protected _idAttributeName = "id";
}

export class MstTreasureDeviceContainer extends Container<MstTreasureDevice> {
    protected _idAttributeName = "id";
}

export class MstSvtTreasureDeviceContainer extends GroupContainer<MstSvtTreasureDevice> {
    protected _groupIdAttributeName = "svtId";
    protected _idAttributeName = "treasureDeviceId";
}

export class MstTreasureDeviceLvContainer extends GroupContainer<MstTreasureDeviceLv> {
    protected _groupIdAttributeName = "treaureDeviceId";
    protected _idAttributeName = "lv";
}

export class MstFriendshipContainer extends GroupContainer<MstFriendship> {
    protected _groupIdAttributeName = "id";
    protected _idAttributeName = "rank";
}

export class MstSvtCommentContainer extends GroupContainer<MstSvtComment> {
    protected _groupIdAttributeName = "svtId";
    protected _idAttributeName = "id";
}

export class MstCombineLimitContainer extends GroupContainer<MstCombineLimit> {
    protected _groupIdAttributeName = "id";
    protected _idAttributeName = "svtLimit";
}

export class MstCombineSkillContainer extends GroupContainer<MstCombineSkill> {
    protected _groupIdAttributeName = "id";
    protected _idAttributeName = "skillLv";
}

export class MstItemContainer extends Container<MstItem> {
    protected _idAttributeName = "id";
}

export class MstSvtExpContainer extends GroupContainer<MstSvtExp> {
    protected _groupIdAttributeName = "type";
    protected _idAttributeName = "lv";
}