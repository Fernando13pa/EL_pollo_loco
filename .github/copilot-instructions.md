# El Pollo Loco - AI Coding Guidelines

## Project Overview
A 2D platformer game built with vanilla JavaScript and Canvas API. The game features a player character jumping on enemies to "squash" them, collecting coins and bottles, and defeating an endboss. German-language gameplay.

## Architecture & Class Hierarchy

### Inheritance Chain
```
DrawableObject (rendering, image caching)
  ├─ MovableObject (physics, gravity, collisions)
  │   ├─ Character (player with animations)
  │   ├─ Chicken & SmallChicken (squashable enemies)
  │   ├─ Endboss (boss with multi-state AI)
  │   ├─ Bottle & Coin (collectibles)
  │   └─ Cloud & BackgroundObject (scenery)
  └─ World (main game manager - special, not MovableObject)
```

### Critical Physics Details
- **Y-axis is inverted**: `y -= speedY` moves DOWN, `y += speedY` moves UP
- **Gravity**: `speedY -= acceleration` means objects gain downward speed
- **Therefore**: `speedY < 0` = falling/moving down, NOT `speedY > 0`
- **Jump**: Sets `speedY = 30` (positive value), then gravity makes it negative/falling

## Key Code Patterns

### Collision Detection
Two specialized methods in `MovableObject`:
- **`isColliding(movableObject)`**: Basic AABB bounding box, used for general collisions
- **`isCollidingFromTop(enemy)`**: Specialized for jumping on enemies
  - Checks `speedY < 0` (must be falling)
  - Dynamic tolerance: `enemy.height < 50 ? 25px : 15px` (smaller enemies easier to hit)
  - Used in `world.js` for squashing chickens

**Example**: When character collides with chicken from top:
```javascript
if (this.character.isCollidingFromTop(chicken)) {
    chicken.squash();
    // Creates new Audio() for overlapping sounds
}
```

### Audio System Pattern
- **Background/Loop sounds**: One persistent Audio instance with `audio.loop = true`
- **Event sounds**: CREATE NEW Audio() instance per event to allow overlapping
- **Never reuse single Audio instance** for multiple simultaneous plays - they cut each other off

**Example**:
```javascript
// WRONG: Single instance gets reused
this.chickenSquashSound.play(); // Can only play once at a time

// RIGHT: New instance each time
let squashSound = new Audio('audio/squash.mp3');
squashSound.play();
```

### Animation System
- All animated objects use `playAnimation(imageArray)` from DrawableObject
- Sets `this.currentImage` to cycle through array frames
- `animate()` loop in each class calls `playAnimation()` with appropriate image array
- Animation priority matters: Check conditions in order (Dead > Hurt > Attack > Walk > Alert)

**Endboss animation example** (endboss.class.js):
```javascript
if (this.isDead) {
    this.playAnimation(this.IMAGES_DEAD);
} else if (this.isHurt) {
    this.playAnimation(this.IMAGES_HURT);
} else if (this.isAttacking) {
    this.playAnimation(this.IMAGES_ATTACK);
} else if (this.isRunning) {
    this.playAnimation(this.IMAGES_WALKING);
    this.moveLeft();
}
```

### Status Bars Design
Located in `models/*-bar.class.js`. Pattern:
- 6 visual states: 0%, 20%, 40%, 60%, 80%, 100% health
- Draws in fixed screen position (not following character)
- Calculate percentage: `let percentage = (value / maxValue) * 100`
- Use percentage to select correct image from array of 6 images

## File Dependencies (Loading Order)

**Critical**: Files must load in this order (see `index.html`):
1. `DrawableObject` → `MovableObject` (base classes)
2. All entity classes (Character, Chicken, SmallChicken, etc.)
3. `World` (depends on all entities)
4. `Level` (defines enemy/collectible placement)
5. `game.js` (creates World with Level, calls init())

**Breaking this order causes "class not defined" errors.**

## Data Flow in World

`World` (game manager) handles:
- **Drawing**: Calls `ctx.drawImage()` for all objects
- **Collision detection**: Checks every object pair in update loop
  - Top-collision → squash enemies
  - Reward collisions → coins/bottles/character health
  - Side collisions → character damage
- **Audio management**: Starts/loops background and endboss sounds
- **UI rendering**: Draws all 4 status bars in fixed positions
- **Game boundaries**: Prevents character moving beyond `level.level_end_x`

## Component Integration Points

### Character ↔ World
- `this.character = new Character()` in World constructor
- World checks collisions with `this.character`
- World updates character position via `character.moveRight()`, `character.moveLeft()`, `character.jump()`

### Level ↔ World
- Level is passed to World constructor: `this.level = level`
- Level defines arrays: `enemies`, `coins`, `bottles`, `backgroundObjects`, `clouds`
- World iterates these arrays for collisions and drawing

### Audio System ↔ World
- Background: `new Audio('audio/...').play()` on init, loop = true
- Endboss theme: Starts when `character.x > 3500`, loops continuously
- Event sounds: Created fresh on each collision/action

## Development Workflows

### Running the Game
Simply open `index.html` in a browser. No build step needed (vanilla JS).

### Debugging Collisions
Add console logs in `world.js` collision checks:
```javascript
console.log(`Character at x:${this.character.x}, Chicken at x:${chicken.x}`);
```

### Adjusting Game Difficulty
- **Endboss attack timing**: Modify interval in `endboss.animate()` setInterval (currently 4000ms = 4s cycle)
- **Enemy spawn positions**: Edit `level1.js` enemy x-coordinates (character starts at 100)
- **Level length**: Adjust `level.level_end_x` in `level1.js`

### Adding New Enemy Types
1. Create `new-enemy.class.js` extending `MovableObject`
2. Add required methods: `animate()`, `squash()` (if squashable)
3. Add collision logic in `world.js`: check with `isCollidingFromTop()` or `isColliding()`
4. Add to `level1.js` enemies array
5. Add script tag to `index.html` BEFORE `game.js` loads

## Language & Conventions
- **Comments are in German** (user's preference)
- **Variable/method names in German** (e.g., `moveLinks`, `quetschen`)
- Class names in English (e.g., `Character`, `Endboss`)

## Common Pitfalls

1. **Physics signs flipped**: Remember `speedY < 0 = falling`. Don't reverse this.
2. **Audio cutting off**: Never reuse single Audio instance. Create `new Audio()` for events.
3. **Load order**: All class definitions must load before `game.js` tries to instantiate them.
4. **Collision timing**: `isCollidingFromTop()` has specific tolerance ranges. Adjust `extraRange` if new enemy types don't squash properly.
5. **Animation priority**: Check animation conditions in correct order. Wrong order = wrong animations playing.

## Key Files Reference
- **Game loop & collisions**: `models/world.class.js` (~150 lines)
- **Physics & collision detection**: `models/movable-object-class.js` (~50 lines)
- **Boss behavior logic**: `models/endboss.class.js` (animation states, health, AI)
- **Level definition**: `levels/level1.js` (x-positions, enemy types, collectible placement)
- **Game initialization**: `js/game.js` (creates World, handles keyboard input)
