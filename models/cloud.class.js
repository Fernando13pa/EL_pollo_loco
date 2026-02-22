class Cloud extends MovableObject {
    x = 20;
    y = 100;
    width = 500;
    height = 250;
    cloudMoveInterval;

    /**
     * Constructor - loads cloud image and starts animation
     */
    constructor() {
        super().loadImage('img/5_Fondo/fondos/4_nubes/1.png');
        this.x = Math.random() * 500;
        this.animate();
    }

    /**
     * Starts movement of cloud to the left
     */
    animate() {
        this.cloudMoveInterval = setInterval(() => {
            if (isPaused) return;
            this.moveLeft();
        }, 1000 / 60);
        addInterval(this.cloudMoveInterval);
    }
} 