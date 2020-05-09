export function getCurrentTime() {
    return Math.round(Date.now() / 1000)
}

export function setTokenLifeTime() {
    const TOKEN_LIFE_TIME = 8 * 1000;
    return this.getCurrentTime() + TOKEN_LIFE_TIME;
}