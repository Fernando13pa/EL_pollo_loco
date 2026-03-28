/**
 * Displays the player's available bottles with one image for each 20% step.
 */
class BottleBar extends DrawableObject {
    IMAGES = [
        'img/7_Barras/1_barra_de_estados/3_barra_de_botella/azul/0.png',
        'img/7_Barras/1_barra_de_estados/3_barra_de_botella/azul/20.png',
        'img/7_Barras/1_barra_de_estados/3_barra_de_botella/azul/40.png',
        'img/7_Barras/1_barra_de_estados/3_barra_de_botella/azul/60.png',
        'img/7_Barras/1_barra_de_estados/3_barra_de_botella/azul/80.png',
        'img/7_Barras/1_barra_de_estados/3_barra_de_botella/azul/100.png'
    ];
    percent = 100;

    /**
     * Preloads the bottle bar images, positions the bar, and starts it at 0%.
     */
    constructor() {
        super().loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 10;
        this.width = 200;
        this.height = 60;
        this.setPercent(0);
    }

    /**
     * Stores the bottle percentage and swaps to the matching bar image.
     * @param {number} percent - The percentage (0-100)
     */
    setPercent(percent) {
        this.percent = percent;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Returns the image index that matches the current bottle percentage.
     * @returns {number} Index of the image to display
     */
    resolveImageIndex() {
        const bounded = Math.max(0, Math.min(100, this.percent));
        return bounded === 0 ? 0 : Math.ceil(bounded / 20);
    }
}

