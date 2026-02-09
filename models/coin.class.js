class Coin extends DrawableObject {
    static placedPositions = [];
    static defaultMinGap = 300;
    constructor(x, y) {
        super();
        this.width = 120;
        this.height = 120;
        // default image
        this.loadImage('img/8_Monedas/coin_1.png');

        // If x/y not provided, place randomly across the level
        if (typeof x === 'number') {
            this.x = x;
        } else {
            const minX = 300;
            const maxX = 2200;
            const minGap = Coin.defaultMinGap;
            // try to find a position that doesn't sit too close to existing coins
            let attempts = 0;
            let cx;
            do {
                cx = Math.floor(minX + Math.random() * (maxX - minX));
                attempts++;
                if (attempts > 100) break;
            } while (Coin.placedPositions.some(px => Math.abs(px - cx) < minGap));
            this.x = cx;
            Coin.placedPositions.push(this.x);
        }

        if (typeof y === 'number') {
            this.y = y;
        } else {
            // place coin somewhere above the ground (random height)
            const groundBottom = 80 + 280; // character.y + character.height (approx)
            const minY = Math.max(20, groundBottom - 220);
            const maxY = Math.max(50, groundBottom - 60);
            this.y = Math.floor(minY + Math.random() * (maxY - minY));
        }
    }

    static createMany(count = 5, options = {}) {
        const minX = options.minX ?? 300;
        const maxX = options.maxX ?? 2200;
        const minGap = options.minGap ?? 300;
        const positions = [];
        const coins = [];
        while (positions.length < count) {
            const x = Math.floor(minX + Math.random() * (maxX - minX));
            let ok = true;
            for (let px of positions) {
                if (Math.abs(px - x) < minGap) { ok = false; break; }
            }
            if (ok) positions.push(x);
        }
        positions.sort((a,b)=>a-b);
        for (let x of positions) {
            const groundBottom = 80 + 280;
            const minY = 50;
            const maxY = Math.max(60, groundBottom - 60);
            const y = Math.floor(minY + Math.random() * (maxY - minY));
            coins.push(new Coin(x, y));
        }
        return coins;
    }
}
