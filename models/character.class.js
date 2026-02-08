class Character extends MovableObject {
    height = 280;
    y = 80;
    speed = 10;


    IMAGES_WALKING = ['img/2_Pepe_figura/2_camina/W-21.png',
        'img/2_Pepe_figura/2_camina/W-22.png',
        'img/2_Pepe_figura/2_camina/W-23.png',
        'img/2_Pepe_figura/2_camina/W-24.png',
        'img/2_Pepe_figura/2_camina/W-25.png',
        'img/2_Pepe_figura/2_camina/W-26.png'];

    IMAGES_JUMPING = [
        'img/2_Pepe_figura/3_salta/J-31.png',
        'img/2_Pepe_figura/3_salta/J-32.png',
        'img/2_Pepe_figura/3_salta/J-33.png',
        'img/2_Pepe_figura/3_salta/J-34.png',
        'img/2_Pepe_figura/3_salta/J-35.png',
        'img/2_Pepe_figura/3_salta/J-36.png',
        'img/2_Pepe_figura/3_salta/J-37.png',
        'img/2_Pepe_figura/3_salta/J-38.png',
        'img/2_Pepe_figura/3_salta/J-39.png'
    ];
    IMAGES_DEAD = [
        'img/2_Pepe_figura/5_muerto/D-51.png',
        'img/2_Pepe_figura/5_muerto/D-52.png',
        'img/2_Pepe_figura/5_muerto/D-53.png',
        'img/2_Pepe_figura/5_muerto/D-54.png',
        'img/2_Pepe_figura/5_muerto/D-55.png',
        'img/2_Pepe_figura/5_muerto/D-56.png',
        'img/2_Pepe_figura/5_muerto/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_Pepe_figura/4_tropezar/H-41.png',
        'img/2_Pepe_figura/4_tropezar/H-42.png',
        'img/2_Pepe_figura/4_tropezar/H-43.png',
    ];

    world;


    constructor() {
        super().loadImage('img/2_Pepe_figura/2_camina/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.animate();
        this.applyGravity();
    }
    animate() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
            }
            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
            }
            this.world.camera_x = -this.x + 120;
        }, 1000 / 60);


        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            }
            else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }

        }, 50);
    }
}