export default class TaskThrottler {
    private maxConcurrentSessions: number;
    private throttleInterval: number;
    private activeSessions: number = 0;

    constructor(maxConcurrentSessions: number, throttleInterval: number) {
        this.maxConcurrentSessions = maxConcurrentSessions;
        this.throttleInterval = throttleInterval;
    }

    public aquire() {
        this.activeSessions++;
    }

    async release() {
        this.activeSessions--;
    }

    public async throttle() {
        return new Promise(async (resolve) => {
            while (this.activeSessions >= this.maxConcurrentSessions) {
                await new Promise((intervalResolve) =>
                    setTimeout(intervalResolve, this.throttleInterval)
                );
            }

            resolve(undefined);
        });
    }
}
