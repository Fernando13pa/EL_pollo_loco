class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 55;
    speed = 5;
    isCharacterNear = false;
    isRunning = false;
    isAttacking = false;
    isHurt = false;
    isDead = false;
    deadFrameIndex = 0;
    elapsedTime = 0;
    energy = 100;

    IMAGES_ALERT = [
        'img/4_Enemigos_jefes/2_alerta/G5.png',
        'img/4_Enemigos_jefes/2_alerta/G6.png',
        'img/4_Enemigos_jefes/2_alerta/G7.png',
        'img/4_Enemigos_jefes/2_alerta/G8.png',
        'img/4_Enemigos_jefes/2_alerta/G9.png',
        'img/4_Enemigos_jefes/2_alerta/G10.png',
        'img/4_Enemigos_jefes/2_alerta/G11.png',
        'img/4_Enemigos_jefes/2_alerta/G12.png'
    ];

    IMAGES_WALKING = [
        'img/4_Enemigos_jefes/1_caminar/G1.png',
        'img/4_Enemigos_jefes/1_caminar/G2.png',
        'img/4_Enemigos_jefes/1_caminar/G3.png',
        'img/4_Enemigos_jefes/1_caminar/G4.png'
    ];

    IMAGES_ATTACK = [
        'img/4_Enemigos_jefes/3_atacar/G13.png',
        'img/4_Enemigos_jefes/3_atacar/G14.png',
        'img/4_Enemigos_jefes/3_atacar/G15.png',
        'img/4_Enemigos_jefes/3_atacar/G16.png',
        'img/4_Enemigos_jefes/3_atacar/G17.png',
        'img/4_Enemigos_jefes/3_atacar/G18.png',
        'img/4_Enemigos_jefes/3_atacar/G19.png',
        'img/4_Enemigos_jefes/3_atacar/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_Enemigos_jefes/4_herida/G21.png',
        'img/4_Enemigos_jefes/4_herida/G22.png',
        'img/4_Enemigos_jefes/4_herida/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_Enemigos_jefes/5_muerta/G24.png',
        'img/4_Enemigos_jefes/5_muerta/G25.png',
        'img/4_Enemigos_jefes/5_muerta/G26.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 3800;
    }

    animate() {
        // Animation Loop
        this.animateInterval1 = setInterval(() => {
            // Wenn Endboss tot: Zeige Death-Animation (einmal)
            if (this.isDead) {
                if (this.deadFrameIndex < this.IMAGES_DEAD.length) {
                    // Zeige das aktuelle Dead-Frame
                    this.img = this.imageCache[this.IMAGES_DEAD[this.deadFrameIndex]];
                    this.deadFrameIndex++;
                } 
                // Wenn Animation fertig: Zeige das letzte Frame
                // (deadFrameIndex >= IMAGES_DEAD.length, img bleibt beim letzten Frame)
            }
            // Wenn Character in der Nähe: Verhalten basierend auf Status
            else if (this.isCharacterNear) {
                if (this.isHurt) {
                    this.playAnimation(this.IMAGES_HURT);
                } else if (this.isAttacking) {
                    this.playAnimation(this.IMAGES_ATTACK);
                } else if (this.isRunning) {
                    this.playAnimation(this.IMAGES_WALKING);
                    this.moveLeft();
                } else {
                    this.playAnimation(this.IMAGES_ALERT);
                }
            }
        }, 200);

        // Zyklus: 1 Sekunde stehen (ALERT), dann 2 Sekunden laufen (WALKING)
        this.animateInterval2 = setInterval(() => {
            if (this.isCharacterNear && !this.isHurt && !this.isDead) {
                this.isRunning = true;
                // Nach 2 Sekunden wieder stehen
                setTimeout(() => {
                    this.isRunning = false;
                }, 2000);
            }
        }, 3000);

        // Angriff-Zyklus: Alle 4 Sekunden angreifen für 2 Sekunden
        this.animateInterval3 = setInterval(() => {
            if (this.isCharacterNear && !this.isHurt && !this.isDead) {
                this.isAttacking = true;
                // Nach 2 Sekunden Attack stoppen
                setTimeout(() => {
                    this.isAttacking = false;
                }, 2000);
            }
        }, 4000);
    }

    getHurt() {
        this.isHurt = true;
        this.energy -= 20;
        // Prüfe ob Endboss tot ist
        if (this.energy <= 0) {
            this.die();
        } else {
            // Nach 1 Sekunde zurück zur normalen Animation
            setTimeout(() => {
                this.isHurt = false;
            }, 1000);
        }
    }

    die() {
        this.isDead = true;
        this.isRunning = false;
        this.isAttacking = false;
    }

}
