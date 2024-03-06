// some util functions

export function clamp (value, min, max) {
    if (value > max) return max
    if (value < min) return min
    return value
}

export function probability (p) {
    if (p <= 0) return false
    if (p >= 1) return true
    return Math.random() <= p
}

export function formatTime (t) {
    let s = Math.floor(t / 1000)
    let m = Math.floor(s / 60)
    let ss = String(s % 60).padStart(2, "0")
    return `${m}:${ss}`
}

export function randomInt (min, max) {
    let diff = max - min
    return ((Math.random() * diff) | 0) + min
}
