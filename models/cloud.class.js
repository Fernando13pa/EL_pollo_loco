class Cloud extends MovableObject {
    x = 20;
    y = 100;
    width = 500;
    height = 250;
    cloudMoveInterval;

    /**
     * Creates one background cloud at a random X position and starts its movement.
     */
    constructor() {
        super().loadImage('img/5_Fondo/fondos/4_nubes/1.png');
        this.x = Math.random() * 500;
        this.animate();
    }

    /**
     * Starts the loop that moves the cloud steadily to the left.
     */
    animate() {
        this.cloudMoveInterval = setInterval(() => {
            if (isPaused) return;
            this.moveLeft();
        }, 1000 / 45);
        addInterval(this.cloudMoveInterval);
    }
} 
