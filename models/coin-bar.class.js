/**
 * Displays the player's collected coin progress with one image for each 20% step.
 */
class CoinBar extends DrawableObject {
    IMAGES = [
        'img/7_Barras/1_barra_de_estados/1_barra_de_monedas/azul/0.png',
        'img/7_Barras/1_barra_de_estados/1_barra_de_monedas/azul/20.png',
        'img/7_Barras/1_barra_de_estados/1_barra_de_monedas/azul/40.png',
        'img/7_Barras/1_barra_de_estados/1_barra_de_monedas/azul/60.png',
        'img/7_Barras/1_barra_de_estados/1_barra_de_monedas/azul/80.png',
        'img/7_Barras/1_barra_de_estados/1_barra_de_monedas/azul/100.png'
    ];
    percent = 100;

    /**
     * Preloads the coin bar images, positions the bar, and starts it at 0%.
     */
    constructor() {
        super().loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 100;
        this.width = 200;
        this.height = 60;
        this.setPercent(0);
    }

    /**
     * Stores the coin percentage and swaps to the matching bar image.
     * @param {number} percent - The percentage (0-100)
     */
    setPercent(percent) {
        this.percent = percent;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Returns the image index that matches the current coin percentage.
     * @returns {number} Index of the image to display
     */
    resolveImageIndex() {
        const bounded = Math.max(0, Math.min(100, this.percent));
        return bounded === 0 ? 0 : Math.ceil(bounded / 20);
    }
}

