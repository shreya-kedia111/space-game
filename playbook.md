# 🚀 Space Invaders: Rocket Defense - Developer Playbook

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Code Structure](#architecture--code-structure)
3. [Physics System & Guardrails](#physics-system--guardrails)
4. [Visual Design & Styling Guidelines](#visual-design--styling-guidelines)
5. [Game Mechanics](#game-mechanics)
6. [Performance Standards](#performance-standards)
7. [Development Guidelines](#development-guidelines)
8. [Testing & Quality Assurance](#testing--quality-assurance)
9. [Future Enhancement Ideas](#future-enhancement-ideas)

---

## Project Overview

**Space Invaders: Rocket Defense** is a modern 2D arcade-style shoot-em-up game built with vanilla HTML5 Canvas, CSS3, and JavaScript. The game features a rocket-piloting player defending Earth from alien invasion across three progressive levels.

### Core Technologies
- **HTML5 Canvas** for game rendering
- **CSS3** with custom animations and effects
- **Vanilla JavaScript** (ES6+) for game logic
- **Google Fonts** (Orbitron) for typography

---

## Architecture & Code Structure

### File Organization
```
shoot-em-up-game/
├── index.html          # Main HTML structure
├── style.css           # All styling and UI design
├── script.js           # Complete game engine
├── README.md           # Project documentation
└── playbook.md         # This developer guide
```

### Core Classes & Objects

#### 1. **Player Class**
```javascript
class Player {
    constructor()       // Initialize rocket properties
    update()           // Handle movement and animations
    draw()             // Render rocket with thruster effects
    takeDamage()       // Handle damage and invulnerability
    getBounds()        // Return collision boundaries
}
```

#### 2. **Enemy Class**
```javascript
class Enemy {
    constructor(x, y, type)  // Initialize enemy with type
    update()                 // Movement patterns and AI
    draw()                   // Type-specific rendering
    shoot()                  // Enemy firing mechanics
    getBounds()              // Collision boundaries
}
```

#### 3. **Bullet Class**
```javascript
class Bullet {
    constructor(x, y, direction, color, speed)
    update()           // Movement and trail effects
    draw()             // Render with glow effects
    getBounds()        // Collision boundaries
}
```

#### 4. **Explosion Class**
```javascript
class Explosion {
    constructor(x, y, color)  // Particle-based explosions
    update()                  // Particle physics
    draw()                    // Render particles
    isDead()                  // Cleanup check
}
```

---

## Physics System & Guardrails

### Movement Physics

#### Player Movement
- **Base Speed**: 6 pixels per frame
- **Boundary Constraints**: 
  - Left: `x >= 0`
  - Right: `x <= canvas.width - player.width`
- **Smooth Movement**: Continuous key-based movement (not discrete jumps)

#### Bullet Physics
- **Player Bullets**: 
  - Speed: 8 pixels/frame upward (`direction = -1`)
  - Trail length: 5 frames
  - Auto-cleanup when `y < -height`
- **Enemy Bullets**:
  - Speed: 3 pixels/frame downward (`direction = 1`)
  - Color: Red (`#ff0000`)
  - Maximum concurrent: 3 bullets

#### Enemy Movement Patterns
```javascript
// Basic Enemy: Grid formation with periodic downward movement
if (this.moveCounter % 60 === 0) {
    this.y += 20;  // Move down every 60 frames
}
this.x += this.direction * this.speed * 0.5;

// Fast Enemy: Continuous horizontal with sine wave
this.x += this.direction * this.speed;
this.y += Math.sin(this.animationFrame) * 0.5;

// Shooter Enemy: Burst movement with shooting capability
if (this.moveCounter % 30 === 0) {
    this.x += this.direction * 20;
}
```

### Collision Detection
```javascript
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}
```

### Physics Constraints
- **Frame Rate**: 60 FPS target
- **Canvas Size**: 800x600 pixels (fixed)
- **Gravity**: None (space environment)
- **Friction**: Applied to explosion particles (`velocity *= 0.98`)

---

## Visual Design & Styling Guidelines

### Color Palette

#### Primary Colors
```css
/* Deep Space Theme */
--background-primary: #0a0a0a;
--background-secondary: #1a1a2e;
--background-tertiary: #16213e;

/* Neon Accent Colors */
--player-cyan: #00ffff;
--player-flames: #ff4500;
--bullet-yellow: #ffff00;
--ui-blue: #1e90ff;
--text-white: #ffffff;
```

#### Enemy Color Coding
```css
/* Level-based Enemy Colors */
--enemy-basic: #39ff14;    /* Neon Green - Level 1 */
--enemy-fast: #ff00ff;     /* Magenta - Level 2 */
--enemy-shooter: #ff4500;  /* Orange-Red - Level 3 */
--enemy-bullet: #ff0000;   /* Red */
```

#### UI/UX Colors
```css
--success: #00ffff;        /* Mission success */
--danger: #ff4500;         /* Mission failed */
--warning: #ffff00;        /* Score/points */
--info: #1e90ff;          /* HUD elements */
```

### Typography Standards

#### Font Family
```css
font-family: 'Orbitron', monospace;
```

#### Font Sizes
- **Main Title**: 3.5rem (56px)
- **Subtitle**: 1.5rem (24px)
- **HUD Labels**: 0.8rem (13px)
- **HUD Values**: 1.2rem (19px)
- **Instructions**: 1.2rem (19px)

### Visual Effects Standards

#### Glow Effects
```css
/* Standard glow implementation */
box-shadow: 0 0 30px color;
text-shadow: 0 0 20px color;
```

#### Animation Guidelines
- **Pulse Animation**: 2-second duration, infinite loop
- **Particle Lifetime**: 30 frames maximum
- **Trail Effects**: 5-frame history
- **Invulnerability Flash**: 5-frame intervals

### UI Component Standards

#### Buttons
```css
.button {
    background: linear-gradient(45deg, #00ffff, #1e90ff);
    color: #0a0a0a;
    padding: 15px 30px;
    border-radius: 10px;
    font-family: 'Orbitron', monospace;
    font-weight: 700;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}
```

#### HUD Elements
```css
.hud-item {
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid #00ffff;
    border-radius: 10px;
    padding: 10px 20px;
    min-width: 120px;
}
```

---

## Game Mechanics

### Level Progression System

#### Level Configuration
```javascript
const settings = {
    levels: [
        { 
            enemyCount: 12, 
            formation: 'grid',
            enemyType: 'basic',
            color: '#39ff14',
            moveSpeed: 1
        },
        // ... additional levels
    ]
};
```

#### Scoring System
- **Base Points**: 10 per enemy
- **Level Multiplier**: `points * level`
- **No time bonus** (pure skill-based scoring)

#### Lives System
- **Starting Lives**: 3
- **Invulnerability Period**: 120 frames (2 seconds at 60fps)
- **Visual Feedback**: Heart emojis in HUD

### Enemy AI Behavior

#### Shooting Logic
```javascript
// Shooter enemies only
if (this.shootCooldown <= 0 && Math.random() < settings.enemyShootChance * 2) {
    this.shoot();
    this.shootCooldown = 60; // 1-second cooldown
}
```

#### Formation Spawning
- **Grid**: Evenly spaced rectangular formation
- **V-Shape**: Alternating sides from center
- **Wave**: Sine-wave based positioning

---

## Performance Standards

### Target Metrics
- **Frame Rate**: Stable 60 FPS
- **Memory Usage**: < 50MB for extended gameplay
- **Load Time**: < 2 seconds on average hardware

### Optimization Guidelines

#### Object Pooling
```javascript
// Implement for bullets and particles
const bulletPool = [];
const particlePool = [];
```

#### Cleanup Standards
```javascript
// Remove off-screen objects immediately
if (bullet.y < -bullet.height || bullet.y > canvas.height) {
    bullets.splice(index, 1);
}
```

#### Canvas Performance
- Use `clearRect()` instead of full canvas clear when possible
- Batch similar drawing operations
- Minimize `ctx.save()` and `ctx.restore()` calls

---

## Development Guidelines

### Code Style Standards

#### Naming Conventions
- **Classes**: PascalCase (`Player`, `Enemy`, `Explosion`)
- **Functions**: camelCase (`updateGameState`, `checkCollision`)
- **Constants**: UPPER_SNAKE_CASE (`GAME_STATES`, `MAX_BULLETS`)
- **Variables**: camelCase (`playerSpeed`, `enemyCount`)

#### Function Organization
```javascript
// 1. Class definitions
// 2. Utility functions
// 3. Game state management
// 4. Update/render loops
// 5. Event handlers
// 6. Initialization
```

#### Comments Standards
```javascript
// Single-line comments for brief explanations
/**
 * Multi-line JSDoc comments for functions
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {Object} Collision bounds
 */
```

### Git Workflow
1. **Feature branches**: `feature/enemy-ai-improvements`
2. **Bug fixes**: `bugfix/collision-detection`
3. **Releases**: `release/v1.1.0`

### Version Control Guidelines
- Commit early and often
- Write descriptive commit messages
- Include tests with new features
- Update documentation with changes

---

## Testing & Quality Assurance

### Manual Testing Checklist

#### Gameplay Testing
- [ ] Player movement (left/right boundaries)
- [ ] Shooting mechanics (bullet spawning/cleanup)
- [ ] Enemy movement patterns per level
- [ ] Collision detection accuracy
- [ ] Lives system and invulnerability
- [ ] Level progression and victory conditions
- [ ] Score calculation and display

#### Visual Testing
- [ ] Rocket graphics and animations
- [ ] Enemy type visual differences
- [ ] Explosion effects and particles
- [ ] HUD element positioning
- [ ] Start/game over screen functionality
- [ ] Responsive design (different screen sizes)

#### Performance Testing
- [ ] Frame rate stability during intense action
- [ ] Memory usage over extended gameplay
- [ ] No memory leaks after multiple restarts

### Browser Compatibility
- **Chrome** 90+ ✅
- **Firefox** 88+ ✅
- **Safari** 14+ ✅
- **Edge** 90+ ✅

---

## Future Enhancement Ideas

### Gameplay Features
1. **Power-ups**
   - Rapid fire mode
   - Shield barriers
   - Multi-shot spread
   - Temporary invulnerability

2. **Additional Enemy Types**
   - Boss enemies with multiple hit points
   - Kamikaze enemies that dive at player
   - Shielded enemies requiring multiple hits

3. **Environmental Hazards**
   - Asteroid fields
   - Moving barriers
   - Gravity wells

### Technical Improvements
1. **Audio System**
   - Background music
   - Sound effects for shooting/explosions
   - Audio volume controls

2. **Save System**
   - High score persistence
   - Level progress saving
   - Player preferences

3. **Multiplayer Support**
   - Local co-op mode
   - Online leaderboards
   - Competitive modes

### Visual Enhancements
1. **Advanced Graphics**
   - Sprite-based graphics
   - Animated enemy sprites
   - Background parallax scrolling

2. **Particle Systems**
   - Engine trails for rocket
   - Debris from destroyed enemies
   - Screen distortion effects

---

## Code Examples

### Adding a New Enemy Type

```javascript
// 1. Add to level configuration
const newEnemyType = {
    enemyCount: 20,
    formation: 'spiral',
    enemyType: 'heavy',
    color: '#8a2be2',
    moveSpeed: 0.5
};

// 2. Implement in Enemy class
drawHeavyEnemy() {
    ctx.fillStyle = this.color;
    // Double-size enemy with armor plating
    ctx.fillRect(this.x, this.y, this.width * 2, this.height * 2);
    
    // Add armor details
    ctx.fillStyle = '#silver';
    ctx.fillRect(this.x + 5, this.y + 5, this.width * 2 - 10, 5);
}
```

### Adding Power-ups

```javascript
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'rapidfire', 'shield', 'multishot'
        this.lifetime = 300; // 5 seconds
    }
    
    applyTo(player) {
        switch(this.type) {
            case 'rapidfire':
                player.fireRate *= 2;
                break;
            case 'shield':
                player.shieldActive = true;
                break;
        }
    }
}
```

---

## Troubleshooting Guide

### Common Issues

#### Performance Problems
- **Symptom**: Frame rate drops during gameplay
- **Solution**: Check for object cleanup, reduce particle count
- **Prevention**: Implement object pooling, profile regularly

#### Collision Detection Issues
- **Symptom**: Bullets pass through enemies
- **Solution**: Verify `getBounds()` implementation
- **Prevention**: Add visual collision debugging

#### Visual Glitches
- **Symptom**: Flickering or incorrect rendering
- **Solution**: Check `ctx.save()`/`ctx.restore()` pairing
- **Prevention**: Minimize state changes, use consistent drawing order

---

## Contact & Contribution

For questions, suggestions, or contributions to this playbook:

1. **Code Reviews**: All changes require peer review
2. **Documentation**: Update this playbook with any architectural changes
3. **Testing**: Include test scenarios with new features

---

*Last Updated: July 29, 2025*
*Version: 1.0.0*
*Maintainer: Development Team*
