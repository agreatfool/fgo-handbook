import * as asyncFile from "async-file";
import * as libPath from "path";
import * as LZString from "lz-string";

import Crawler from "./Crawler";

async function main() {
    let crawler = new Crawler();

    let masterJson: any = await crawler.run();
}

import EmbeddedCodeConvertor from "./EmbeddedCodeConvertor";
let convertor = new EmbeddedCodeConvertor();
convertor.run();

import Utility from "../lib/utility/Utility";
console.log(Utility.toUnicode("筋力"));
console.log(Utility.fromUnicode("\u3000"));

import Const from "../lib/const/Const";
import Config from "../lib/config/Config";
import SourceConfig from "../model/config/SourceConfig";
import EmbeddedCodeConverted from "../model/master/EmbeddedCodeConverted";
async function testConfig() {
    let conf = await Config.instance.loadWholeConfig(Const.CONF_SOURCE) as SourceConfig;
    let property = await Config.instance.loadConfig(Const.CONF_SOURCE, "baseUri") as String;
    let code = await Config.instance.loadDbConfigWithVersion(Const.CONF_DB_EMBEDDED_CODE) as EmbeddedCodeConverted;

    // console.log(conf);
    // console.log(property);
    // console.log(code);
}
testConfig();

import ModelLoader from "../lib/model/MstLoader";
async function testModel() {
    let result = await ModelLoader.instance.loadModel('MstClass');
    return Promise.resolve(result);
}
testModel();

import MasterDumper from "./MasterDumper";
new MasterDumper().run();

import ResourceDownloader from "./ResourceDownloader";
//new ResourceDownloader().run();

import ResourceListBuilder from "./ResourceListBuilder";
new ResourceListBuilder().run().then((list) => {
    console.log(list);
});

//main();

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

