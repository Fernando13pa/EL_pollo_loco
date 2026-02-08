class Chicken extends MovableObject {
    y = 355;
    height = 70;
    width = 70;
    IMAGES_WALKING = ['img/3_Enemigos/Gallinas/1_caminar/1_w.png',
        'img/3_Enemigos/Gallinas/1_caminar/2_w.png',
        'img/3_Enemigos/Gallinas/1_caminar/3_w.png'];
    currentImageIndex = 0;

    constructor() {
        super().loadImage('img/3_Enemigos/Gallinas/1_caminar/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = 200 + Math.random() * 500; // Zufällige Startposition zwischen 200 und 700//
        this.speed = 0.15 + Math.random() * 0.5; // Zufällige Geschwindigkeit zwischen 0.15 und 0.4 //
        this.animate();
    }

    animate() {
        setInterval(() => {
        this.moveLeft();
        }, 1000 / 60);
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }


}