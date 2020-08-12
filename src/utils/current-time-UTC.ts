export function getCurrentTime() {
    return Date.now()
}

export function setTokenLifeTime() {
    const TOKEN_LIFE_TIME = 24 * 3600 * 1000;
    return this.getCurrentTime() + TOKEN_LIFE_TIME;
}