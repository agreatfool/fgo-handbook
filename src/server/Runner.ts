import * as asyncFile from "async-file";
import * as libPath from "path";
import * as LZString from "lz-string";

import Crawler from "./Crawler";

new Crawler().run();

// let mstTxt: string;

// async function readInfo(): Promise<string> {
//     //let info: Buffer = await asyncFile.readFile('/Users/Jonathan/Prog/Codes/React/fgo-handbook/src/info.txt');
//     console.log(__filename);
//     let info: Buffer = await asyncFile.readFile(libPath.join(libPath.dirname(__filename), "..", "src", "info.txt"));
//     return Promise.resolve(info.toString());
// }

// async function main(): Promise<string> {
//     let info = await readInfo().catch((error) => {
//         console.log(error);
//     });
//     //console.log(info);
//     mstTxt = LZString.decompress(convert_formated_hex_to_string(info));
//     let parsed: string = JSON.parse(mstTxt);
//     console.log(parsed);
//     return Promise.resolve(parsed);
// }

// process.on('unhandledRejection', (reason, p) => {
//   console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
//   // application specific logging, throwing an error, or other logic here
// });

// main();

