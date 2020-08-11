export function getCurrentTime() {
    return Math.round(Date.now())
}

export function setTokenLifeTime() {
    const TOKEN_LIFE_TIME = 24 * 3600;
    return this.getCurrentTime() + TOKEN_LIFE_TIME;
}