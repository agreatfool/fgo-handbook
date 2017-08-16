import * as Stream from "stream";

declare namespace phantomjs {

    function exec(script: string): Stream;

}