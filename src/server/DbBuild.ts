import * as asyncFile from "async-file";
import * as libPath from "path";
import * as LZString from "lz-string";

let mstTxt: string;

function convert_formated_hex_to_bytes(hex_str) {
  var count = 0,
      hex_arr,
      hex_data = [],
      hex_len,
      i;
  
  if (hex_str.trim() == "") return [];
  
  /// Check for invalid hex characters.
  if (/[^0-9a-fA-F\s]/.test(hex_str)) {
    return false;
  }
  
  hex_arr = hex_str.split(/([0-9a-fA-F][0-9a-fA-F])/g);
  hex_len = hex_arr.length;
  
  for (i = 0; i < hex_len; ++i) {
    if (hex_arr[i].trim() == "") {
      continue;
    }
    hex_data[count++] = parseInt(hex_arr[i], 16);
  }
  return hex_data;
}

function convert_formated_hex_to_string(s) {
  var byte_arr = convert_formated_hex_to_bytes(s);
  if (byte_arr === false) {
    return "";
  }
  var res = "";
  for (var i = 0 ; i<byte_arr.length ; i+=2) {
    res += String.fromCharCode(byte_arr[i] | (byte_arr[i+1]<<8));
  }
  return res;
}

async function readInfo(): Promise<string> {
    //let info: Buffer = await asyncFile.readFile('/Users/Jonathan/Prog/Codes/React/fgo-handbook/src/info.txt');
    console.log(__filename);
    let info: Buffer = await asyncFile.readFile(libPath.join(libPath.dirname(__filename), "..", "src", "info.txt"));
    return Promise.resolve(info.toString());
}

async function main(): Promise<string> {
    let info = await readInfo().catch((error) => {
        console.log(error);
    });
    //console.log(info);
    mstTxt = LZString.decompress(convert_formated_hex_to_string(info));
    let parsed: string = JSON.parse(mstTxt);
    console.log(parsed);
    return Promise.resolve(parsed);
}

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

main();

