class Bottle extends DrawableObject {
    static placedPositions = [];
    static defaultMinGap = 300;
    constructor(x, y, onGround = false) {
        super();
        this.width = 70;
        this.height = 90;
        // choose image depending on whether bottle should be on ground
        if (onGround) {
            this.loadImage('img/6_Botella_salsa/2_salsa_bottle_on_ground.png');
        } else {
            this.loadImage('img/6_Botella_salsa/botella_girando/1_bottle_rotation.png');
        }

        // If x/y provided, use them
        if (typeof x === 'number') {
            this.x = x;
        } else {
            // random position across the whole level (approx)
            const minX = 300;
            const maxX = 2200;
            const minGap = Bottle.defaultMinGap;
            let attempts = 0;
            let bx;
            do {
                bx = Math.floor(minX + Math.random() * (maxX - minX));
                attempts++;
                if (attempts > 200) break;
            } while (Bottle.placedPositions.some(px => Math.abs(px - bx) < minGap));
            this.x = bx;
            Bottle.placedPositions.push(this.x);
        }

        if (typeof y === 'number') {
            this.y = y;
        } else if (onGround) {
            // place on the ground, slightly lower so it appears resting
            const groundBottom = 80 + 280; // character.y + character.height (approx)
            const extraOffset = 70;   // push a bit further down
            this.y = Math.floor(groundBottom - this.height + extraOffset);
        } else {
            // random vertical position above ground
            const groundBottom = 80 + 280; // character.y + character.height (approx)
            const minY = 50;
            const maxY = Math.max(minY, groundBottom - this.height);
            this.y = Math.floor(minY + Math.random() * (maxY - minY));
        }
    }

    static createMany(count = 6, options = {}) {
        const minX = options.minX ?? 300;
        const maxX = options.maxX ?? 2200;
        const minGap = options.minGap ?? 300;
        const positions = [];
        while (positions.length < count) {
            const x = Math.floor(minX + Math.random() * (maxX - minX));
            let ok = true;
            for (let px of positions) {
                if (Math.abs(px - x) < minGap) { ok = false; break; }
            }
            if (ok) positions.push(x);
        }
        positions.sort((a,b)=>a-b);
        const bottles = positions.map(x => {
            // choose random y for each bottle as well
            const groundBottom = 80 + 280;
            const minY = 50;
            const maxY = Math.max(minY, groundBottom - 70);
            const y = Math.floor(minY + Math.random() * (maxY - minY));
            return new Bottle(x, y);
        });
        return bottles;
    }
}
