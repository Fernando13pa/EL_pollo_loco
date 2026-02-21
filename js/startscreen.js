// Start Screen Funktionalität
let isMuted = false;

function startGame() {
    const startScreen = document.getElementById('startScreen');
    const canvas = document.getElementById('canvas');
    const muteButton = document.getElementById('muteButton');
    
    // Start Screen verstecken
    startScreen.classList.add('hidden');
    
    // Canvas Hintergrundbild entfernen
    canvas.style.backgroundImage = 'none';
    
    // Mute Button anzeigen
    muteButton.classList.remove('hidden');
    
    // Spiel initialisieren
    init();
}

function openOptions() {
    const startScreen = document.getElementById('startScreen');
    const optionsMenu = document.getElementById('optionsMenu');
    
    startScreen.classList.add('hidden');
    optionsMenu.classList.remove('hidden');
}

function closeOptions() {
    const startScreen = document.getElementById('startScreen');
    const optionsMenu = document.getElementById('optionsMenu');
    
    optionsMenu.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

function showControls() {
    const optionsMenu = document.getElementById('optionsMenu');
    const controlsMenu = document.getElementById('controlsMenu');
    
    optionsMenu.classList.add('hidden');
    controlsMenu.classList.remove('hidden');
}

function closeControls() {
    const optionsMenu = document.getElementById('optionsMenu');
    const controlsMenu = document.getElementById('controlsMenu');
    
    controlsMenu.classList.add('hidden');
    optionsMenu.classList.remove('hidden');
}

function showGameExplanation() {
    const optionsMenu = document.getElementById('optionsMenu');
    const gameExplanationMenu = document.getElementById('gameExplanationMenu');
    
    optionsMenu.classList.add('hidden');
    gameExplanationMenu.classList.remove('hidden');
}

function closeGameExplanation() {
    const optionsMenu = document.getElementById('optionsMenu');
    const gameExplanationMenu = document.getElementById('gameExplanationMenu');
    
    gameExplanationMenu.classList.add('hidden');
    optionsMenu.classList.remove('hidden');
}

function showImpressum() {
    const optionsMenu = document.getElementById('optionsMenu');
    const impressumMenu = document.getElementById('impressumMenu');
    
    optionsMenu.classList.add('hidden');
    impressumMenu.classList.remove('hidden');
}

function closeImpressum() {
    const optionsMenu = document.getElementById('optionsMenu');
    const impressumMenu = document.getElementById('impressumMenu');
    
    impressumMenu.classList.add('hidden');
    optionsMenu.classList.remove('hidden');
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
    
    // Game Over Screen anzeigen
    gameOverScreen.classList.remove('hidden');
    
    // Mute Button verstecken
    muteButton.classList.add('hidden');
    
    // Audio stoppen
    if (typeof world !== 'undefined' && world) {
        // Stoppe den Main Game Loop
        if (world.gameLoopInterval) clearInterval(world.gameLoopInterval);
        
        // Stoppe Character Animation (beide Intervals)
        if (world.character) {
            if (world.character.animateInterval) clearInterval(world.character.animateInterval);
            if (world.character.animateInterval2) clearInterval(world.character.animateInterval2);
        }
        
        // Stoppe alle Enemy-Animationen
        if (world.level && world.level.enemies) {
            world.level.enemies.forEach(enemy => {
                if (enemy instanceof Endboss) {
                    if (enemy.animateInterval1) clearInterval(enemy.animateInterval1);
                    if (enemy.animateInterval2) clearInterval(enemy.animateInterval2);
                    if (enemy.animateInterval3) clearInterval(enemy.animateInterval3);
                } else {
                    // Für Chicken und SmallChicken
                    if (enemy.moveInterval) clearInterval(enemy.moveInterval);
                    if (enemy.animateInterval) clearInterval(enemy.animateInterval);
                }
            });
        }
        
        world.backgroundSound.pause();
        world.endbossSound.pause();
    }
}

function showGameWon() {
    const gameWonScreen = document.getElementById('gameWonScreen');
    const muteButton = document.getElementById('muteButton');
    
    // Game Won Screen anzeigen
    gameWonScreen.classList.remove('hidden');
    
    // Mute Button verstecken
    muteButton.classList.add('hidden');
    
    // Audio stoppen und alle Animationen stoppen
    if (typeof world !== 'undefined' && world) {
        // Stoppe den Main Game Loop
        if (world.gameLoopInterval) clearInterval(world.gameLoopInterval);
        
        // Stoppe Character Animation (beide Intervals)
        if (world.character) {
            if (world.character.animateInterval) clearInterval(world.character.animateInterval);
            if (world.character.animateInterval2) clearInterval(world.character.animateInterval2);
        }
        
        // Stoppe alle Enemy-Animationen
        if (world.level && world.level.enemies) {
            world.level.enemies.forEach(enemy => {
                if (enemy instanceof Endboss) {
                    if (enemy.animateInterval1) clearInterval(enemy.animateInterval1);
                    if (enemy.animateInterval2) clearInterval(enemy.animateInterval2);
                    if (enemy.animateInterval3) clearInterval(enemy.animateInterval3);
                } else {
                    // Für Chicken und SmallChicken
                    if (enemy.moveInterval) clearInterval(enemy.moveInterval);
                    if (enemy.animateInterval) clearInterval(enemy.animateInterval);
                }
            });
        }
        
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
    
    // Canvas resetten mit Startscreen Hintergrundbild
    const canvas = document.getElementById('canvas');
    canvas.style.backgroundImage = 'url(img/9_juego_modelos/iniciar/startscreen_1.png)';
    
    // Alte World aufräumen
    if (typeof world !== 'undefined' && world) {
        // Stoppe den Main Game Loop
        if (world.gameLoopInterval) clearInterval(world.gameLoopInterval);
        
        // Stoppe Character Animation (BEIDE Intervals!)
        if (world.character) {
            if (world.character.animateInterval) clearInterval(world.character.animateInterval);
            if (world.character.animateInterval2) clearInterval(world.character.animateInterval2);
        }
        
        // Stoppe alle Enemy-Animationen
        if (world.level && world.level.enemies) {
            world.level.enemies.forEach(enemy => {
                // Stoppe alle Intervals für Endboss
                if (enemy instanceof Endboss) {
                    if (enemy.animateInterval1) clearInterval(enemy.animateInterval1);
                    if (enemy.animateInterval2) clearInterval(enemy.animateInterval2);
                    if (enemy.animateInterval3) clearInterval(enemy.animateInterval3);
                    // Reset Dead-Animation
                    enemy.isDead = false;
                    enemy.deadFrameIndex = 0;
                } else {
                    // Für Chicken und SmallChicken - BEIDE Intervals!
                    if (enemy.moveInterval) clearInterval(enemy.moveInterval);
                    if (enemy.animateInterval) clearInterval(enemy.animateInterval);
                }
            });
        }
        
        // Audio stoppen
        if (world.backgroundSound) {
            world.backgroundSound.pause();
            world.backgroundSound.currentTime = 0;
        }
        if (world.endbossSound) {
            world.endbossSound.pause();
            world.endbossSound.currentTime = 0;
        }
        
        // World zerstören
        world = null;
    }
    
    // Reset isMuted state
    isMuted = false;
    const muteButton = document.getElementById('muteButton');
    muteButton.classList.add('hidden');
    muteButton.style.opacity = '1';
    
    // Neues Spiel starten
    init();
    
    // Mute Button anzeigen
    muteButton.classList.remove('hidden');
}

