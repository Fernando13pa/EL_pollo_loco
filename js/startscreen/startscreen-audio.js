/** Flips the global mute state, refreshes the UI, and applies it to the current world. */
function toggleMute() {
    isMuted = !isMuted;
    saveMutePreference();
    const muteButton = document.getElementById('muteButton');
    if (muteButton) {
        muteButton.blur();
    }
    updateMuteButtonUI();
    if (typeof world !== 'undefined' && world) {
        isMuted ? muteAllSounds(muteButton) : unmuteAllSounds(muteButton);
    }
}

/**
 * Silences the active world sounds and dims the mute button.
 * @param {HTMLElement} muteButton - The mute button
 */
function muteAllSounds(muteButton) {
    world.backgroundSound.pause();
    world.backgroundSound.volume = 0;
    world.endbossSound.pause();
    world.endbossSound.volume = 0;
    if (world.character) {
        world.character.runningSound.pause();
        world.character.runningSound.volume = 0;
        world.character.jumpSound.volume = 0;
    }
    muteButton.style.opacity = '0.5';
}

/**
 * Restores the active world sound volumes and resets the mute button appearance.
 * @param {HTMLElement} muteButton - The mute button
 */
function unmuteAllSounds(muteButton) {
    world.backgroundSound.volume = 0.3;
    world.backgroundSound.play().catch(() => {});
    world.endbossSound.volume = 1;
    if (world.character) {
        world.character.runningSound.volume = 0.5;
        world.character.jumpSound.volume = 1;
    }
    muteButton.style.opacity = '1';
}

/** Synchronizes the mute button appearance with the current mute state. */
function updateMuteButtonUI() {
    const muteButton = document.getElementById('muteButton');
    if (muteButton) {
        muteButton.style.opacity = isMuted ? '0.5' : '1';
    }
}

/** Silences all persistent world sounds and rewinds the character sounds. */
function stopAllSounds() {
    world.backgroundSound.pause();
    world.endbossSound.pause();
    if (world.character) {
        world.character.runningSound.pause();
        world.character.runningSound.currentTime = 0;
        world.character.jumpSound.pause();
        world.character.jumpSound.currentTime = 0;
    }
}

/** Silences and rewinds all audio objects owned by the current world. */
function stopWorldSounds() {
    resetAudio(world.backgroundSound);
    resetAudio(world.endbossSound);
    if (world.character) {
        resetAudio(world.character.runningSound);
        resetAudio(world.character.jumpSound);
    }
}

/**
 * Pauses one audio element and rewinds it to the start.
 * @param {HTMLAudioElement} audio - The audio element to reset
 */
function resetAudio(audio) {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
}
