class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    throwableObjects = [];

    constructor(canvas, keyboard, level) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;
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
        }, 200);
    }

    checkThrowableObjects() {
     if (this.keyboard.D) {
         let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 50);
         this.throwableObjects.push(bottle);
     }
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBar.setPercent(this.character.energy);
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0); // Kamera verschieben
        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0); // 
        // -------Space for fixed object-------//
        this.addtoMap(this.statusBar);
        this.ctx.translate(this.camera_x, 0); // 

        this.addtoMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
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