class ThrowableObject extends MovableObject {

    constructor(x, y) {
        super().loadImage('img/6_Botella_salsa/botella_girando/1_bottle_rotation.png');
        // this.loadImages(this.IMAGES_ROTATION);
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 60;
        this.throw();
    }
    throw() {
     
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 1000 / 25);

    }
}
