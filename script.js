// Game State Management
const GAME_STATES = {
    START: 'start',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver',
    PAUSED: 'paused'
};

// Initialize game variables
let canvas, ctx;
let gameState = GAME_STATES.START;
let player;
let bullets = [];
let enemies = [];
let explosions = [];
let particles = [];
let enemyBullets = [];
let level = 1;
let score = 0;
let lives = 3;
let keys = {};
let lastEnemyShot = 0;
let gameStartTime = 0;

// Game settings with enhanced mechanics
const settings = {
    playerSpeed: 6,
    bulletSpeed: 8,
    enemySpeed: 1,
    enemyShootChance: 0.001,
    enemyBulletSpeed: 3,
    maxEnemyBullets: 3,
    levels: [
        { 
            enemyCount: 12, 
            formation: 'grid',
            enemyType: 'basic',
            color: '#39ff14',
            moveSpeed: 1
        },
        { 
            enemyCount: 18, 
            formation: 'v-shape',
            enemyType: 'fast',
            color: '#ff00ff',
            moveSpeed: 1.5
        },
        { 
            enemyCount: 24, 
            formation: 'wave',
            enemyType: 'shooter',
            color: '#ff4500',
            moveSpeed: 2
        }
    ]
};

// Enhanced Player class with rocket graphics
class Player {
    constructor() {
        this.width = 30;
        this.height = 40;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 20;
        this.speed = settings.playerSpeed;
        this.thrusterAnimation = 0;
        this.invulnerable = 0;
    }

    update() {
        // Handle movement
        if (keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] && this.x < canvas.width - this.width) {
            this.x += this.speed;
        }
        
        // Update thruster animation
        this.thrusterAnimation += 0.3;
        
        // Update invulnerability
        if (this.invulnerable > 0) {
            this.invulnerable--;
        }
    }

    draw() {
        ctx.save();
        
        // Flash effect when invulnerable
        if (this.invulnerable > 0 && Math.floor(this.invulnerable / 5) % 2) {
            ctx.globalAlpha = 0.5;
        }
        
        // Draw rocket body
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width * 0.8, this.y + this.height * 0.7);
        ctx.lineTo(this.x + this.width * 0.6, this.y + this.height * 0.7);
        ctx.lineTo(this.x + this.width * 0.6, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.4, this.y + this.height);
        ctx.lineTo(this.x + this.width * 0.4, this.y + this.height * 0.7);
        ctx.lineTo(this.x + this.width * 0.2, this.y + this.height * 0.7);
        ctx.closePath();
        ctx.fill();
        
        // Draw rocket details
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + this.width * 0.45, this.y + this.height * 0.2, this.width * 0.1, this.height * 0.3);
        
        // Draw thruster flames
        if (keys['ArrowLeft'] || keys['ArrowRight']) {
            ctx.fillStyle = `hsl(${20 + Math.sin(this.thrusterAnimation) * 20}, 100%, 60%)`;
            ctx.beginPath();
            ctx.moveTo(this.x + this.width * 0.4, this.y + this.height);
            ctx.lineTo(this.x + this.width * 0.45, this.y + this.height + 10 + Math.sin(this.thrusterAnimation) * 3);
            ctx.lineTo(this.x + this.width * 0.5, this.y + this.height + 5);
            ctx.lineTo(this.x + this.width * 0.55, this.y + this.height + 10 + Math.sin(this.thrusterAnimation + 1) * 3);
            ctx.lineTo(this.x + this.width * 0.6, this.y + this.height);
            ctx.fill();
        }
        
        ctx.restore();
    }

    takeDamage() {
        if (this.invulnerable <= 0) {
            lives--;
            this.invulnerable = 120; // 2 seconds at 60fps
            createExplosion(this.x + this.width / 2, this.y + this.height / 2, '#00ffff');
            return true;
        }
        return false;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// Enhanced Bullet class
class Bullet {
    constructor(x, y, direction = -1, color = '#ffff00', speed = settings.bulletSpeed) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 12;
        this.speed = speed;
        this.direction = direction;
        this.color = color;
        this.trail = [];
    }

    update() {
        this.y += this.speed * this.direction;
        
        // Add trail effect
        this.trail.push({ x: this.x + this.width / 2, y: this.y + this.height / 2 });
        if (this.trail.length > 5) {
            this.trail.shift();
        }
    }

    draw() {
        // Draw trail
        ctx.save();
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = (i + 1) / this.trail.length * 0.5;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.trail[i].x - 1, this.trail[i].y - 1, 2, 2);
        }
        ctx.restore();
        
        // Draw bullet
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add glow effect
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// Enhanced Enemy class with different types
class Enemy {
    constructor(x, y, type = 'basic') {
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 25;
        this.type = type;
        this.speed = settings.levels[level - 1].moveSpeed;
        this.color = settings.levels[level - 1].color;
        this.direction = 1;
        this.moveCounter = 0;
        this.shootCooldown = 0;
        this.animationFrame = 0;
    }

