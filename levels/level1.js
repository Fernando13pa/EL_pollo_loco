const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss()
    ],
    [
        new Cloud(),
    ],
    [
        new BackgroundObject('img/5_Fondo/fondos/air.png', -720),
        new BackgroundObject('img/5_Fondo/fondos/3_tercer_fondo/2.png', -720),
        new BackgroundObject('img/5_Fondo/fondos/2_segundo_fondo/2.png', -720),
        new BackgroundObject('img/5_Fondo/fondos/1_primer_fondo/2.png', -720),

        new BackgroundObject('img/5_Fondo/fondos/air.png', 0),
        new BackgroundObject('img/5_Fondo/fondos/3_tercer_fondo/1.png', 0),
        new BackgroundObject('img/5_Fondo/fondos/2_segundo_fondo/1.png', 0),
        new BackgroundObject('img/5_Fondo/fondos/1_primer_fondo/1.png', 0,),

        new BackgroundObject('img/5_Fondo/fondos/air.png', 720),
        new BackgroundObject('img/5_Fondo/fondos/3_tercer_fondo/2.png', 720),
        new BackgroundObject('img/5_Fondo/fondos/2_segundo_fondo/2.png', 720),
        new BackgroundObject('img/5_Fondo/fondos/1_primer_fondo/2.png', 720),

        new BackgroundObject('img/5_Fondo/fondos/air.png', 720 * 2),
        new BackgroundObject('img/5_Fondo/fondos/3_tercer_fondo/1.png', 720 * 2),
        new BackgroundObject('img/5_Fondo/fondos/2_segundo_fondo/1.png', 720 * 2),
        new BackgroundObject('img/5_Fondo/fondos/1_primer_fondo/1.png', 720 * 2),

        new BackgroundObject('img/5_Fondo/fondos/air.png', 720 * 3),
        new BackgroundObject('img/5_Fondo/fondos/3_tercer_fondo/2.png', 720 * 3),
        new BackgroundObject('img/5_Fondo/fondos/2_segundo_fondo/2.png', 720 * 3),
        new BackgroundObject('img/5_Fondo/fondos/1_primer_fondo/2.png', 720 * 3),

    ],
    [
        new Coin(), new Coin(), new Coin(), new Coin(), new Coin()
    ],
    [
        new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(),
        // add a few ground bottles (different image) placed randomly on the ground
        new Bottle(undefined, undefined, true), new Bottle(undefined, undefined, true), new Bottle(undefined, undefined, true)
    ]
);