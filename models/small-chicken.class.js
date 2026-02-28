class SmallChicken extends MovableObject {
    y = 395;
    height = 35;
    width = 35;
    collisionOffsets = { left: 4, right: 4, top: 3, bottom: 2 };
    energy = 1;
    IMAGES_WALKING = ['img/3_Enemigos/Pollitos/1_caminar/1_w.png',
        'img/3_Enemigos/Pollitos/1_caminar/2_w.png',
        'img/3_Enemigos/Pollitos/1_caminar/3_w.png'];
    IMAGES_DEAD = ['img/3_Enemigos/Pollitos/2_aplastados/dead.png'];
    currentImageIndex = 0;
    isSquashed = false;
    deadSince = null;

    /**
     * Constructor - loads images and sets random position/speed
     */
    constructor() {
        super().loadImage('img/3_Enemigos/Pollitos/1_caminar/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 300 + Math.random() * 3200;
        this.speed = 0.15 + Math.random() * 0.5;
    }

    /**
     * Starts movement and animation intervals
     */
    animate() {
        this.startMovementInterval();
        this.startAnimationInterval();
    }

    /**
     * Starts interval for movement to the left
     */
    startMovementInterval() {
        this.moveInterval = setInterval(() => {
            if (isPaused) return;
            if (!this.isSquashed) this.moveLeft();
        }, 1000 / 60);
        addInterval(this.moveInterval);
    }

    /**
     * Starts interval for animation (walking or death animation)
     */
    startAnimationInterval() {
        this.animateInterval = setInterval(() => {
            if (isPaused) return;
            if (this.isSquashed) {
                this.img = this.imageCache['img/3_Enemigos/Pollitos/2_aplastados/dead.png'];
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 500);
        addInterval(this.animateInterval);
    }

    /**
     * Small chicken dies instantly when hit
     */
    hit() {
        this.squash();
    }

    /**
     * Marks the small chicken as squashed and stops movement
     */
    squash() {
        if (this.isSquashed) return;
        this.isSquashed = true;
        this.energy = 0;
        this.deadSince = Date.now();
        this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }
}   
