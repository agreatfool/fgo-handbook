import * as asyncFile from "async-file";
import * as libPath from "path";
import * as LZString from "lz-string";

import Crawler from "./Crawler";

new Crawler().run();

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

