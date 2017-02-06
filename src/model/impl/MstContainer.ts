import Container from "../../lib/container/Container";
import GroupContainer from "../../lib/container/GroupContainer";

export class MstClassContainer<MstClass> extends Container<MstClass> {
    protected _idAttributeName = "id";
}

export class MstSkillContainer<MstSkill> extends Container<MstSkill> {
    protected _idAttributeName = "id";
}

export class MstSvtContainer<MstSvt> extends Container<MstSvt> {
    protected _idAttributeName = "id";
}

export class MstSvtCardContainer<MstSvtCard> extends GroupContainer<MstSvtCard> {
    protected _groupIdAttributeName = "svtId";
    protected _idAttributeName = "cardId";
}

export class MstSvtLimitContainer<MstSvtLimit> extends GroupContainer<MstSvtLimit> {
    protected _groupIdAttributeName = "svtId";
    protected _idAttributeName = "limitCount";
}

export class MstSvtSkillContainer<MstSvtSkill> extends GroupContainer<MstSvtSkill> {
    protected _groupIdAttributeName = "svtId";
    protected _idAttributeName = "num";
}

export class MstSkillLvContainer<MstSkillLv> extends GroupContainer<MstSkillLv> {
    protected _groupIdAttributeName = "skillId";
    protected _idAttributeName = "lv";
}

export class MstSkillDetailContainer<MstSkillDetail> extends Container<MstSkillDetail> {
    protected _idAttributeName = "id";
}

export class MstTreasureDeviceContainer<MstTreasureDevice> extends Container<MstTreasureDevice> {
    protected _idAttributeName = "id";
}

export class MstSvtTreasureDeviceContainer<MstSvtTreasureDevice> extends GroupContainer<MstSvtTreasureDevice> {
    protected _groupIdAttributeName = "svtId";
    protected _idAttributeName = "treasureDeviceId";
}

export class MstTreasureDeviceLvContainer<MstTreasureDeviceLv> extends GroupContainer<MstTreasureDeviceLv> {
    protected _groupIdAttributeName = "treaureDeviceId";
    protected _idAttributeName = "lv";
}

export class MstFriendshipContainer<MstFriendship> extends GroupContainer<MstFriendship> {
    protected _groupIdAttributeName = "id";
    protected _idAttributeName = "rank";
}

export class MstSvtCommentContainer<MstSvtComment> extends GroupContainer<MstSvtComment> {
    protected _groupIdAttributeName = "svtId";
    protected _idAttributeName = "id";
}

export class MstCombineLimitContainer<MstCombineLimit> extends GroupContainer<MstCombineLimit> {
    protected _groupIdAttributeName = "id";
    protected _idAttributeName = "svtLimit";
}

export class MstCombineSkillContainer<MstCombineSkill> extends GroupContainer<MstCombineSkill> {
    protected _groupIdAttributeName = "id";
    protected _idAttributeName = "skillLv";
}

export class MstTreasureDeviceContainer<MstItem> extends Container<MstItem> {
    protected _idAttributeName = "id";
}

export class MstSvtExpContainer<MstSvtExp> extends GroupContainer<MstSvtExp> {
    protected _groupIdAttributeName = "type";
    protected _idAttributeName = "lv";
}