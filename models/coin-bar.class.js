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

    constructor() {
        super().loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 100;
        this.width = 200;
        this.height = 60;
        this.setPercent(0);
    }

    setPercent(percent) {
        this.percent = percent;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.percent == 100) {
            return 5;
        } else if (this.percent >= 80) {
            return 4;
        } else if (this.percent >= 60) {
            return 3;
        } else if (this.percent >= 40) {
            return 2;
        } else if (this.percent >= 20) {
            return 1;
        } else {
            return 0;
        }
    }

}
