class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    coinBar = new CoinBar();
    bottleBar = new BottleBar();
    endbossBar = new EndbossBar();
    throwableObjects = [];
    backgroundSound = new Audio('audio/audio_background.mp3');
    chickenSquashSound = new Audio('audio/audio_chicken-squash.mp3');
    endbossSound = new Audio('audio/audio_endboss-sound.mp3');
    endbossSoundStarted = false;

    constructor(canvas, keyboard, level) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;
        this.coinsCollected = 0;
        this.bottlesCollected = 0;
        this.totalCoins = this.level.coins ? this.level.coins.length : 0;
        this.totalBottles = this.level.bottles ? this.level.bottles.length : 0;
        this.backgroundSound.loop = true;
        this.backgroundSound.volume = 0.3;
        this.backgroundSound.play();
        this.endbossSound.loop = true;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowableObjects();
            this.checkEndbossAppearance();
        }, 200);
    }

    checkThrowableObjects() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 50);
            this.throwableObjects.push(bottle);
        }
    }

    checkEndbossAppearance() {
        // Wenn Character nahe genug am Endboss ist (x > 3500), starte den Sound und Animation
        if (this.character.x > 3500 && !this.endbossSoundStarted) {
            this.endbossSound.play();
            this.endbossSoundStarted = true;
        }
        // Wenn Character in der Nähe, Endboss läuft
        if (this.character.x > 3500) {
            let endboss = this.level.enemies.find(e => e instanceof Endboss);
            if (endboss) {
                endboss.isCharacterNear = true;
            }
        }
    }



    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                if ((enemy instanceof Chicken || enemy instanceof SmallChicken) && this.character.isCollidingWithChicken(enemy) && this.character.isAboveGround() ) {
                    this.character.jump();    // Spieler springt nach dem Quetschen hoch 
                    enemy.squash();          // Chicken wird getroffen
                    // Sound neu erstellen für gleichzeitiges Abspielen
                    let squashSound = new Audio('audio/audio_chicken-squash.mp3');
                    squashSound.play();
                    setTimeout(() => {
                        this.level.enemies = this.level.enemies.filter(e => e !== enemy);
                    }, 500);
                } else {
                    this.character.hit();
                    this.character.playAnimation(this.character.IMAGES_HURT);
                    this.statusBar.setPercent(this.character.energy);
                    // Hit-Sound abspielen
                    let hitSound = new Audio('audio/audio_hit.mp3');
                    hitSound.play();
                }

            }
        });

        // Prüfe Kollisionen zwischen Flaschen und Feinden
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                // Nur wenn die Flasche noch nicht auf dem Boden ist (nicht im Splash-Status)
                if (bottle.isColliding(enemy) && !bottle.hasHitGround) {
                    // Glasbruch-Sound abspielen
                    let glassSound = new Audio('audio/audio_glass.mp3');
                    glassSound.play();
                    // Wenn es ein Chicken oder SmallChicken ist, wird es gequetscht
                    if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
                        enemy.squash();
                        // Sound neu erstellen für gleichzeitiges Abspielen
                        let squashSound = new Audio('audio/audio_chicken-squash.mp3');
                        squashSound.play();
                        // Entferne das Chicken nach kurzer Zeit
                        setTimeout(() => {
                            this.level.enemies = this.level.enemies.filter(e => e !== enemy);
                        }, 500);
                    }
                    // Wenn es der Endboss ist, wird er verletzt
                    else if (enemy instanceof Endboss) {
                        enemy.getHurt();
                        let percent = (enemy.energy / 100) * 100;
                        this.endbossBar.setPercent(percent);
                    }
                    // Entferne die Flasche
                    this.throwableObjects = this.throwableObjects.filter(b => b !== bottle);
                }
            });
        });

        if (this.level.coins) {
            this.level.coins.forEach((coin) => {
                if (this.character.isColliding(coin)) {
                    this.coinsCollected++;
                    // remove collected coin
                    this.level.coins = this.level.coins.filter(c => c !== coin);
                    // Coin-Sound abspielen
                    let coinSound = new Audio('audio/audio_collect-coin.mp3');
                    coinSound.play();
                    let percent = 0;
                    if (this.totalCoins > 0) {
                        percent = Math.round((this.coinsCollected / this.totalCoins) * 100);
                    }
                    this.setCoinBarPercent(percent);
                }
            });
        }

        if (this.level.bottles) {
            this.level.bottles.forEach((bottle) => {
                if (this.character.isColliding(bottle)) {
                    this.bottlesCollected++;
                    this.level.bottles = this.level.bottles.filter(b => b !== bottle);
                    // Flaschen-Sound abspielen
                    let bottleSound = new Audio('audio/audio_throw-bottle.mp3');
                    bottleSound.play();
                    let percent = 0;
                    if (this.totalBottles > 0) {
                        percent = Math.round((this.bottlesCollected / this.totalBottles) * 100);
                    }
                    this.setBottleBarPercent(percent);
                }
            });
        }
    }

    setCoinBarPercent(percent) {
        this.coinBar.setPercent(percent);
    }

    setBottleBarPercent(percent) {
        this.bottleBar.setPercent(percent);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0); // Kamera verschieben
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        this.ctx.translate(-this.camera_x, 0); // 
        // -------Space for fixed object-------//
        this.addtoMap(this.coinBar);
        this.addtoMap(this.statusBar);
        this.addtoMap(this.bottleBar);
        this.addtoMap(this.endbossBar);
        this.ctx.translate(this.camera_x, 0); // 

        if (this.level.coins) this.addObjectsToMap(this.level.coins);
        if (this.level.bottles) this.addObjectsToMap(this.level.bottles);
        this.addtoMap(this.character);
        this.addObjectsToMap(this.level.enemies);

        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0); // Kamera zurücksetzen


        //Draw() wird immer wieder aufgerufen
        let self = this; // Sicherstellen, dass 'this' im inneren Funktionskontext korrekt referenziert wird
        requestAnimationFrame(function () {
            self.draw();
        });
    }
    addObjectsToMap(objects) {
        objects.forEach((o) => {
            this.addtoMap(o);
        });
    }

    addtoMap(movableObject) {
        if (movableObject.otherDirection) {
            this.flipImage(movableObject);

        }
        movableObject.draw(this.ctx);
        movableObject.drawFrame(this.ctx);

        if (movableObject.otherDirection) {
            this.flipImageBack(movableObject);
        }
    }

    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = -movableObject.x * 1; // Spiegeln der x-Position
    }

    flipImageBack(movableObject) {
        movableObject.x = -movableObject.x * 1; // Spiegeln der x-Position zurücksetzen
        this.ctx.restore(); // Zustand vor dem Spiegeln wiederherstellen
    }

}