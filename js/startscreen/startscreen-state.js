// Stores shared start screen state, mute settings, and registered intervals.
const MUTE_STORAGE_KEY = 'el_pollo_loco_is_muted';
let isMuted = loadMutePreference();
let isPaused = false;
let intervalIds = [];
let menuOpen = false;
let pausedIntervals = [];
let impressumReturnTarget = 'options';

/**
 * Returns the persisted mute preference from local storage.
 * @returns {boolean}
 */
function loadMutePreference() {
    try {
        return localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
    } catch (_) {
        return false;
    }
}

/**
 * Saves the current mute preference to local storage.
 */
function saveMutePreference() {
    try {
        localStorage.setItem(MUTE_STORAGE_KEY, String(isMuted));
    } catch (_) {
        // Ignore storage access errors (e.g. private mode restrictions)
    }
}

/**
 * Registers an interval so it can be cleared later during restart or shutdown.
 * @param {number} intervalId - The ID of the interval
 */
function addInterval(intervalId) {
    if (intervalId) intervalIds.push(intervalId);
}

/**
 * Clears every registered interval and resets the stored interval list.
 */
function resetIntervals() {
    intervalIds.forEach(clearInterval);
    intervalIds = [];
}
