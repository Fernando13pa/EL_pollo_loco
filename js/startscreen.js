// Start Screen Funktionalität
let isMuted = false;
let isPaused = false;  // Globales Pause-Flag für Settings Menü
let intervalIds = [];
let menuOpen = false;  // Tracke ob Settings Menu offen ist
let pausedIntervals = [];  // Speichere pausierte Game Loop

function addInterval(intervalId) {
    if (intervalId) {
        intervalIds.push(intervalId);
    }
}

function resetIntervals() {
    intervalIds.forEach(clearInterval);
    intervalIds = [];
}

function startGame() {
    console.log('🎮 startGame() aufgerufen');
    const startScreen = document.getElementById('startScreen');
    const canvas = document.getElementById('canvas');
    const muteButton = document.getElementById('muteButton');
    const settingsButton = document.getElementById('settingsButton');
    
    // Start Screen verstecken
    startScreen.classList.add('hidden');
    
    // Canvas Hintergrundbild entfernen
    canvas.style.backgroundImage = 'none';
    
    // Mute und Settings Button anzeigen
    muteButton.classList.remove('hidden');
    settingsButton.classList.remove('hidden');
    
    // Spiel initialisieren
    console.log('   Rufe init() auf...');
    init();
    console.log('   World wurde erstellt und Game Loop gestartet');
    console.log('   world.gameLoopInterval:', world.gameLoopInterval);
}

function openOptions() {
    const startScreen = document.getElementById('startScreen');
    const optionsMenu = document.getElementById('optionsMenu');
    
    startScreen.classList.add('hidden');
    optionsMenu.classList.remove('hidden');
}

function closeOptions() {
    console.log('👈 closeOptions() aufgerufen');
    const canvas = document.getElementById('canvas');
    const startScreen = document.getElementById('startScreen');
    const optionsMenu = document.getElementById('optionsMenu');
    
    // Wenn wir während des Spielens sind, Canvas blur entfernen und Menü verstecken
    if (typeof world !== 'undefined' && world) {
        console.log('   World existiert - wir waren während des Spielens');
        canvas.style.filter = 'none';
        optionsMenu.classList.add('hidden');
        menuOpen = false;  // Menü ist jetzt zu
        console.log('   Settings Menü wurde geschlossen');
        // Starte das Spiel wieder wenn es pausiert war
        resumeGame();
    } else {
        console.log('   World existiert nicht - wir waren im StartScreen');
        // Wenn wir vom StartScreen aus waren, StartScreen anzeigen
        optionsMenu.classList.add('hidden');
        startScreen.classList.remove('hidden');
        menuOpen = false;
    }
}

function showControls() {
    const optionsMenu = document.getElementById('optionsMenu');
    const controlsMenu = document.getElementById('controlsMenu');
    
    optionsMenu.classList.add('hidden');
    controlsMenu.classList.remove('hidden');
    // Spiel bleibt pausiert
}

function closeControls() {
    const optionsMenu = document.getElementById('optionsMenu');
    const controlsMenu = document.getElementById('controlsMenu');
    
    controlsMenu.classList.add('hidden');
    optionsMenu.classList.remove('hidden');
    // Spiel bleibt pausiert
}

function showGameExplanation() {
    const optionsMenu = document.getElementById('optionsMenu');
    const gameExplanationMenu = document.getElementById('gameExplanationMenu');
    
    optionsMenu.classList.add('hidden');
    gameExplanationMenu.classList.remove('hidden');
    // Spiel bleibt pausiert
}

function closeGameExplanation() {
    const optionsMenu = document.getElementById('optionsMenu');
    const gameExplanationMenu = document.getElementById('gameExplanationMenu');
    
    gameExplanationMenu.classList.add('hidden');
    optionsMenu.classList.remove('hidden');
    // Spiel bleibt pausiert
}

function showImpressum() {
    const optionsMenu = document.getElementById('optionsMenu');
    const impressumMenu = document.getElementById('impressumMenu');
    
    optionsMenu.classList.add('hidden');
    impressumMenu.classList.remove('hidden');
    // Spiel bleibt pausiert
}

function closeImpressum() {
    const optionsMenu = document.getElementById('optionsMenu');
    const impressumMenu = document.getElementById('impressumMenu');
    
    impressumMenu.classList.add('hidden');
    optionsMenu.classList.remove('hidden');
    // Spiel bleibt pausiert
}

function openSettings() {
    console.log('👉 openSettings() aufgerufen');
    const canvas = document.getElementById('canvas');
    const optionsMenu = document.getElementById('optionsMenu');
    
    canvas.style.filter = 'blur(3px)';
    optionsMenu.classList.remove('hidden');
    menuOpen = true;  // Menü ist jetzt offen
    console.log('   Settings Menü wurde geöffnet');
    // Pausiere das Spiel
    pauseGame();
}

