class Chicken extends MovableObject {
    y = 360;
    height = 70;
    width = 70;
    collisionOffsets = { left: 8, right: 8, top: 6, bottom: 4 };
    energy = 1;
    IMAGES_WALKING = ['img/3_Enemigos/Gallinas/1_caminar/1_w.png',
        'img/3_Enemigos/Gallinas/1_caminar/2_w.png',
        'img/3_Enemigos/Gallinas/1_caminar/3_w.png'];
    IMAGES_DEAD = ['img/3_Enemigos/Gallinas/2_aplastada/dead.png'];
    currentImageIndex = 0;
    isSquashed = false;
    deadSince = null;

    /**
     * Creates a chicken enemy with random spawn position and walking speed.
     */
    constructor() {
        super().loadImage('img/3_Enemigos/Gallinas/1_caminar/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 300 + Math.random() * 3200;
        this.speed = 0.15 + Math.random() * 0.5;
    }

    /**
     * Starts the movement loop and the sprite animation loop.
     */
    animate() {
        this.startMovementInterval();
        this.startAnimationInterval();
    }

    /**
     * Starts the loop that moves the chicken to the left until it is squashed.
     */
    startMovementInterval() {
        this.moveInterval = setInterval(() => {
            if (isPaused) return;
            if (!this.isSquashed) this.moveLeft();
        }, 1000 / 50);
        addInterval(this.moveInterval);
    }

    /**
     * Starts the loop that switches between walking frames or the dead sprite.
     */
    startAnimationInterval() {
        this.animateInterval = setInterval(() => {
            if (isPaused) return;
            if (this.isSquashed) {
                this.img = this.imageCache['img/3_Enemigos/Gallinas/2_aplastada/dead.png'];
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 800);
        addInterval(this.animateInterval);
    }

    /**
     * Defeats the chicken immediately when it is hit.
     */
    hit() {
        this.squash();
    }

    /**
     * Marks the chicken as squashed, sets it dead, and swaps to the dead sprite.
     */
    squash() {
        if (this.isSquashed) return;
        this.isSquashed = true;
        this.energy = 0;
        this.deadSince = Date.now();
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }
}
