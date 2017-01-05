export enum LogLevel {
    error,
    warn,
    notice,
    info,
    debug,
    verbose
}

export default class Log {

    private static _instance: Log = undefined;

    public static get instance(): Log {
        if (Log._instance === undefined) {
            Log._instance = new Log();
        }
        return Log._instance;
    }

    private constructor() {
        // nothing
    }

    public error(...params) {
        this.log.apply(this, [LogLevel.error, ...params]);
    }

    public warn(...params) {
        this.log.apply(this, [LogLevel.warn, ...params]);
    }

    public notice(...params) {
        this.log.apply(this, [LogLevel.notice, ...params]);
    }

    public info(...params) {
        this.log.apply(this, [LogLevel.info, ...params]);
    }

    public debug(...params) {
        this.log.apply(this, [LogLevel.debug, ...params]);
    }

    public verbose(...params) {
        this.log.apply(this, [LogLevel.verbose, ...params]);
    }

    private log(...params) {
        console.log.apply(this, params);
    }

}