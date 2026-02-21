class Cloud extends MovableObject {
    x = 20;
    y = 100;
    width = 500;
    height = 250;
    cloudMoveInterval;

    constructor() {
        super().loadImage('img/5_Fondo/fondos/4_nubes/1.png');
        this.x = Math.random() * 500; // Zufällige y-Position zwischen 0 und 150
        this.animate();
    }

    animate() {
        this.cloudMoveInterval = setInterval(() => {
            // Pausieren wenn Settings Menü offen ist
            if (isPaused) return;
            
            this.moveLeft();
        }, 1000 / 60);
        addInterval(this.cloudMoveInterval);
    }

} 