    update() {
        this.animationFrame += 0.1;
        this.moveCounter++;
        
        // Different movement patterns based on type
        switch (this.type) {
            case 'basic':
                if (this.moveCounter % 60 === 0) {
                    this.y += 20;
                }
                this.x += this.direction * this.speed * 0.5;
                break;
            case 'fast':
                this.x += this.direction * this.speed;
                this.y += Math.sin(this.animationFrame) * 0.5;
                break;
            case 'shooter':
                if (this.moveCounter % 30 === 0) {
                    this.x += this.direction * 20;
                }
                if (this.shootCooldown <= 0 && Math.random() < settings.enemyShootChance * 2) {
                    this.shoot();
                    this.shootCooldown = 60;
                }
                break;
        }
        
        // Change direction when hitting edges
        if (this.x <= 0 || this.x >= canvas.width - this.width) {
            this.direction *= -1;
            this.y += 10;
        }
        
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
    }

    draw() {
        ctx.save();
        
        // Draw enemy based on type
        switch (this.type) {
            case 'basic':
                this.drawBasicEnemy();
                break;
            case 'fast':
                this.drawFastEnemy();
                break;
            case 'shooter':
                this.drawShooterEnemy();
                break;
        }
        
        ctx.restore();
    }

    drawBasicEnemy() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add pulsing glow
        ctx.save();
        ctx.globalAlpha = 0.3 + Math.sin(this.animationFrame * 2) * 0.2;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    drawFastEnemy() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        
        // Add trail effect
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 5, this.y + this.height, this.width - 10, 5);
        ctx.restore();
    }

    drawShooterEnemy() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add weapon indicator
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + this.width / 2 - 2, this.y + this.height, 4, 8);
        
        // Add charging effect when about to shoot
        if (this.shootCooldown < 10 && this.shootCooldown > 0) {
            ctx.save();
            ctx.globalAlpha = 0.8;
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
            ctx.restore();
        }
    }

    shoot() {
        if (enemyBullets.length < settings.maxEnemyBullets) {
            enemyBullets.push(new Bullet(
                this.x + this.width / 2 - 2,
                this.y + this.height,
                1,
                '#ff0000',
                settings.enemyBulletSpeed
            ));
        }
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// Explosion class for visual effects
class Explosion {
    constructor(x, y, color = '#ff4500') {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.lifetime = 30;
        
        // Create explosion particles
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: color,
                life: 30
            });
        }
    }

    update() {
        this.lifetime--;
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            particle.life--;
        });
    }

    draw() {
        this.particles.forEach(particle => {
            if (particle.life > 0) {
                ctx.save();
                ctx.globalAlpha = particle.life / 30;
                ctx.fillStyle = particle.color;
                ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
                ctx.restore();
            }
        });
    }

    isDead() {
        return this.lifetime <= 0;
    }
}

// Utility functions
function createExplosion(x, y, color = '#ff4500') {
    explosions.push(new Explosion(x, y, color));
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function spawnEnemies() {
    enemies = [];
    const levelData = settings.levels[level - 1];
    const formation = levelData.formation;
    const enemyType = levelData.enemyType;
    
    switch (formation) {
        case 'grid':
            spawnGridFormation(levelData.enemyCount, enemyType);
            break;
        case 'v-shape':
            spawnVFormation(levelData.enemyCount, enemyType);
            break;
        case 'wave':
            spawnWaveFormation(levelData.enemyCount, enemyType);
            break;
    }
}

function spawnGridFormation(count, type) {
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const spacing = 60;
    const startX = (canvas.width - (cols - 1) * spacing) / 2;
    
    for (let i = 0; i < count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * spacing;
        const y = 50 + row * 50;
        enemies.push(new Enemy(x, y, type));
    }
}

function spawnVFormation(count, type) {
    const centerX = canvas.width / 2;
    const spacing = 40;
    
    for (let i = 0; i < count; i++) {
        const side = i % 2 === 0 ? 1 : -1;
        const offset = Math.floor(i / 2) * spacing;
        const x = centerX + side * offset;
        const y = 50 + Math.abs(offset) * 0.5;
        enemies.push(new Enemy(x, y, type));
    }
}

function spawnWaveFormation(count, type) {
    const spacing = canvas.width / (count + 1);
    
    for (let i = 0; i < count; i++) {
        const x = spacing * (i + 1);
        const y = 50 + Math.sin(i * 0.5) * 30;
        enemies.push(new Enemy(x, y, type));
    }
}

// Game initialization
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Initialize player
    player = new Player();
    
    // Event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('restartButton').addEventListener('click', restartGame);
    
    // Start game loop
    gameLoop();
}

