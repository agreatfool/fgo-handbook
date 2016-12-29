class Log {

    public static log(...params) {
        console.log.apply(this, params);
    }

}

export default Log;