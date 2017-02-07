interface SourceConfig {
    protocol: string;              // https
    originHost: string;             // kazemai.github.io
    baseUri: string;                // fgo-vz/common
    masterJsonUri: string;          // js/master.js
    imageSvtThumbnailUri: string;   // images/Servant/#SVTID_status_servant_#NO.png
    imageSvtSkillUri: string;       // images/SkillIcon/SkillIcon_#SKILLID.png
    imageItemIconUri: string;       // images/icon/items/#ITEMID.png
    imageSvtCmdUri: string;         // 从者命令卡icon卡面 images/Servant/#SVTID_card_servant_#NO.png NO为1-3
    imageSvtCardUri: string;        // 从者绘图卡面 images/CharaGraph/#SVTID#NO.png NO为a-c
}

export default SourceConfig;