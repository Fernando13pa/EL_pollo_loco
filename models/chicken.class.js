class Chicken extends MovableObject {
    y = 360;
    height = 70;
    width = 70;
    IMAGES_WALKING = ['img/3_Enemigos/Gallinas/1_caminar/1_w.png',
        'img/3_Enemigos/Gallinas/1_caminar/2_w.png',
        'img/3_Enemigos/Gallinas/1_caminar/3_w.png'];
    IMAGES_DEAD = [
        'img/3_Enemigos/Gallinas/2_aplastada/dead.png'
    ];
    currentImageIndex = 0;
    isSquashed = false;

    constructor() {
        super().loadImage('img/3_Enemigos/Gallinas/1_caminar/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 700 + Math.random() * 4000; // Zufällige Startposition ab 700
        this.speed = 0.15 + Math.random() * 0.5; // Zufällige Geschwindigkeit zwischen 0.15 und 0.4 //
    }

    animate() {
        this.moveInterval = setInterval(() => {
            // Pausieren wenn Settings Menü offen ist
            if (isPaused) return;
            
            if (!this.isSquashed) {
                this.moveLeft();
            }
        }, 1000 / 60);
        addInterval(this.moveInterval);
        this.animateInterval = setInterval(() => {
            // Pausieren wenn Settings Menü offen ist
            if (isPaused) return;
            
            if (this.isSquashed) {
                this.img = this.imageCache['img/3_Enemigos/Gallinas/2_aplastada/dead.png'];
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 500);
        addInterval(this.animateInterval);
    }

    squash() {
        this.isSquashed = true;
    }


}