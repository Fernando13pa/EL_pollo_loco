class ThrowableObject extends MovableObject {

    IMAGES_ROTATION = [
        'img/6_Botella_salsa/botella_girando/1_bottle_rotation.png',
        'img/6_Botella_salsa/botella_girando/2_bottle_rotation.png',
        'img/6_Botella_salsa/botella_girando/3_bottle_rotation.png',
        'img/6_Botella_salsa/botella_girando/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/6_Botella_salsa/botella_girando/botella_salsa/1_bottle_splash.png',
        'img/6_Botella_salsa/botella_girando/botella_salsa/2_bottle_splash.png',
        'img/6_Botella_salsa/botella_girando/botella_salsa/3_bottle_splash.png',
        'img/6_Botella_salsa/botella_girando/botella_salsa/4_bottle_splash.png',
        'img/6_Botella_salsa/botella_girando/botella_salsa/5_bottle_splash.png',
        'img/6_Botella_salsa/botella_girando/botella_salsa/6_bottle_splash.png'
    ];

    hasHitGround = false;
    splashFrameCount = 0;
    shouldBeRemoved = false;

    constructor(x, y) {
        super().loadImage('img/6_Botella_salsa/botella_girando/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
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

        setInterval(() => {
            if (this.hasHitGround && !this.shouldBeRemoved) {
                this.playAnimation(this.IMAGES_SPLASH);
                this.splashFrameCount++;
                if (this.splashFrameCount >= this.IMAGES_SPLASH.length * 2) {
                    this.shouldBeRemoved = true;
                }
            } else if (!this.hasHitGround) {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 1000 / 25);

        setInterval(() => {
            if (this.y >= 350 && !this.hasHitGround) {
                this.hasHitGround = true;
                this.speedY = 0;
            }
        }, 1000 / 25);

    }
}
