# El Pollo Loco - AI Coding Guidelines

## Project Overview
A 2D platformer game built with vanilla JavaScript and Canvas API. The game features a player character jumping on enemies to "squash" them, collecting coins and bottles, and defeating an endboss. German-language gameplay.

**NO BUILD SYSTEM**: Open `index.html` directly in browser. Pure vanilla JS/Canvas.

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

### Game Orchestration Layer
- **`startscreen.js`**: Game lifecycle manager (312 lines)
  - Manages start/pause/resume/restart/game over
  - Controls UI (start screen, game won, game over, settings menu)
  - Owns global state: `isMuted`, `isPaused`, `menuOpen`, `intervalIds[]`
- **`game.js`**: Entry point (53 lines)
  - Creates canvas, keyboard, calls `init()`
  - Instantiates World with fresh Level from `createLevel()`
- **`world.class.js`**: Game logic hub (317 lines)
  - Collision detection, enemy management, drawing
  - Owns `bottleInFlight` flag, game loop intervals

### Critical Physics Details
- **Y-axis is inverted**: `y -= speedY` moves DOWN, `y += speedY` moves UP
- **Gravity**: `speedY -= acceleration` means objects gain downward speed
- **Therefore**: `speedY < 0` = falling/moving down, NOT `speedY > 0`
- **Jump**: Sets `speedY = 30` (positive value), then gravity makes it negative/falling

## Game State Management

### Pause/Resume System (CRITICAL PATTERN)
**Global flag approach** - checked at start of every `setInterval` callback:
```javascript
// Example from character.class.js
setInterval(() => {
    if (isPaused) return;  // Check FIRST, before any logic
    // ... game logic here
}, 1000/60);
```

**Why this pattern?**
- Simple: Single global flag vs complex interval wrapper functions
- Reliable: No need to track/pause/resume each interval individually
- Clean: Early return keeps code readable

**Files with isPaused checks** (~15 intervals across 8 files):
- `world.class.js`: `draw()`, `run()` game loop
- `character.class.js`: Movement + animation intervals
- `endboss.class.js`: All 3 animation intervals
- `chicken.class.js`, `small-chicken.class.js`: Movement + animation
- `cloud.class.js`: Movement interval
- `throwable-object.class.js`: Throw animation + ground check
- `movable-object-class.js`: `applyGravity()` interval
- `bottle.class.js`: `animateOnGround()` interval

### Interval Management Pattern
**Global array tracks all intervals for cleanup:**
```javascript
// startscreen.js
let intervalIds = [];

function addInterval(id) {
    intervalIds.push(id);
}

function resetIntervals() {
    intervalIds.forEach(clearInterval);
    intervalIds = [];
}
```

**Usage in classes:**
```javascript
// Any class creating intervals
const id = setInterval(() => { ... }, 100);
addInterval(id);  // Register for cleanup
```

**Why?** Prevents memory leaks on restart/game over. All intervals cleared via `resetIntervals()`.

### Game Lifecycle & State Flags

**State Flags (startscreen.js):**
- `isMuted = false` - Master audio switch
- `isPaused = false` - Pause state for Settings menu
- `menuOpen = false` - Settings menu visibility
- `intervalIds = []` - Tracks all intervals for cleanup

**State Flags (world.class.js):**
- `bottleInFlight = false` - Single bottle throw restriction
- `isGameOver = false` - Game ended (loss)
- `gameWonShown = false` - Victory screen displayed

**State Lifecycle:**
1. **Start**: `startGame()` → Creates World → Calls `init()` → `createLevel()` → Fresh game
2. **Pause**: Settings button → `pauseGame()` → Sets `isPaused = true` → Clears game loop interval
3. **Resume**: Close settings → `resumeGame()` → Sets `isPaused = false` → Restarts `world.run()`
4. **Game Over**: Character dies → `showGameOver()` → Stops audio, shows UI, resets endboss
5. **Victory**: Endboss dies → `showGameWon()` → Plays victory sound, shows UI, stops audio
6. **Restart**: NEU START → `restartGame()` → Closes menus, resets flags, stops sounds, calls `startGame()`

### Level Regeneration (CRITICAL)
**Level must be created fresh each game** to respawn coins/bottles:

```javascript
// level1.js - EXPORT FUNCTION, not static object
function createLevel() {
    return new Level(
        [/* enemies */],
        [/* clouds */],
        [/* backgrounds */],
        [/* coins */],
        [/* bottles */]
    );
}
const level1 = createLevel();  // For backwards compatibility

// game.js - Call function in init()
function init() {
    canvas = document.getElementById('canvas');
    const level = createLevel();  // Fresh level each time!
    world = new World(canvas, keyboard, level);
}
```

**Why?** Level arrays are modified during gameplay (items removed on collection). Static `level1` object would have empty arrays after first playthrough.

## Key Code Patterns

### Collision Detection
Two specialized methods in `MovableObject`:
- **`isColliding(movableObject)`**: Basic AABB bounding box, used for general collisions
- **`isCollidingFromTop(enemy)`**: Specialized for jumping on enemies
  - Checks `speedY < 0` (must be falling)
  - Dynamic tolerance: `enemy.height < 50 ? 25px : 15px` (smaller enemies easier to hit)
  - Used in `world.js` for squashing chickens

**Special collision for item collection** (world.class.js):
- **`isCharacterCollectingItem(item)`**: Ignores character's head (top 120px)
- Used for coins/bottles only - enemy collisions use standard methods
- **Why?** Character sprite is tall (280px), head shouldn't count for pickups

**Example**: When character collides with chicken from top:
```javascript
if (this.character.isCollidingFromTop(chicken)) {
    chicken.squash();
    // Creates new Audio() for overlapping sounds
}
```

**Example**: Item collection with body-only hitbox:
```javascript
// world.class.js
isCharacterCollectingItem(item) {
    const characterBodyY = this.character.y + 120;  // Ignore head
    const characterBodyHeight = this.character.height - 120;
    
    return this.character.x + this.character.width > item.x &&
        this.character.x < item.x + item.width &&
        characterBodyY + characterBodyHeight > item.y &&
        characterBodyY < item.y + item.height;
}

// Usage
if (this.isCharacterCollectingItem(coin)) {
    // Collect coin
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
- Endboss theme: Starts when `character.x > 3000`, loops continuously
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
- **Endboss attack timing**: Modify interval in `endboss.animate()` setInterval (currently 8s cycle: 1s Alert → 1s Attack → 6s Walking)
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
- **Game lifecycle management**: `startscreen.js` (pause/resume, restart, game over, state flags)
- **Game loop & collisions**: `models/world.class.js` (~317 lines)
- **Physics & collision detection**: `models/movable-object-class.js` (~50 lines)
- **Boss behavior logic**: `models/endboss.class.js` (animation states, health, AI)
- **Level definition**: `levels/level1.js` (x-positions, enemy types, collectible placement)
- **Game initialization**: `js/game.js` (creates World, handles keyboard input)