function pauseGame() {
    console.log('🔴 pauseGame() aufgerufen');
    // Pausiere nur wenn wir spielen
    if (typeof world !== 'undefined' && world) {
        console.log('   World existiert:', !!world);
        console.log('   gameLoopInterval existiert:', !!world.gameLoopInterval);
        // Speichere die Game Loop Interval ID bevor wir sie pausieren
        if (world.gameLoopInterval) {
            console.log('   Stoppe gameLoopInterval');
            clearInterval(world.gameLoopInterval);
            world.gameLoopInterval = null;  // Setze auf null damit resumeGame() weiß, dass es pausiert ist
        }
        // Setze globales isPaused Flag damit alle setIntervals stoppen
        isPaused = true;
        console.log('   Global isPaused Flag gesetzt zu: true');
    }
}

function resumeGame() {
    console.log('🟢 resumeGame() aufgerufen');
    // Starte das Spiel wieder wenn wir spielen und nichts Schlimmes passiert ist
    if (typeof world !== 'undefined' && world && !world.isGameOver) {
        console.log('   World existiert:', !!world);
        console.log('   isGameOver:', world.isGameOver);
        console.log('   gameLoopInterval existiert:', !!world.gameLoopInterval);
        // Setze globales isPaused Flag auf false damit alle setIntervals weiterlaufen
        isPaused = false;
        console.log('   Global isPaused Flag gesetzt zu: false');
        // Falls die Game Loop pausiert ist, starten wir sie erneut
        if (!world.gameLoopInterval) {
            console.log('   Starte Game Loop neu');
            world.run();  // Starte die Game Loop neu
        } else {
            console.log('   Game Loop läuft bereits!');
        }
    } else {
        console.log('   FEHLER: Kann nicht fortsetzen - world oder isGameOver Problem');
    }
}

function toggleMute() {
    isMuted = !isMuted;
    const muteButton = document.getElementById('muteButton');
    
    // World Audio-Elemente muten/unmuten
    if (typeof world !== 'undefined' && world) {
        if (isMuted) {
            // Alle Sounds stoppen und auf Volume 0 setzen
            world.backgroundSound.pause();
            world.backgroundSound.currentTime = 0;
            world.backgroundSound.volume = 0;
            
            world.endbossSound.pause();
            world.endbossSound.currentTime = 0;
            world.endbossSound.volume = 0;
            
            if (world.character) {
                world.character.runningSound.pause();
                world.character.runningSound.currentTime = 0;
                world.character.runningSound.volume = 0;
                
                world.character.jumpSound.pause();
                world.character.jumpSound.currentTime = 0;
                world.character.jumpSound.volume = 0;
            }
            muteButton.style.opacity = '0.5';
        } else {
            // Audio volumes wieder aktivieren
            world.backgroundSound.volume = 0.3;
            world.backgroundSound.play();
            
            world.endbossSound.volume = 1;
            
            if (world.character) {
                world.character.runningSound.volume = 0.5;
                world.character.jumpSound.volume = 1;
            }
            muteButton.style.opacity = '1';
        }
    }
}

function showGameOver() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const muteButton = document.getElementById('muteButton');
    const settingsButton = document.getElementById('settingsButton');
    
    // Game Over Screen anzeigen
    gameOverScreen.classList.remove('hidden');
    
    // Mute und Settings Button verstecken
    muteButton.classList.add('hidden');
    settingsButton.classList.add('hidden');
    
    // Audio stoppen
    if (typeof world !== 'undefined' && world) {
        // Stoppe alle Intervals
        resetIntervals();
        
        // Reset Endboss damit er nicht tot aussieht
        if (world.level && world.level.enemies) {
            world.level.enemies.forEach(enemy => {
                if (enemy instanceof Endboss) {
                    enemy.isDead = false;
                    enemy.deadFrameIndex = 0;
                }
            });
        }
        
        // Stoppe Audio
        world.backgroundSound.pause();
        world.endbossSound.pause();
    }
}

function showGameWon() {
    const gameWonScreen = document.getElementById('gameWonScreen');
    const muteButton = document.getElementById('muteButton');
    const settingsButton = document.getElementById('settingsButton');
    
    // Game Won Screen anzeigen
    gameWonScreen.classList.remove('hidden');
    
    // Mute und Settings Button verstecken
    muteButton.classList.add('hidden');
    settingsButton.classList.add('hidden');
    
    // Audio stoppen und alle Animationen stoppen
    if (typeof world !== 'undefined' && world) {
        // Stoppe alle Intervals
        resetIntervals();
        
        // Stoppe Audio
        world.backgroundSound.pause();
        world.endbossSound.pause();
    }
}

function restartGame() {
    // Game Over Screen und Game Won Screen verstecken
    const gameOverScreen = document.getElementById('gameOverScreen');
    const gameWonScreen = document.getElementById('gameWonScreen');
    gameOverScreen.classList.add('hidden');
    gameWonScreen.classList.add('hidden');
    
    // Alle Intervals clearen und World zerstören
    resetIntervals();
    if (typeof world !== 'undefined' && world) {
        world = null;
    }
    
    // Reset isMuted state
    isMuted = false;
    
    // Starte das Spiel neu
    startGame();
}

