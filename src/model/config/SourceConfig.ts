interface SourceConfig {
    protocol: string;               // https
    originHost: string;             // kazemai.github.io
    baseUri: string;                // fgo-vz/common
    masterJsonUri: string;          // js/master.js
    imageSvtFaceUri: string;        // 从者icon images/icon/faces/#SVTID.png
    imageSvtThumbnailUri: string;   // 从者灵基三次每次的半身像，透明背景 images/Servant/#SVTID_status_servant_#NO.png
    imageSvtSkillUri: string;       // 技能icon images/SkillIcon/SkillIcon_#SKILLID.png
    imageItemIconUri: string;       // 道具icon images/icon/items/#ITEMID.png
    imageSvtCmdUri: string;         // 从者指令卡icon卡面 images/Servant/#SVTID_card_servant_#NO.png NO为1-3
    imageSvtCardUri: string;        // 从者立绘卡面 images/CharaGraph/#SVTID#NO.png NO为a-c
}

export default SourceConfig;