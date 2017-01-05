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
// console.log(Utility.toUnicode("名稱"));
// console.log(Utility.fromUnicode(" \u5584 \u60e1 ? \u72c2 \u4e2d\u5eb8 ? \u82b1\u5ac1 \u590f"));

import Const from "../lib/const/Const";
import Config from "../lib/config/Config";
import SourceConfig from "../model/config/SourceConfig";
import EmbeddedCodeConverted from "../model/master/EmbeddedCodeConverted";
async function testConfig() {
  let conf = await Config.instance.loadWholeConfig(Const.CONFIG_SOURCE) as SourceConfig;
  let property = await Config.instance.loadConfig(Const.CONFIG_SOURCE, "baseUri") as String;
  let code = await Config.instance.loadWholeConfig(Const.CONFIG_EMBEDDED_CODE) as EmbeddedCodeConverted;

  // console.log(conf);
  // console.log(property);
  // console.log(code);
}
testConfig();



//main();

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

