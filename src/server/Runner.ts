import * as asyncFile from "async-file";
import * as libPath from "path";
import * as LZString from "lz-string";

import Crawler from "./Crawler";

async function main() {
    let crawler = new Crawler();

    let masterJson: any = await crawler.run();
}

import IndividualityConvertor from "./IndividualityConvertor";
let convertor = new IndividualityConvertor();
convertor.run();

import Utility from "../lib/utility/Utility";
let utility = new Utility();
let encoded = utility.toUnicode("特性");
console.log(encoded);
console.log(utility.fromUnicode(encoded));

//main();

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

