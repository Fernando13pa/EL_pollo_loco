class SmallChicken extends MovableObject {
    y = 395;
    height = 35;
    width = 35;
    IMAGES_WALKING = ['img/3_Enemigos/Pollitos/1_caminar/1_w.png',
        'img/3_Enemigos/Pollitos/1_caminar/2_w.png',
        'img/3_Enemigos/Pollitos/1_caminar/3_w.png'];
    IMAGES_DEAD = [
        'img/3_Enemigos/Pollitos/2_aplastados/dead.png'
    ];
    currentImageIndex = 0;
    isSquashed = false;

    constructor() {
        super().loadImage('img/3_Enemigos/Pollitos/1_caminar/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 700 + Math.random() * 2100; // Zufällige Startposition ab 700
        this.speed = 0.15 + Math.random() * 0.5; // Zufällige Geschwindigkeit zwischen 0.15 und 0.4 //
    }

    animate() {
        this.moveInterval = setInterval(() => {
            if (!this.isSquashed) {
                this.moveLeft();
            }
        }, 1000 / 60);
        this.animateInterval = setInterval(() => {
            if (this.isSquashed) {
                this.img = this.imageCache['img/3_Enemigos/Pollitos/2_aplastados/dead.png'];
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 500);
    }

    squash() {
        if (this.isSquashed) return;
        this.isSquashed = true;
        this.speed = 0;
        if (this.imageCache['img/3_Enemigos/Pollitos/2_aplastados/dead.png']) {
            this.img = this.imageCache['img/3_Enemigos/Pollitos/2_aplastados/dead.png'];
        }
    }
}   
