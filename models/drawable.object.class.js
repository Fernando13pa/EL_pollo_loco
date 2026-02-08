class DrawableObject {
    x = 120;
    y = 280;
    img;
    imageCache = {};
    currentImageIndex = 0;
    height = 150;
    width = 100;


    loadImage(path) {
        this.img = new Image();     // Create a new image object// this.img = documentgetElementById('img') <img id="image" src="...">
        this.img.src = path;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}
