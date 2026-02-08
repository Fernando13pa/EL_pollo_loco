class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lasHit = 0;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 150;
        }
    }

    isColliding(movableObject) {
        return this.x + this.width > movableObject.x &&
            this.x < movableObject.x + movableObject.width &&
            this.y + this.height > movableObject.y &&
            this.y < movableObject.y + movableObject.height;
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lasHit = new Date().getTime();
        }
    }

    isDead() {
        return this.energy == 0;
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lasHit; // Differenz in ms
        timepassed = timepassed / 1000; // Differenz in Sekunden
        return timepassed < 1;
    }

    playAnimation(images) {
        let i = this.currentImageIndex % images.length;// variable 2 für die Bewegung //
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImageIndex++;
    }

    moveRight() {
        this.x += this.speed;

    }

    moveLeft() {
        this.x -= this.speed;


        // setInterval(() => {
        //     this.x -= this.speed; // Langsame Bewegung nach links
        if (this.x < -this.width) {
            this.x = 800; // Zurücksetzen der Wolke auf die rechte Seite
        }
        // }, 1000 / 60);
    }

    jump() {
        this.speedY = 30;
    }
}