function startGame() {
    gameState = GAME_STATES.PLAYING;
    gameStartTime = Date.now();
    score = 0;
    level = 1;
    lives = 3;
    bullets = [];
    enemies = [];
    enemyBullets = [];
    explosions = [];
    
    player = new Player();
    spawnEnemies();
    
    // Hide start screen, show game UI
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameUI').style.display = 'block';
    
    updateHUD();
}

function restartGame() {
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'block';
    gameState = GAME_STATES.START;
}

function gameOver(victory = false) {
    gameState = GAME_STATES.GAME_OVER;
    
    document.getElementById('gameUI').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'block';
    
    const finalMessage = document.getElementById('finalMessage');
    if (victory) {
        finalMessage.innerHTML = '🎉 MISSION ACCOMPLISHED! 🎉<br>Earth has been saved!';
        finalMessage.style.color = '#00ffff';
    } else {
        finalMessage.innerHTML = '💥 MISSION FAILED 💥<br>Earth has fallen to the invasion...';
        finalMessage.style.color = '#ff4500';
    }
    
    document.getElementById('finalScore').textContent = score;
}

function updateHUD() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lives').textContent = '❤️'.repeat(lives);
}

// Game loop
function gameLoop() {
    if (gameState === GAME_STATES.PLAYING) {
        update();
    }
    render();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Update player
    player.update();
    
    // Update bullets
    bullets.forEach((bullet, index) => {
        bullet.update();
        if (bullet.y < -bullet.height) {
            bullets.splice(index, 1);
        }
    });
    
    // Update enemy bullets
    enemyBullets.forEach((bullet, index) => {
        bullet.update();
        if (bullet.y > canvas.height) {
            enemyBullets.splice(index, 1);
        }
        
        // Check collision with player
        if (checkCollision(bullet.getBounds(), player.getBounds())) {
            enemyBullets.splice(index, 1);
            if (player.takeDamage()) {
                if (lives <= 0) {
                    gameOver(false);
                    return;
                }
            }
        }
    });
    
    // Update enemies
    enemies.forEach((enemy, index) => {
        enemy.update();
        
        // Check if enemy reached bottom
        if (enemy.y + enemy.height > canvas.height - 50) {
            gameOver(false);
            return;
        }
        
        // Check collision with player
        if (checkCollision(enemy.getBounds(), player.getBounds())) {
            if (player.takeDamage()) {
                enemies.splice(index, 1);
                createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                if (lives <= 0) {
                    gameOver(false);
                    return;
                }
            }
        }
    });
    
    // Check bullet-enemy collisions
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (checkCollision(bullet.getBounds(), enemy.getBounds())) {
                bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
                score += 10 * level;
                createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                
                // Check if level complete
                if (enemies.length === 0) {
                    level++;
                    if (level > settings.levels.length) {
                        gameOver(true);
                        return;
                    } else {
                        setTimeout(() => {
                            spawnEnemies();
                        }, 1000);
                    }
                }
            }
        });
    });
    
    // Update explosions
    explosions.forEach((explosion, index) => {
        explosion.update();
        if (explosion.isDead()) {
            explosions.splice(index, 1);
        }
    });
    
    updateHUD();
}

// Render game
function render() {
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#1a0a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    drawStarfield();
    
    if (gameState === GAME_STATES.PLAYING) {
        // Draw game objects
        player.draw();
        
        bullets.forEach(bullet => bullet.draw());
        enemyBullets.forEach(bullet => bullet.draw());
        enemies.forEach(enemy => enemy.draw());
        explosions.forEach(explosion => explosion.draw());
    }
}

function drawStarfield() {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
        const x = (i * 137.5) % canvas.width;
        const y = (i * 234.7 + Date.now() * 0.01) % canvas.height;
        const size = (i % 3) + 1;
        ctx.fillRect(x, y, size, size);
    }
}

// Input handling
function handleKeyDown(event) {
    keys[event.key] = true;
    
    if (event.key === ' ') {
        event.preventDefault();
        if (gameState === GAME_STATES.PLAYING) {
            bullets.push(new Bullet(
                player.x + player.width / 2 - 2,
                player.y,
                -1,
                '#ffff00',
                settings.bulletSpeed
            ));
        }
    }
}

function handleKeyUp(event) {
    keys[event.key] = false;
}

// Start the game
window.onload = init;