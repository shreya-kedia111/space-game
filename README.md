# 🚀 Space Invaders: Rocket Defense

A modern, arcade-style 2D space shooter game built with HTML5 Canvas, CSS3, and vanilla JavaScript. Defend Earth from alien invasion across three progressively challenging levels!

![Game Preview](https://img.shields.io/badge/Game-Space%20Invaders-blue?style=for-the-badge&logo=javascript)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## 🎮 Live Demo

Play the game live: **[Space Invaders: Rocket Defense](https://shreya-kedia111.github.io/space-game)**

## ✨ Features

### 🚀 Rocket Graphics & Physics
- **Custom rocket design** with animated thruster flames
- **Smooth movement controls** with boundary constraints
- **Invulnerability system** with visual feedback
- **Lives system** with heart indicators

### 👾 Advanced Enemy AI
- **3 Enemy Types**: Basic, Fast, and Shooter enemies
- **Multiple formations**: Grid, V-shape, and Wave patterns
- **Progressive difficulty** across 3 levels
- **Enemy shooting mechanics** with return fire

### 💥 Visual Effects
- **Particle-based explosions** with dynamic colors
- **Bullet trail effects** and glow animations
- **Animated starfield** background
- **Neon color scheme** with contrasting palette

### 🎯 Game Mechanics
- **3 Progressive levels** with increasing challenge
- **Scoring system** with level multipliers
- **Bidirectional combat** (enemies shoot back!)
- **Victory/defeat conditions** with mission status

## 🕹️ Controls

| Key | Action |
|-----|--------|
| ←→ Arrow Keys | Move rocket left/right |
| SPACEBAR | Shoot bullets |
| START MISSION | Begin the game |
| RESTART MISSION | Play again |

## 🛠️ Technology Stack

- **HTML5 Canvas** - Game rendering and graphics
- **CSS3** - Styling, animations, and UI design
- **Vanilla JavaScript (ES6+)** - Game logic and physics
- **Google Fonts (Orbitron)** - Futuristic typography

## 🚀 Quick Start

### Option 1: Play Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/shreya-kedia111/space-game.git
   cd space-game
   ```

2. Start a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. Open your browser and navigate to `http://localhost:8000`

### Option 2: GitHub Pages
1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from a branch" → `main` branch
4. Your game will be live at `https://shreya-kedia111.github.io/space-game`

## 📁 Project Structure

```
space-game/
├── index.html          # Main HTML structure
├── style.css           # All styling and UI design
├── script.js           # Complete game engine
├── playbook.md         # Developer documentation
└── README.md           # This file
```

## 🎨 Color Palette

The game uses a carefully designed neon color scheme:

- **Background**: Deep space black (`#0a0a0a`) to space purple (`#1a1a2e`)
- **Player**: Bright cyan (`#00ffff`) with orange flames (`#ff4500`)
- **Bullets**: Electric yellow (`#ffff00`)
- **Enemies**: 
  - Level 1: Neon green (`#39ff14`)
  - Level 2: Magenta (`#ff00ff`)
  - Level 3: Orange-red (`#ff4500`)

## 🏗️ Architecture

### Core Classes
- **`Player`** - Rocket control, movement, and damage handling
- **`Enemy`** - AI behavior, movement patterns, and shooting
- **`Bullet`** - Projectile physics and trail effects
- **`Explosion`** - Particle-based visual effects

### Game States
- **Start Screen** - Mission briefing and instructions
- **Playing** - Active gameplay with HUD
- **Game Over** - Victory/defeat with final score

## 🔧 Development

For developers wanting to contribute or modify the game, see our comprehensive [Developer Playbook](playbook.md) which includes:

- Physics system and guardrails
- Visual design guidelines
- Code style standards
- Performance optimization
- Testing procedures
- Future enhancement ideas

## 🎯 Game Levels

| Level | Enemies | Formation | Type | Difficulty |
|-------|---------|-----------|------|------------|
| 1 | 12 | Grid | Basic | ⭐ |
| 2 | 18 | V-Shape | Fast | ⭐⭐ |
| 3 | 24 | Wave | Shooter | ⭐⭐⭐ |

## 🏆 Scoring System

- **Base Points**: 10 per enemy destroyed
- **Level Multiplier**: Points × current level
- **No time penalty** - Pure skill-based scoring

## 🔮 Future Enhancements

- [ ] **Power-ups** (rapid fire, shields, multi-shot)
- [ ] **Audio system** (background music, sound effects)
- [ ] **Boss enemies** with multiple hit points
- [ ] **Local multiplayer** co-op mode
- [ ] **High score persistence** with localStorage
- [ ] **Mobile touch controls** for responsive play

## 🤝 Contributing

Contributions are welcome! Please read our [Developer Playbook](playbook.md) for coding standards and guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the classic **Space Invaders** arcade game
- Built with modern web technologies for optimal performance
- Designed with accessibility and responsive design in mind

---

**Made with ❤️ and lots of ☕**

*Defend Earth. Save humanity. Become a space hero!* 🌍🚀✨

## Development
This game was developed as a fun project to practice HTML, CSS, and JavaScript. Contributions and feedback are welcome!